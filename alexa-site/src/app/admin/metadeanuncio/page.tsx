import MetasCalculadora from './MetasCalculadora';

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Dashboard de Vendas</h1>

            { /* Outros componentes do seu dashboard */ }

            <MetasCalculadora />

            { /* Mais componentes */ }
        </div>
    );
}