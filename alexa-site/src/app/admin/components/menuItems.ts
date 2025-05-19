import { ShoppingBag, Users, Settings, BarChart2, Store, DollarSign, BadgePercent, CarTaxiFront } from 'lucide-react';


export const menuItems = [
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
        icon: CarTaxiFront, 
        label: 'Carrinhos', 
        href: '/admin/carrinhos',
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
        icon: Settings, 
        label: 'Seções', 
        href: '/admin/sections',
        enabled: true,
    },
    { 
        icon: Settings, 
        label: 'Banners', 
        href: '/admin/banners',
        enabled: true,
    },
    { 
        icon: Settings, 
        label: 'metadeanuncio', 
        href: '/admin/metadeanuncio',
        enabled: true,
    },
    { 
        icon: Store, 
        label: 'Ir para Loja', 
        href: '/',
        enabled: true,
    },
    
  

];