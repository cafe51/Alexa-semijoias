'use client';
// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import MobileMenu from '../navBar/MobileMenu';
import DesktopMenu from '../navBar/DesktopMenu';
import CartIcon from './CartIcon';
import { useCollection } from '@/app/hooks/useCollection';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { useUserInfo } from '@/app/hooks/useUserInfo';

const FullHeader2: React.FC = () => {
    const { userInfo } = useUserInfo();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [menuSections, setMenuSections] = useState<(SectionType & FireBaseDocument)[] | never[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();
      
    const SearchBar = () => (
        <div className="relative flex-grow max-w-4xl mx-4">
            <Input type="text" placeholder="Buscar..." className="pl-14 pr-4 py-6 w-full bg-[#F8C3D3]/50 border-none text-lg rounded-xl"  />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-7 w-7"/>
        </div>
    );
      
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
    const headerOpacity = Math.max(0.7, 1 - scrollPosition * 0.002);

    const handleSectionClick = (section: SectionType) => {
        setActiveSection(section);
    };

    const handleBackToMain = () => {
        setActiveSection(null);
    };

    const headerMobileStyle = 'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 transition-all duration-300 ease-in-out';
    const headerDesktopStyle = 'fixed top-0 left-0 right-0 z-50 bg-white shadow-lg';

    return (
        <header
            className={ isMobile ? headerMobileStyle : headerDesktopStyle }
            style={ isMobile ? {
                height: `${headerHeight}px`,
                backgroundColor: `rgba(255,255,255, ${headerOpacity})`,
                boxShadow: `0 2px 4px rgba(0,0,0,${0.1 * headerOpacity})`,
            } : {} }>
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-4">
                    { isMobile ? (
                        <>
                            {
                                menuSections && menuSections.length > 0 && <MobileMenu
                                    userInfo={ userInfo }
                                    activeSection={ activeSection }
                                    menuSections={ menuSections }
                                    isMenuOpen={ isMenuOpen }
                                    setIsMenuOpen={ setIsMenuOpen }
                                    handleSectionClick={ handleSectionClick }
                                    handleBackToMain={ handleBackToMain }
                                    router={ router }
                                />
                            }
                            <div className="cursor-pointer" onClick={  () => router.push('/') }>
                                <Logo isMobile={ isMobile } />
                            </div>
                            <div className="flex items-center space-x-4 pr-4">
                                <UserIcon />
                                <CartIcon isMobile={ isMobile }/>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="cursor-pointer" onClick={  () => router.push('/') }>
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
    );
};

export default FullHeader2;