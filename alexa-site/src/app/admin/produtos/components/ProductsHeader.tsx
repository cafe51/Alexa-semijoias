import toTitleCase from '@/app/utils/toTitleCase';

// src/app/admin/produtos/componentes/ProductsHeader.tsx
interface ProductsHeaderProps {
    totalProducts: number;
    setSearchTerm: (searchTerm: string) => void;
    searchTerm: string;
    showProductQuantitiesModal: () => void;
    setShowCreateNewProductModal: () => void;
    // Novos props para exibir os filtros ativos
    selectedSection?: string;
    selectedSubsection?: string;
}

export default function ProductsHeader({ 
    totalProducts, 
    setSearchTerm, 
    searchTerm, 
    showProductQuantitiesModal, 
    setShowCreateNewProductModal,
    selectedSection,
    selectedSubsection,
}: ProductsHeaderProps) {
    const title = selectedSection ? `${toTitleCase(selectedSection)} - ${selectedSubsection && toTitleCase(selectedSubsection)}` : 'Todos os produtos';
    return (
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg w-full">
            <div></div>
            <div className="flex flex-col justify-center items-center gap-4">
                <button
                    className="text-2xl font-bold text-[#333333] p-4 border-2 border-[#C48B9F] hover:border-[#D4AF37] transition rounded-xl"
                    onClick={ showProductQuantitiesModal }
                >
                    { title } ({ totalProducts })
                </button>
                <button
                    className="bg-[#C48B9F] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#D4AF37] transition"
                    type="button"
                    onClick={ setShowCreateNewProductModal }
                >
                    Adicionar Produto
                </button>
            </div>
            <form onSubmit={ () => {} } className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                    className="p-3 border border-[#C48B9F] rounded-lg flex-grow text-[#333333] placeholder-[#C48B9F] focus:outline-none"
                    type="text"
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    placeholder="Buscar produtos..."
                />
            </form>
        </div>
    );
}
