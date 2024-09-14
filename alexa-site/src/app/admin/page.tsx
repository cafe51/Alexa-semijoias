'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import Link from 'next/link';

export default function Dashboard() {
    const { user, isAdmin, isLoading } = useAuthContext();
    const router = useRouter();
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    useEffect(() => {
        const checkAdminAccess = async() => {
            console.log('Dashboard - Verificando acesso de administrador');
            console.log('Dashboard - user:', user);
            console.log('Dashboard - isAdmin:', isAdmin);
            console.log('Dashboard - isLoading:', isLoading);
            
            if (!isLoading) {
                if (!user) {
                    console.log('Dashboard - Usuário não autenticado, redirecionando');
                    router.push('/login');
                } else if (!isAdmin) {
                    console.log('Dashboard - Usuário não é administrador, redirecionando');
                    router.push('/');
                } else {
                    console.log('Dashboard - Acesso de administrador confirmado');
                }
                setIsCheckingAdmin(false);
            }
        };

        checkAdminAccess();
    }, [user, isAdmin, isLoading, router]);

    // Redirecionamento imediato se não houver usuário
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (!user) {
        return null; // O redirecionamento será feito pelo useEffect
    }

    if (isCheckingAdmin) {
        return <p>Verificando permissões de administrador...</p>;
    }

    if (!isAdmin) {
        return <p>Acesso não autorizado. Redirecionando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8 mt-20">
                <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/produtos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">Gerenciar Produtos</h2>
                        <p className="text-gray-600">Adicionar, editar ou remover produtos do catálogo.</p>
                    </Link>
                    <Link href="/admin/pedidos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">Gerenciar Pedidos</h2>
                        <p className="text-gray-600">Visualizar e atualizar o status dos pedidos.</p>
                    </Link>
                    <Link href="/admin/usuarios" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">Gerenciar Usuários</h2>
                        <p className="text-gray-600">Visualizar e gerenciar contas de usuários.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}