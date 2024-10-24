'use client';
import Link from 'next/link';
import { useState } from 'react';

interface DashboardLinkProps {
    href: string;
    title: string;
    description: string;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({ href, title, description }) => (
    <Link href={ href } className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{ title }</h2>
        <p className="text-gray-600">{ description }</p>
    </Link>
);

const AdminDashboard: React.FC = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');

    const handleUpdateProducts = async() => {
        setIsUpdating(true);
        setUpdateMessage('Atualizando produtos...');

        try {
            const response = await fetch('/api/update-products', { method: 'POST' });
            if (response.ok) {
                setUpdateMessage('Produtos atualizados com sucesso!');
            } else {
                setUpdateMessage('Erro ao atualizar produtos. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao atualizar produtos:', error);
            setUpdateMessage('Erro ao atualizar produtos. Por favor, tente novamente.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <DashboardLink
                    href="/admin/produtos"
                    title="Gerenciar Produtos"
                    description="Adicionar, editar ou remover produtos do catálogo."
                />
                <DashboardLink
                    href="/admin/pedidos"
                    title="Gerenciar Pedidos"
                    description="Visualizar e atualizar o status dos pedidos."
                />
                <DashboardLink
                    href="/admin/clientes"
                    title="Gerenciar Clientes"
                    description="Visualizar e gerenciar contas de clientes."
                />
            </div>
            <div className="mt-6">
                <button
                    onClick={ handleUpdateProducts }
                    disabled={ isUpdating }
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    { isUpdating ? 'Atualizando...' : 'Atualizar Produtos' }
                </button>
                { updateMessage && (
                    <p className={ `mt-2 ${updateMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}` }>
                        { updateMessage }
                    </p>
                ) }
            </div>
        </>
    );
};

export default AdminDashboard;
