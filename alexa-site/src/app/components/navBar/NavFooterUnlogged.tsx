import { Button } from '@/components/ui/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function NavFooterUnlogged({ router, closeMenu }: {router: AppRouterInstance, closeMenu: () => void }) {
    return (
        <div
            className="mt-auto p-6"
            style={ {
                // um gradiente ao contrário, dessa vez debaixo para cima, começando com opacidade total embaixo e ficando transparente em cima. E ao invés da cor branca a cor usada deve ser #F8C3D3. 
                background: 'linear-gradient(to top, rgb(248, 195, 211) 0%, rgba(248, 248, 248, 1) 80%, rgba(248, 248, 248, 0.7) 100%)',

            } }
        >
            <div className="flex justify-between items-center">
                <Button variant="outline" className="border-l-0 border-y-0 rounded-r-none border-r-2 border-[#FDF0F5] hover:bg-white" onClick={ () => {
                    router.push('/cadastro');
                    closeMenu();
                } }>
    Cadastrar-se
                </Button>
                <Button variant="outline" className="border-r-0 border-y-0 rounded-l-none border-l-2 border-[#FDF0F5] hover:bg-white" onClick={ () => {
                    router.push('/login');
                    closeMenu();
                } }>
    Iniciar Sessão
                </Button>
            </div>
        </div>
    );
}