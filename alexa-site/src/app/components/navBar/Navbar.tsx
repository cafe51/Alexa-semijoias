//app/components/Navbar.tsx

import { useEffect, useRef, useState } from 'react';
import NavBarUserSection from './NavBarUserSection';
import { useCollection } from '@/app/hooks/useCollection';
import { SectionType } from '@/app/utils/types';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import NavBarSection from './NavBarSection';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const navItemsStyle = 'hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300 p-2';

// const sections = ['brincos', 'pulseiras', 'colares', 'aneis'];

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [sections, setSections] = useState<(SectionType & WithFieldValue<DocumentData>)[] | never[]>([]);

    useEffect(() => {
        async function getSectionsFromFireBase() {
            const res = await getAllDocuments();
            setSections(res);
        }
        getSectionsFromFireBase();
    }, []);

    const node = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const goToStart = (e: any) => {
        // e.preventDefault();
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            transition-all
            duration-500
            fixed
            w-4/6
            h-screen
            z-40
            top-12
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
                <div className="flex flex-col space-y-8 py-4  md:flex-row md:space-y-0  md:py-0 md:px-0 md:justify-end lg:gap-6 ">
                    <a href="/" onClick={ goToStart } className={ navItemsStyle } >Início</a>
                    {
                        sections.map(
                            (section) => <NavBarSection key={ section.sectionName } section={ section } closeMenu={ () => setIsMenuOpen(false) }/>,
                        )
                    }
                    <a href="/contact" onClick={ () => setIsMenuOpen(false) } className={ navItemsStyle }>Fale Comigo</a>

                    <NavBarUserSection />

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
