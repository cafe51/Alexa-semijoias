import Link from 'next/link';
import { ShoppingBag, Users, Settings, BarChart2, LogOut, Store, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/useLogout';

export default function DesktopMenu()  {
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
        <div className="hidden md:flex flex-col h-screen w-64 bg-[#FAF9F6] border-r border-[#C48B9F] p-4 fixed left-0 top-0">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#333333]">Admin</h2>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    { menuItems.map((item, index) => (
                        <li key={ index }>
                            <Link 
                                href={ item.href } 
                                className="flex items-center p-2 text-[#333333] rounded-lg hover:bg-[#F8C3D3] transition-colors"
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
    );
}