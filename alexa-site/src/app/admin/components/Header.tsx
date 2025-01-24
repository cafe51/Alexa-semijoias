import { Button } from '@/components/ui/button';

const Header = () => (
    <header className="bg-[#C48B9F] text-white p-4 flex justify-between items-center fixed w-full z-10">
        <div className="flex items-center md:ml-64">
            <h1 className="text-xl font-semibold">ALEXA SEMIJOIAS Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-sm">Olá, Admin</span>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-[#C48B9F]">
                Perfil
            </Button>
        </div>
    </header>
);

export default Header;
