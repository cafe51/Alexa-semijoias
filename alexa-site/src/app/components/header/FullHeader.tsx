// src/app/components/header/FullHeader.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import MobileMenu from '../navBar/MobileMenu';
import DesktopMenu from '../navBar/DesktopMenu';
import CartIcon from './CartIcon';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import SearchBar from './SearchBar';
import { useAuthContext } from '@/app/hooks/useAuthContext';

interface FullHeaderProps {
  initialMenuSections: (SectionType & FireBaseDocument)[];
}

const FullHeader: React.FC<FullHeaderProps> = ({ initialMenuSections }) => {
    const { user, isAdmin } = useAuthContext();
    const { userInfo } = useUserInfo();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    // Usa os dados já carregados pelo servidor
    const [menuSections] = useState<(SectionType & FireBaseDocument)[]>(initialMenuSections);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();

    const UserIcon = () => (
        <Button
            variant="ghost"
            size={ isMobile ? 'icon' : 'lg' }
            className="text-[#C48B9F] h-fit w-fit p-1"
            aria-label={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            title={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            onClick={ () => (userInfo ? router.push('/minha-conta') : router.push('/login')) }
        >
            <User className={ isMobile ? 'h-6 w-6' : 'h-14 w-14' } />
        </Button>
    );
    
    const SettingsButton = () => (
        <Button
            variant="ghost"
            size={ isMobile ? 'icon' : 'lg' }
            className="text-[#C48B9F] h-fit w-fit p-1"
            aria-label="Acessar área administrativa"
            title="Acessar área administrativa"
            onClick={ () => router.push('/admin') }
        >
            <Settings className={ isMobile ? 'h-6 w-6' : 'h-14 w-14' } />
        </Button>
    );

    useEffect(() => {
        const handleScroll = () => setScrollPosition(window.pageYOffset);
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

    // Definindo valores máximos e mínimos para o header (mobile)
    const MAX_HEADER_HEIGHT = 80; // altura original do header (e da logo)
    const MIN_HEADER_HEIGHT = 60;
    const headerHeightMobile = Math.max(
        MIN_HEADER_HEIGHT,
        MAX_HEADER_HEIGHT - scrollPosition * 0.2,
    );
    const headerOpacity = isMobile ? Math.max(0.8, 1 - scrollPosition * 0.002) : 1;

    // Calcula a escala da logo baseada na altura do header mobile (garantindo escala 1 no topo)
    const logoScale = isMobile ? headerHeightMobile / MAX_HEADER_HEIGHT : 1;

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
                className={ `fixed top-0 left-0 right-0 px-4 py-4 z-50 bg-white ${
                    isMobile ? headerMobileStyle : headerDesktopStyle
                }` }
                style={ {
                    height: isMobile ? `${headerHeightMobile}px ` : 'auto',
                    backgroundColor: isMobile
                        ? `rgba(255,255,255, ${headerOpacity})`
                        : 'white',
                } }
            >
                <div className="container md:mx-auto py-0 ">
                    <div className="flex items-center justify-between py-0 md:py-4">
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
                                { /* Logo com escala controlada para manter o tamanho original no topo */ }
                                <div
                                    className="cursor-pointer"
                                    onClick={ () => router.push('/') }
                                    style={ { transform: `scale(${logoScale})`, transition: 'transform 0.3s ease' } }
                                >
                                    <Logo isMobile={ isMobile } />
                                </div>
                                <div className="flex items-center space-x-4 pr-4">
                                    { user && isAdmin && <SettingsButton /> }
                                    <CartIcon isMobile={ isMobile } />
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="cursor-pointer"
                                    onClick={ () => router.push('/') }
                                >
                                    <Logo />
                                </div>
                                <SearchBar />
                                <div className="flex items-center space-x-10">
                                    { user && isAdmin && <SettingsButton /> }
                                    <div className="flex items-center space-x-2">
                                        <UserIcon />
                                        { userInfo ? (
                                            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[#C48B9F]">
                                                { userInfo?.nome.split(' ')[0] }
                                            </span>
                                        ) : (
                                            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[#C48B9F]">
                                                Entrar
                                            </span>
                                        ) }
                                    </div>
                                    <CartIcon isMobile={ isMobile } />
                                </div>
                            </>
                        ) }
                    </div>
                    { !isMobile && (
                        <div className="py-2 border-t border-[#C48B9F]">
                            <DesktopMenu menuSections={ menuSections } router={ router } />
                        </div>
                    ) }
                </div>
            </header>
            { /* Espaçador para empurrar o conteúdo para baixo do header fixo */ }
            <div
                style={ {
                    height: isMobile ? `${0}px` : '0px',
                } }
            />
            { /* Container da SearchBar mobile */ }
            { isMobile && (
                <div
                    className="fixed left-0 right-0 z-50 px-2 md:px-4 shadow-lg"
                    style={ {
                        top: `${headerHeightMobile * 1}px`,
                        backgroundColor: `rgba(255,255,255, ${headerOpacity})`,
                    } }
                >
                    <SearchBar />
                </div>
            ) }
        </>
    );
};

export default FullHeader;
