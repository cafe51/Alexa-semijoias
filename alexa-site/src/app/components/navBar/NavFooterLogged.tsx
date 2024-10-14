import { useLogout } from '@/app/hooks/useLogout';
import { FireBaseDocument, UserType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface NavFooterLoggedProps { userInfo: (UserType & FireBaseDocument); router: AppRouterInstance; closeMenu: () => void }

export default function NavFooterLogged({ userInfo, router, closeMenu }: NavFooterLoggedProps) {
    const { logout } = useLogout();

    return (
        <div
            className="mt-auto p-6  bg-[#FDF0F5]"
            style={ {
            // um gradiente ao contrário, dessa vez debaixo para cima, começando com opacidade total embaixo e ficando transparente em cima. E ao invés da cor branca a cor usada deve ser #F8C3D3. 
                background: 'linear-gradient(to top, rgb(248, 195, 211) 0%, rgba(248, 248, 248, 1) 80%, rgba(248, 248, 248, 0.7) 100%)',

            } }
        >
        
            <h3 className="text-xl font-semibold mb-4 text-[#333333]">Olá, { userInfo.nome.split(' ')[0] }</h3>
            <div className="flex justify-between items-center">
                <Button variant="outline" className="border-[#FDF0F5] hover:bg-white" onClick={ () => {
                    router.push('/minha-conta');
                    closeMenu();
                } }>
                    <User className="mr-2 h-4 w-4" />
                    Minha conta
                </Button>
                <Button variant="outline" className="border-[#FDF0F5] hover:bg-white" onClick={ () => {
                    logout();
                    router.push('/');
                    closeMenu();
                } }>
                    Sair
                </Button>
            </div>
        </div>
    );
}