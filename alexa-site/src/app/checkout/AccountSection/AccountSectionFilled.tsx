// app/checkout/AccountSection/AccountSectionFilled.tsx
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { useLogout } from '@/app/hooks/useLogout';
import { useUserInfo } from '@/app/hooks/useUserInfo';

interface AccountSectionFilledProps {
    email: string;
    cpf: string;
    telefone: string;
  }

export default function AccountSectionFilled({ email, cpf, telefone }: AccountSectionFilledProps) {
    const { logout } = useLogout();
    const { carrinho } = useUserInfo();
    const { setLocalCart } = useLocalStorage();

    const changeAccount = () => {
        if(carrinho && carrinho.length > 0) {
            const cartInfos = carrinho.map(({ productId, quantidade }) => {
                return {
                    productId,
                    quantidade,
                    userId: 'guest',
                };
            });
            setLocalCart(cartInfos);
        }
        logout();
    };

    return (
        <section className='flex flex-col w-full bg-green-50 border-green-200 p-2 border-2 rounded-lg px-6'>
            <div className='flex justify-between w-full'>

                <p className="font-bold">CONTA</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                    onClick={ () => changeAccount() }
                >
              Trocar de conta
                </p>
            </div>

            <div className='flex flex-col p-2'>
                <p>{ email }</p>
                <p>{ cpf }</p>
                <p>{ telefone }</p>
            </div>
        </section>
    );
}