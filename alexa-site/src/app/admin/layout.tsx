'use client';

import { ReactNode, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '../components/LoadingIndicator';
import AdminHeader from './components/AdminHeader';
import DesktopMenu from './components/DesktopMenu';
import MobileMenu from './components/MobileMenu';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuthContext();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    // if (isLoading) {
    //     return <LoadingIndicator />;
    // }

    if (!user || !isAdmin) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <AdminHeader />
            <DesktopMenu />
            <MobileMenu isOpen={ menuOpen } toggleMenu={ toggleMenu } />
            <main className="pt-16 md:ml-64 p-6">
                { isLoading ? <LoadingIndicator /> : children }
            </main>
        </div>
    );
};

export default AdminLayout;
