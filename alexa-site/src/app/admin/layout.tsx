'use client';

import { ReactNode } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuthContext();
    const router = useRouter();

    //   useEffect(() => {
    //     if (!isLoading) {
    //         if (!user) {
    //             router.push('/login');
    //         } else if (!isAdmin) {
    //             router.push('/');
    //         }
    //     }
    // }, [user, isAdmin, isLoading, router]);

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (!user || !isAdmin) {
        router.push('/login');
        return null;
    }

    return (
        <div className="flex bg-gray-100 w-full">
            <main className="flex-1 overflow-y-auto w-full">
                { children }
            </main>
        </div>
    );
};

export default AdminLayout;