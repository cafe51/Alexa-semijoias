// src/app/admin/produtos/components/ProductsHeader.tsx
import toTitleCase from '@/app/utils/toTitleCase';
import SetItemsPerPage from './SetItemsPerPage';

interface ProductsHeaderProps {
    totalProducts: number;
    setSearchTerm: (searchTerm: string) => void;
    searchTerm: string;
    showProductQuantitiesModal: () => void;
    setShowCreateNewProductModal: () => void;
    // Props para os filtros de seção e subseção
    selectedSection?: string;
    selectedSubsection?: string;
    // Novas props para configuração de itens por página
    itemsPerPage: number | 'all';
    setItemsPerPage: (value: number | 'all') => void;

    disablePaginationSizeChange: boolean;

}

export default function ProductsHeader({ 
    totalProducts, 
    setSearchTerm, 
    searchTerm, 
    showProductQuantitiesModal, 
    setShowCreateNewProductModal,
    selectedSection,
    selectedSubsection,
    itemsPerPage,
    setItemsPerPage,
    disablePaginationSizeChange,
}: ProductsHeaderProps) {
    const title = selectedSection ? `${toTitleCase(selectedSection)} - ${selectedSubsection && toTitleCase(selectedSubsection)}` : 'Todos os produtos';
    return (
        <div className="px-0 py-0 md:p-6 mb-6 rounded-lg w-full"> 
            <div className="flex flex-col justify-center items-center gap-4">
                <button
                    className="text-2xl font-bold text-[#333333] p-4 border-2 border-[#C48B9F] hover:border-[#D4AF37] transition rounded-xl"
                    onClick={ showProductQuantitiesModal }
                >
                    { title } ({ totalProducts })
                </button>
                <div className="flex justify-between items-end w-full">
                    <SetItemsPerPage itemsPerPage={ itemsPerPage } setItemsPerPage={ setItemsPerPage } disablePaginationSizeChange={ disablePaginationSizeChange } />

                    <button
                        className="
                        bg-[#C48B9F] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#D4AF37] transition
                        disabled:bg-[#C48B9F]/50 disabled:text-[#333333]/20 disabled:cursor-not-allowed
                        "
                        disabled={ disablePaginationSizeChange }
                        type="button"
                        onClick={ setShowCreateNewProductModal }
                    >
                        + Produto
                    </button>
                </div>
            </div>
            <form onSubmit={ () => {} } className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                    className="
                    p-3 border border-[#C48B9F] rounded-lg flex-grow text-[#333333] placeholder-[#C48B9F] focus:outline-none
                    disabled:cursor-not-allowed
                    disabled:border-[#C48B9F]/50
                    disabled:text-[#C48B9F]/50
                    disabled:hover:bg-transparent
                    disabled:hover:text-[#C48B9F]/50
                    "
                    type="text"
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    placeholder="Buscar produtos..."
                    disabled={ disablePaginationSizeChange }
                />
            </form>
        </div>
    );
}
