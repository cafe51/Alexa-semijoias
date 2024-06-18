//app/components/Header.tsx

'use client';

import FullHeader from './FullHeader';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';


export default function Header() {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'
    console.log('CAMINHOOO', pathname);

    return pathSegment === 'login' || pathSegment === 'cadastro' ? <SimpleHeader /> : <FullHeader />;

}
