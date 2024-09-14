// app/admin/dashboard/[adminId]/produtos/novo/RecommendedProductsSection.tsx

export default function RecommendedProductsSection() {
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Produtos Recomendados</h2>
            <div className="mt-2 border-t border-solid text-center w-full">
                <button className="text-blue-500">Adicionar produtos recomendados</button>
            </div>
        </section>
    );
}
