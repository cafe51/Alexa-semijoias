// app/admin/dashboard/[adminId]/produtos/novo/AssociatedProductsSection.tsx

export default function AssociatedProductsSection() {
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Produtos Associados</h2>
            <div className="mt-2 border-t border-solid text-center w-full">
                <button className="text-blue-500">Adicionar produtos associados</button>
            </div>
        </section>
    );
}
