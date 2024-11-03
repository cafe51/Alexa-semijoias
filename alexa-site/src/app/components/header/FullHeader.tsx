import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import MobileMenu from '../navBar/MobileMenu';
import DesktopMenu from '../navBar/DesktopMenu';
import CartIcon from './CartIcon';
import { useCollection } from '@/app/hooks/useCollection';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import SearchBar from './SearchBar';

const FullHeader: React.FC = () => {
    const { userInfo } = useUserInfo();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [menuSections, setMenuSections] = useState<(SectionType & FireBaseDocument)[] | never[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();
      
    const UserIcon = () => (
        <Button 
            variant="ghost"
            size={ isMobile ? 'icon' : 'lg' }
            className="text-[#C48B9F] h-fit w-fit p-1"
            onClick={ () => userInfo ? router.push('/minha-conta') : router.push('/login') }
        >
            <User className={ `${isMobile ? 'h-6 w-6' : 'h-14 w-14'}` } />
        </Button>
    );

    useEffect(() => {
        async function getSectionsFromFireBase() {
            const res = await getAllDocuments();
            setMenuSections(res);
        }
        getSectionsFromFireBase();
    }, []);

    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const headerHeight = Math.max(60, 100 - scrollPosition * 0.2);
    const headerOpacity = Math.max(0.8, 1 - scrollPosition * 0.002);

    const handleSectionClick = (section: SectionType) => {
        setActiveSection(section);
    };

    const handleBackToMain = () => {
        setActiveSection(null);
    };

    const headerMobileStyle = 'flex items-center justify-between';
    const headerDesktopStyle = 'shadow-lg';

    return (
        <>
            <header
                className={ `fixed top-0 left-0 right-0 px-4 z-50 bg-white  ${ isMobile ? headerMobileStyle : headerDesktopStyle }` }
                style={ {
                    height: isMobile ? `${headerHeight}px` : 'auto',
                    backgroundColor: isMobile ? `rgba(255,255,255, ${headerOpacity})` : 'white',
                } }
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between py-4">
                        { isMobile ? (
                            <>
                                { menuSections && menuSections.length > 0 && (
                                    <MobileMenu
                                        userInfo={ userInfo }
                                        activeSection={ activeSection }
                                        menuSections={ menuSections }
                                        isMenuOpen={ isMenuOpen }
                                        setIsMenuOpen={ setIsMenuOpen }
                                        handleSectionClick={ handleSectionClick }
                                        handleBackToMain={ handleBackToMain }
                                        router={ router }
                                    />
                                ) }
                                <div className="cursor-pointer" onClick={ () => router.push('/') }>
                                    <Logo isMobile={ isMobile } />
                                </div>
                                <div className="flex items-center space-x-4 pr-4">
                                    <UserIcon />
                                    <CartIcon isMobile={ isMobile }/>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="cursor-pointer" onClick={ () => router.push('/') }>
                                    <Logo />
                                </div>
                                <SearchBar />
                                <div className="flex items-center space-x-10">
                                    <UserIcon />
                                    <CartIcon isMobile={ isMobile }/>
                                </div>
                            </>
                        ) }
                    </div>
                    { !isMobile && (
                        <div className="py-2 border-t border-[#C48B9F]">
                            <DesktopMenu menuSections={ menuSections } router={ router }/>
                        </div>
                    ) }
                </div>
            </header>
            { /* Espaçador para empurrar o conteúdo para baixo do header fixo */ }
            <div 
                style={ { 
                    height: isMobile ? `${headerHeight + 64}px` : '160px',
                } } 
            />
            { /* Container da SearchBar mobile */ }
            { isMobile && (
                <div 
                    className="fixed left-0 right-0 z-40 px-4 shadow-lg"
                    style={ {
                        top: `${headerHeight}px`,
                        backgroundColor: `rgba(255,255,255, ${headerOpacity})`,
                        // transition: 'top 0.3s ease-in-out',
                    } }
                >
                    <SearchBar />
                </div>
            ) }
        </>
    );
};

export default FullHeader;