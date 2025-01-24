export default function AdminMenu() {
    return (
        <nav className="flex flex-col justify-around bg-blue-200">
            <a href="/admin/produtos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Gerenciar Produtos</h2>
            </a>
            <a href="/admin/pedidos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Gerenciar Pedidos</h2>
            </a>
            <a href="/admin/clientes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">Gerenciar Clientes</h2>
            </a>
        </nav>
    );
}
