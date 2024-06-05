'use client';

import FullHeader from './FullHeader';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';


export default function Header({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'

    return (
        <div className="min-h-screen secColor">
            { pathSegment === 'login' || pathSegment === 'cadastro' ? <SimpleHeader /> : <FullHeader /> } 
            <div className="flex flex-col pt-40 p-4">
                { children }
            </div>
        </div>
    );
}
