//app/components/Header.tsx

'use client';

import FullHeader from './FullHeader';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';
import AdminHeader from './AdminHeader';


export default function Header() {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'

    if(pathSegment === 'login' || pathSegment === 'cadastro' || pathSegment === 'checkout') return <SimpleHeader />;
    if(pathSegment === 'admin') return <AdminHeader />;
    
    return <FullHeader />;

}
