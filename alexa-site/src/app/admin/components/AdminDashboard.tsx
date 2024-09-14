import Link from 'next/link';

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
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </>
    );
};

export default AdminDashboard;