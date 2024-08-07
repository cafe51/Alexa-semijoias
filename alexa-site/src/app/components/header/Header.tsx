//app/components/Header.tsx

'use client';

import FullHeader from './FullHeader';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';


export default function Header() {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'
    
    return pathSegment === 'login' || pathSegment === 'cadastro' || pathSegment === 'checkout' ? <SimpleHeader /> : <FullHeader />;

}
