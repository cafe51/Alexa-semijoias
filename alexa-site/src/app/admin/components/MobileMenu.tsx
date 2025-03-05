'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/useLogout';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { menuItems } from './menuItems';

interface MobileMenuProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
    const router = useRouter();
    const { logout } = useLogout();


    const handleLogout = async() => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <Button variant="ghost" size="icon" onClick={ toggleMenu } className="fixed top-4 left-4 z-50 md:hidden">
                <Menu className="h-6 w-6" />
            </Button>
            <SlideInModal 
                isOpen={ isOpen } 
                closeModelClick={ toggleMenu }
                title="Menu"
                slideDirection="left"
            >
                <div className="flex flex-col h-full bg-[#FAF9F6] p-4">
                    <nav className="flex-1" aria-label="Root Menu">
                        <ul className="space-y-2">
                            { menuItems.map((item, index) => (
                                <li key={ index }>
                                    { item.enabled ? (
                                        <Link 
                                            href={ item.href } 
                                            className="flex items-center p-2 text-[#333333] rounded-lg hover:bg-[#F8C3D3] transition-colors"
                                            onClick={ toggleMenu }
                                        >
                                            <item.icon className="w-5 h-5 mr-3 text-[#C48B9F]" />
                                            { item.label }
                                        </Link>
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center p-2 text-gray-400 rounded-lg cursor-not-allowed">
                                                        <item.icon className="w-5 h-5 mr-3" />
                                                        { item.label }
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{ item.message }</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) }
                                </li>
                            )) }
                        </ul>
                    </nav>
                    <Button 
                        variant="ghost" 
                        className="mt-auto flex items-center text-[#333333] hover:bg-[#F8C3D3] transition-colors"
                        onClick={ handleLogout }
                    >
                        <LogOut className="w-5 h-5 mr-3 text-[#C48B9F]" />
                        Sair
                    </Button>
                </div>
            </SlideInModal>
        </>
    );
};

export default MobileMenu;
