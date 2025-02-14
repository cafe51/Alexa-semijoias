import Link from 'next/link';
import { ShoppingBag, Users, Settings, BarChart2, LogOut, Store, DollarSign, BadgePercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/useLogout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CategoryManager from './CategoryManager';

export default function DesktopMenu()  {
    const router = useRouter();
    const { logout } = useLogout();

    const menuItems = [
        { 
            icon: BarChart2, 
            label: 'Painel de Controle', 
            href: '/admin',
            enabled: true,
        },
        { 
            icon: ShoppingBag, 
            label: 'Produtos', 
            href: '/admin/produtos',
            enabled: true,
        },
        { 
            icon: Users, 
            label: 'Clientes', 
            href: '/admin/clientes',
            enabled: true,
        },
        { 
            icon: DollarSign, 
            label: 'Vendas', 
            href: '/admin/pedidos',
            enabled: true,
        },
        { 
            icon: BarChart2, 
            label: 'Relatórios', 
            href: '/admin/relatorios',
            enabled: false,
            message: 'Módulo de relatórios em desenvolvimento',
        },
        { 
            icon: Settings, 
            label: 'Configurações', 
            href: '/admin/configuracoes',
            enabled: false,
            message: 'Módulo de configurações em desenvolvimento',
        },
        { 
            icon: BadgePercent, 
            label: 'Cupons', 
            href: '/admin/coupons',
            enabled: true,
        },
        { 
            icon: Store, 
            label: 'Ir para Loja', 
            href: '/',
            enabled: true,
        },
        
        // {
        //     icon: Settings,
        //     label: 'Gerenciar Categorias',
        //     href: '',
        //     enabled: true,
        //     onClick: () => setShowCategoryManager(true),
        // },
    ];

    const handleLogout = async() => {
        logout();
        router.push('/login');
    };

    return (
        <div className="hidden md:flex flex-col h-screen w-64 bg-[#FAF9F6] border-r border-[#C48B9F] p-4 fixed left-0 top-0">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#333333]">Admin</h2>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    { menuItems.map((item, index) => (
                        <li key={ index }>
                            { item.enabled ? (
                                <Link 
                                    href={ item.href } 
                                    className="flex items-center p-2 text-[#333333] rounded-lg hover:bg-[#F8C3D3] transition-colors"
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
                                        <TooltipContent className="bg-[#C48B9F] text-white border-[#C48B9F]">
                                            <p className="text-white">{ item.message }</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) }
                        </li>
                    )) }
                    <CategoryManager />

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
    );
}
