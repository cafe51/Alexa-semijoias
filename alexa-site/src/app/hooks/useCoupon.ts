// app/hooks/useCoupon.ts
import { useCollection } from './useCollection';
import { CouponType, CouponUsageType, CouponValidationResponse, FireBaseDocument, ProductCartType } from '@/app/utils/types';
import { where } from 'firebase/firestore';
import { useUserInfo } from './useUserInfo';
import { COUPONREVENDEDORAFIRSTCODE, COUPONREVENDEDORAVIP } from '../utils/constants';

export function useCoupon() {
    const couponCollection = useCollection<CouponType>('cupons');
    const ordersCollection = useCollection<CouponUsageType>('pedidos');

    const { userInfo } = useUserInfo();

    async function applyCoupon(code: string, cartPrice: number, carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[]): Promise<CouponValidationResponse> {
        if(code.includes('/')) {
            return { valido: false, mensagemErro: 'Cupom inválido' };
        }
        // Procura o cupom pelo código (garantindo tratamento de case se necessário)
        const coupon = await couponCollection.getDocumentById(code);
        if (!coupon || !coupon.exist) {
            return { valido: false, mensagemErro: 'Cupom inválido' };
        }
        // Valida status e datas de validade
        const now = new Date();
        if (coupon.status !== 'ativo') {
            return { valido: false, mensagemErro: 'Cupom inválido' };
        }
        if (coupon.dataInicio.toDate() > now) {
            return { valido: false, mensagemErro: 'Cupom inválido' };
        }
        if (coupon.dataExpiracao.toDate() < now) {
            return { valido: false, mensagemErro: 'Cupom expirado' };
        }
        // valida itens promocionais no carrinho
        if (
            carrinho && carrinho.length > 0
            && !coupon.condicoes.primeiraCompraApenas
            && !(coupon.id === COUPONREVENDEDORAFIRSTCODE)
            && !(coupon.id === COUPONREVENDEDORAVIP)
        ) {
            for (const item of carrinho) {
                if (item.value.promotionalPrice && item.value.promotionalPrice > 0) {
                    return { valido: false, mensagemErro: 'Este cupom não é válido para carrinhos com itens promocionais' };
                }
            }
        }

        if(coupon.id === COUPONREVENDEDORAVIP && userInfo && userInfo.userId) {
            const usageCountOfCouponRevendedoraFirst = await ordersCollection.getCount([
                where('userId', '==', userInfo.userId),
                where('status', '!=', 'cancelado'),
                where('couponId', '==', COUPONREVENDEDORAFIRSTCODE),
            ]);
            if(usageCountOfCouponRevendedoraFirst <= 0) {
                return { valido: false, mensagemErro: `Cupom válido para revenda. Torne-se um(a) revendedor(a) usando o cupom ${COUPONREVENDEDORAFIRSTCODE}.` };
            }
            
        }

        // Validação dos limites de uso global
        if (coupon.limiteUsoGlobal !== null) {
            if (coupon.limiteUsoGlobal <= 0) {
                return { valido: false, mensagemErro: 'Cupom esgotado' };
            }
        }
        // Validação do limite por usuário (se o usuário estiver logado)
        if (userInfo && userInfo.userId && coupon.limiteUsoPorUsuario !== null) {
            const userCount = await ordersCollection.getCount([
                where('couponId', '==', coupon.id),
                where('userId', '==', userInfo.userId),
            ]);
            if (userCount >= coupon.limiteUsoPorUsuario) {
                return { valido: false, mensagemErro: 'Você já usou esse cupom o máximo de vezes possíveis' };
            }
        }

        // Valida as condições do cupom (ex.: valor mínimo de compra)
        if (coupon.condicoes) {
            const mensagemErro = 'Essa compra não atende aos requisitos do cupom: ' + coupon.condicoes.textoExplicativo;
            const invalidConditionResult = { valido: false, mensagemErro };
            // console.log('cartPrice', cartPrice);
            // console.log('coupon.condicoes.valorMinimoCompra', coupon.condicoes.valorMinimoCompra);
            // condicao de valor mínimo de compra
            if (coupon.condicoes.valorMinimoCompra && (cartPrice < coupon.condicoes.valorMinimoCompra)) {
                console.log('coupon.condicoes.valorMinimoCompra', coupon.condicoes.valorMinimoCompra);

                return invalidConditionResult;
            }
            // condicao de categorias permitidas
            if (coupon.condicoes.categoriasPermitidas && coupon.condicoes.categoriasPermitidas.length > 0) {
                for (const categoria of coupon.condicoes.categoriasPermitidas) {
                    if (!carrinho.every(item => item.sections.includes(categoria))) {
                        return invalidConditionResult;
                    }
                }
            }
            // condicao de produtos específicos
            if (coupon.condicoes.produtosEspecificos && coupon.condicoes.produtosEspecificos.length > 0) {
                for (const produto of coupon.condicoes.produtosEspecificos) {
                    if (!carrinho.some(item => item.barcode === produto)) {
                        return invalidConditionResult;
                    }
                }
            }

            // condicao de primeira compra
            if (coupon.condicoes.primeiraCompraApenas && userInfo) {
                const comprasDoUsuarios = await ordersCollection.getDocumentsWithConstraints([
                    where('userId', '==', userInfo.userId),
                    where('status', '!=', 'cancelado'),
                ]);
                if (comprasDoUsuarios.length > 0) {
                    return invalidConditionResult;
                }
            }
            // condicao de somente usuários
            if (coupon.condicoes.somenteUsuarios && coupon.condicoes.somenteUsuarios.length > 0 && userInfo) {
                if (!coupon.condicoes.somenteUsuarios.includes(userInfo.userId)) {
                    return invalidConditionResult;
                }
            }
        }

        // Calcula o desconto conforme o tipo do cupom
        let desconto: number | 'freteGratis' = 0;
        if (coupon.tipo === 'percentual') {
            desconto = cartPrice * (coupon.valor / 100);
        } else if (coupon.tipo === 'fixo') {
            desconto = coupon.valor;
        } else if (coupon.tipo === 'freteGratis') {
            // Caso o cupom seja para frete grátis, o desconto será aplicado na taxa de entrega,
            // portanto, neste contexto, o desconto do carrinho permanece zero.
            desconto = 'freteGratis';
        }

        return { valido: true, descontoAplicado: desconto, coupon };
    }

    return { applyCoupon };
}
