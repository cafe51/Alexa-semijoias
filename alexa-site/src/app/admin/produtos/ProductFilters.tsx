// src/app/admin/produtos/ProductFilters.tsx
import { SectionType, FireBaseDocument } from '@/app/utils/types';
import ProductFilterModal from './components/ProductFilterModal';

interface ProductFilterModalProps {
    showStoreProducts: boolean;
    setShowStoreProducts: (value: boolean) => void;
    showOutStoreProducts: boolean;
    setShowOutStoreProducts: (value: boolean) => void;
    estoqueRange: [number, number];
    setEstoqueRange: (value: [number, number]) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    setShowFilterModal: (value: boolean) => void;
    showFilterModal: boolean;
    // Props de seção e subseção
    selectedSection: string;
    setSelectedSection: (value: string) => void;
    selectedSubsection: string;
    setSelectedSubsection: (value: string) => void;
    siteSections: (SectionType & FireBaseDocument)[];
    disableFilterChange: boolean;
    // Novos filtros
    showPromotional: boolean;
    setShowPromotional: (value: boolean) => void;
    showLancamento: boolean;
    setShowLancamento: (value: boolean) => void;
}

export default function ProductFilters({
    showStoreProducts,
    setShowStoreProducts,
    showOutStoreProducts,
    setShowOutStoreProducts,
    estoqueRange,
    setEstoqueRange,
    priceRange,
    setPriceRange,
    setShowFilterModal,
    showFilterModal,
    selectedSection,
    setSelectedSection,
    selectedSubsection,
    setSelectedSubsection,
    siteSections,
    disableFilterChange,
    showPromotional,
    setShowPromotional,
    showLancamento,
    setShowLancamento,
}: ProductFilterModalProps) {
    return (
        <>
            <button
                onClick={ () => setShowFilterModal(true) }
                disabled={ disableFilterChange }
                className="
                    px-4 rounded-md block mb-4
                    w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] 
                    h-11 sm:h-12 md:h-14 lg:h-16
                    text-base md:text-lg lg:text-xl 
                    bg-[#FAF9F6] 
                    text-[#333333] 
                    border border-[#C48B9F] 
                    transition-colors 
                    hover:bg-[#C48B9F] 
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:border-[#C48B9F]/50
                    disabled:text-[#C48B9F]/50
                    disabled:hover:bg-transparent
                    disabled:hover:text-[#C48B9F]/50
                    "
            >
                Filtros
            </button>
            <ProductFilterModal
                showStoreProducts={ showStoreProducts }
                setShowStoreProducts={ setShowStoreProducts }
                showOutStoreProducts={ showOutStoreProducts }
                setShowOutStoreProducts={ setShowOutStoreProducts }
                estoqueRange={ estoqueRange }
                setEstoqueRange={ setEstoqueRange }
                priceRange={ priceRange }
                setPriceRange={ setPriceRange }
                isOpen={ showFilterModal }
                onClose={ () => setShowFilterModal(false) }
                selectedSection={ selectedSection }
                setSelectedSection={ setSelectedSection }
                selectedSubsection={ selectedSubsection }
                setSelectedSubsection={ setSelectedSubsection }
                siteSections={ siteSections }
                showPromotional={ showPromotional }
                setShowPromotional={ setShowPromotional }
                showLancamento={ showLancamento }
                setShowLancamento={ setShowLancamento }
            />
        </>
    );
}
