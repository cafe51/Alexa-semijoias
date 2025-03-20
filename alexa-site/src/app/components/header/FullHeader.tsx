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
import DesktopSearchMenu from '../navBar/SearchSection';
import RotatingAnnouncementBar from '../announcement/RotatingAnnouncementBar';

interface FullHeaderProps {
  initialMenuSections: (SectionType & FireBaseDocument)[];
}

const FullHeader: React.FC<FullHeaderProps> = ({ initialMenuSections }) => {
    const { user, isAdmin } = useAuthContext();
    const { userInfo } = useUserInfo();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    // Dados carregados pelo servidor
    const [menuSections] = useState<(SectionType & FireBaseDocument)[]>(initialMenuSections);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();

    const buttonSize = isMobile ? 24 : 36;
    const PROMO_BAR_HEIGHT = 40; // altura fixa da promo bar (em px)

    // Atualiza a posição do scroll
    useEffect(() => {
        const handleScroll = () => setScrollPosition(window.pageYOffset);
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Chamada inicial
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Detecta se é mobile ou desktop
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Configurações para o header mobile (transparência e altura dinâmica)
    const MAX_HEADER_HEIGHT = 50;
    const MIN_HEADER_HEIGHT = 40;
    const headerHeightMobile = Math.max(
        MIN_HEADER_HEIGHT,
        MAX_HEADER_HEIGHT - scrollPosition * 0.3,
    );
    const headerOpacity = isMobile ? Math.max(0.8, 1 - scrollPosition * 0.002) : 1;

    const UserIcon = () => (
        <button
            className="flex flex-col items-center p-0 cursor-pointer"
            aria-label={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            title={ userInfo ? 'Acessar minha conta' : 'Entrar' }
            onClick={ () => (userInfo ? router.push('/minha-conta') : router.push('/login')) }
        >
            <FiUser size={ buttonSize } />
            { userInfo ? (
                <span className="text-sm sm:text-base md:text-lg text-center">
                    { userInfo?.nome.split(' ')[0] }
                </span>
            ) : (
                <span className="text-sm sm:text-base md:text-lg text-center">Entrar</span>
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

    // Renderização para mobile
    if (isMobile) {
        return (
            <>
                <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
                    { /* Promo Bar */ }
                    <RotatingAnnouncementBar />
                    { /* Área de navegação com transparência dinâmica */ }
                    <div
                        className="flex items-center justify-between px-4 py-0 md:py-2 w-full"
                        style={ {
                            height: `${headerHeightMobile}px`,
                            backgroundColor: `rgba(255,255,255, ${headerOpacity})`,
                        } }
                    >
                        { menuSections && menuSections.length > 0 && (
                            <MobileMenu
                                userInfo={ userInfo }
                                activeSection={ activeSection }
                                menuSections={ menuSections }
                                isMenuOpen={ isMenuOpen }
                                setIsMenuOpen={ setIsMenuOpen }
                                handleSectionClick={ (section) => setActiveSection(section) }
                                handleBackToMain={ () => setActiveSection(null) }
                                router={ router }
                            />
                        ) }
                        <div
                            className="cursor-pointer"
                            onClick={ () => router.push('/') }
                            style={ {
                                transform: `scale(${headerHeightMobile / MAX_HEADER_HEIGHT})`,
                                transition: 'transform 0.1s ease',
                            } }
                        >
                            <Logo isMobile={ isMobile } />
                        </div>
                        <div className="flex items-center space-x-4 pr-4">
                            { user && isAdmin && <SettingsButton /> }
                            <CartIcon isMobile={ isMobile } buttonSize={ buttonSize } />
                        </div>
                    </div>
                    <div className="border-b border-[#F8C3D3] w-2/3 mx-auto"></div>
                </header>
                { /* Espaçador para evitar sobreposição do conteúdo */ }
                <div style={ { height: `${PROMO_BAR_HEIGHT + headerHeightMobile - 20 }px` } } />
            </>
        );
    }

    // Renderização para desktop
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white flex flex-col">
                { /* Promo Bar */ }
                <RotatingAnnouncementBar />
                { isSearchModalOpen && (
                    <SlideInModal
                        isOpen={ isSearchModalOpen }
                        closeModelClick={ () => setIsSearchModalOpen(false) }
                        title="Pesquisa"
                    >
                        <DesktopSearchMenu />
                    </SlideInModal>
                ) }
                <div className="flex justify-between items-center w-full p-6 py-1">
                    <div className="flex justify-start">
                        <div
                            className="cursor-pointer"
                            style={ { transform: `scale(${0.8})`, transition: 'transform 0.3s ease' } }
                            onClick={ () => router.push('/') }
                        >
                            <Logo />
                        </div>
                        <DesktopMenu menuSections={ menuSections } router={ router } />
                    </div>
                    <div className="flex items-start space-x-10 mt-2 text-[#C48B9F]">
                        { user && isAdmin && <SettingsButton /> }
                        <FiSearch
                            size={ buttonSize }
                            className="p-0 cursor-pointer"
                            onClick={ () => setIsSearchModalOpen(true) }
                        />
                        <UserIcon />
                        <CartIcon isMobile={ isMobile } buttonSize={ buttonSize } />
                    </div>
                </div>
                <div className="border-b border-[#F8C3D3] w-9/12 mx-auto"></div>
            </header>
            { /* Espaçador: altura do header desktop (90px) + promo bar */ }
            <div style={ { height: `calc(70px + ${PROMO_BAR_HEIGHT}px)` } } />
        </>
    );
};

export default FullHeader;
