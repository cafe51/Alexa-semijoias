//app/components/Header.tsx
'use client';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';
import FullHeader from './FullHeader';


export default function Header() {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'

    if(pathSegment === 'login' || pathSegment === 'cadastro' || pathSegment === 'checkout') return <SimpleHeader />;
    if(pathSegment === 'admin') return <></>;
    
    return <FullHeader />;

}
