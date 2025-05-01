import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';
import { ShippingOptionType } from '../utils/types';

interface FreeShippingWarning {
    precoDoProduto: number;
    precoParaFreteGratis: number;
    shippingOptions: ShippingOptionType[];
}
export default function FreeShippingWarning({ precoDoProduto, precoParaFreteGratis, shippingOptions }: FreeShippingWarning) {
    const temUmaOpcaoDeFreteGratis = !!shippingOptions.find((option) => option.price === 0);
    return (
        (precoParaFreteGratis > precoDoProduto) && (temUmaOpcaoDeFreteGratis === false)
            ?
            (
                <div className="p-4 border-dashed border-2 border-[#D4AF37]/50 bg-[#D4AF37]/2 rounded-md mb-4">
                    <p className="text-[#D4AF37] text-base mb-2">
          Compre <span className="font-bold">{ formatPrice(precoParaFreteGratis) }</span> em produtos para ganhar <span className="font-bold text-lg">FRETE GRÁTIS</span>.
                    </p>
                    <Link href={ '/section' }>
                        <h3 className="bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/50 px-4 py-2 rounded-md text-sm text-center">
                    Adicionar mais produtos
                        </h3>
                    </Link>
                </div>
            )
            :
            (
                <div className="p-4 border-dashed border-2 border-[#D4AF37]/50 bg-[#D4AF37]/5 rounded-md mb-4">
                    <p className="text-[#D4AF37] text-xl mb-2">Parabéns!</p>
                    <p className="text-[#D4AF37] text-sm mb-2">Você ganhou uma opção de <span className="font-bold">FRETE GRÁTIS</span> para esta compra.</p>
                </div>
            )
        
    );
}
