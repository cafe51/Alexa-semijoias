import { useEffect, useRef } from 'react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const navItemsStyle = 'hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300 p-2';


const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
    const node = useRef<HTMLDivElement>(null);

    const goToStart = (e: any) => {
        // e.preventDefault();
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (node.current?.contains(e.target)) {
                return;
            }
            setIsMenuOpen(false);
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchmove', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchmove', handleClickOutside);
        };
    }, [isMenuOpen, setIsMenuOpen]);

    return (
        <nav ref={ node } className={
            `
            sm:w-1/3
            transition-all
            duration-500
            fixed
            w-2/5
            h-screen
            z-40
            top-20
            right-full
            transform
            ${isMenuOpen ? 'translate-x-full' : 'translate-x-0'}
            md:w-full
            lg:w-4/6
            md:translate-x-0
            md:static
            md:h-auto

            md:justify-end
            py-4`
        }>
            <div className="nav-gradient font-bold text-center">
                <div className="flex flex-col space-y-8 py-4 px-4 md:flex-row md:space-y-0  md:py-0 md:px-0 md:justify-end lg:gap-6">
                    <a href="/" onClick={ goToStart } className={ navItemsStyle } >Início</a>
                    <a href="/brincos" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Brincos</a>
                    <a href="/pulseiras" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Pulseiras</a>
                    <a href="/colares" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Colares</a>
                    <a href="/aneis" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Anéis</a>
                    <a href="/contact" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Fale Comigo</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
