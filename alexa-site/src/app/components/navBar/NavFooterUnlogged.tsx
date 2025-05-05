import { Button } from '@/components/ui/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const NavFooterButton = ({ router, closeMenu, text, path }: { router: AppRouterInstance , closeMenu:() => void, text: string; path: string; }) => {
    const classBorders = text === 'Cadastrar-se' ? 'border-l-0 rounded-r-none border-r-2' : 'border-r-0 rounded-l-none border-l-2';
    return  (
        <Button
            variant="outline"
            className={ `text-xs min-[440px]:text-base sm:text-lg border-y-0 border-[#FDF0F5] hover:bg-white ${ classBorders }` }
            onClick={ () => {
                router.push(path);
                closeMenu();
            } }
        >
            { text }
        </Button>
    );
};

export default function NavFooterUnlogged({ router, closeMenu }: {router: AppRouterInstance, closeMenu: () => void }) {
    return (
        <div
            className="mt-auto p-6"
            style={ {
                // um gradiente ao contrário, dessa vez debaixo para cima, começando com opacidade total embaixo e ficando transparente em cima. E ao invés da cor branca a cor usada deve ser #F8C3D3. 
                background: 'linear-gradient(to top, rgb(248, 195, 211) 0%, rgba(248, 248, 248, 1) 80%, rgba(248, 248, 248, 0.7) 100%)',

            } }
        >
            <div className="flex justify-evenly items-center">
                <NavFooterButton router={ router } closeMenu={ closeMenu } text='Cadastrar-se' path='/cadastro'/>
                <NavFooterButton router={ router } closeMenu={ closeMenu } text='Iniciar Sessão' path='/login'/>
            </div>
        </div>
    );
}