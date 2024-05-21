'use client';

import Footer from './Footer';
import Header from './Header';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';


export default function BodyWithHeaderAndFooter({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const pathname = usePathname(); // Obter o caminho atual
    const pathSegment = pathname.split('/')[1]; // Extrair a parte 'login'

    return (
        <div className="flex flex-col justify-between min-h-screen secColor">
            { pathSegment === 'login' || pathSegment === 'cadastro' ? <SimpleHeader /> : <Header /> } 
            <main className="flex items-center flex-col gap-4 justify-between pt-40 p-4">
                { children }
            </main>
            <Footer />
        </div>
    );
}
