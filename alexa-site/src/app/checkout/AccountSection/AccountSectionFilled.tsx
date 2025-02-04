// app/checkout/AccountSection/AccountSectionFilled.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { useLogout } from '@/app/hooks/useLogout';
import { useUserInfo } from '@/app/hooks/useUserInfo';

interface AccountSectionFilledProps {
    nome: string;
    email: string;
    cpf: string;
    telefone: string | undefined;
    adminDashboard?: boolean;
  }

export default function AccountSectionFilled({ nome, email, cpf, telefone, adminDashboard=false }: AccountSectionFilledProps) {
    const { logout } = useLogout();
    const { carrinho } = useUserInfo();
    const { setLocalCart } = useLocalStorage();

    const changeAccount = () => {
        if(carrinho && carrinho.length > 0) {
            const cartInfos = carrinho.map(({ productId, quantidade, skuId }) => {
                return {
                    productId,
                    quantidade,
                    skuId,
                    userId: 'guest',
                };
            });
            setLocalCart(cartInfos);
        }
        logout();
    };

    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="secColor text-[#333333]">
                <CardTitle className="flex justify-between">
                    <span className="text-xl">CONTA</span>
                    {
                        adminDashboard ||
                    <p className='text-[#D4AF37] text-sm w-full text-end md:text-lg cursor-pointer' onClick={ () => changeAccount() }>
                Trocar de conta
                    </p>    
                    }
                </CardTitle>

            </CardHeader>
            <CardContent className="pt-4 md:text-lg">
                <p className="font-semibold">{ nome }</p>
                <p>{ email }</p>
                <p>{ cpf }</p>
                <p>{ telefone }</p>
            </CardContent>
        </Card>
    );
}