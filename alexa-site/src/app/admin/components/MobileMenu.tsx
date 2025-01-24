'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, Users, Settings, BarChart2, LogOut, Store, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/useLogout';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';

interface MobileMenuProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
    const router = useRouter();
    const { logout } = useLogout();

    const menuItems = [
        { icon: Store, label: 'Ir para Loja', href: '/' },
        { icon: ShoppingBag, label: 'Produtos', href: '/admin/produtos' },
        { icon: Users, label: 'Clientes', href: '/admin/clientes' },
        { icon: DollarSign, label: 'Vendas', href: '/admin/pedidos' },
        { icon: BarChart2, label: 'Relatórios', href: '/admin/relatorios' },
        { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
    ];

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
                title="Menu Administrativo"
                slideDirection="left"
            >
                <div className="flex flex-col h-full bg-[#FAF9F6] p-4">
                    <nav className="flex-1">
                        <ul className="space-y-2">
                            { menuItems.map((item, index) => (
                                <li key={ index }>
                                    <Link 
                                        href={ item.href } 
                                        className="flex items-center p-2 text-[#333333] rounded-lg hover:bg-[#F8C3D3] transition-colors"
                                        onClick={ toggleMenu }
                                    >
                                        <item.icon className="w-5 h-5 mr-3 text-[#C48B9F]" />
                                        { item.label }
                                    </Link>
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
