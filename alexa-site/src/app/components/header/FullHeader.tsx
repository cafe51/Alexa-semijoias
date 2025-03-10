// src/app/components/header/FullHeader.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import MobileMenu from '../navBar/MobileMenu';
import DesktopMenu from '../navBar/DesktopMenu';
import CartIcon from './CartIcon';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { useAuthContext } from '@/app/hooks/useAuthContext';
import { FiSearch, FiSettings, FiUser } from 'react-icons/fi';
import SlideInModal from '../ModalMakers/SlideInModal';
import DesktopSearchMenu from '../navBar/DesktopSearchMenu';

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
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();

    const buttonSize = isMobile ? 24 : 36;

    const UserIcon = () => (
        <button
            className="flex flex-col items-center  p-0 cursor-pointer"
            aria-label={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            title={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            onClick={ () => (userInfo ? router.push('/minha-conta') : router.push('/login')) }
        >
            <FiUser size={ buttonSize } />
            { userInfo ? (
                <span className="text-sm sm:text-base md:text-lg text-center ">
                    { userInfo?.nome.split(' ')[0] }
                </span>
            ) : (
                <span className="text-sm sm:text-base md:text-lg text-center ">
                                                Entrar
                </span>
            ) }
        </button>
    );
    
    const SettingsButton = () => (
        <button
            className="p-0"
            aria-label="Acessar área administrativa"
            title="Acessar área administrativa"
            onClick={ () => router.push('/admin') }
        >
            <FiSettings size={ buttonSize } />
        </button>
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
                className={ `fixed top-0 left-0 right-0 px-4 py-0 z-50 bg-white ${
                    isMobile ? headerMobileStyle : headerDesktopStyle
                }` }
                style={ {
                    height: isMobile ? `${headerHeightMobile}px ` : 'auto',
                    backgroundColor: isMobile
                        ? `rgba(255,255,255, ${headerOpacity})`
                        : 'white',
                } }
            >
                <div className="flex items-center justify-between py-0 md:py-4 w-full">
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
                                <CartIcon isMobile={ isMobile } buttonSize={ buttonSize } />
                            </div>

                        </>
                    ) : (
                        <div className='flex justify-between items-center w-full p-6 py-0 pt-2'>
                            {
                                isSearchModalOpen && (
                                    <SlideInModal
                                        isOpen={ isSearchModalOpen }
                                        closeModelClick={ () => setIsSearchModalOpen(false) }
                                        title="Pesquisa"
                                    >
                                        <DesktopSearchMenu />
                                    </SlideInModal>
                                )
                            }
                            <div className='flex justify-start'>
                                <div
                                    className="cursor-pointer"
                                    style={ { transform: `scale(${0.8})`, transition: 'transform 0.3s ease' } }
                                    onClick={ () => router.push('/') }>
                                    <Logo />
                                </div>
                                <DesktopMenu menuSections={ menuSections } router={ router } />
                            </div>
                            <div className="flex items-start space-x-10 mt-2">
                                { user && isAdmin && <SettingsButton /> }
                                <FiSearch size={ buttonSize } className="p-0  cursor-pointer" onClick={ () => setIsSearchModalOpen(true) } />
                                <UserIcon />
                                <CartIcon isMobile={ isMobile } buttonSize={ buttonSize } />
                            </div>


                        </div>
                    ) }

                    { !isMobile && (
                        <div className="py-2 border-t border-[#C48B9F]">
                        </div>
                    ) }
                </div>
            </header>
            { /* Espaçador para empurrar o conteúdo para baixo do header fixo */ }
            <div
                style={ {
                    height: isMobile ? `${headerHeightMobile + 32}px` : '160px',
                } }
            />
        </>
    );
};

export default FullHeader;
