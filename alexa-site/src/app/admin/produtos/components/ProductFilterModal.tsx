// src/app/admin/produtos/components/ProductFilterModal.tsx
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import SlideUpModal from '@/app/components/ModalMakers/SlideUpModal';
import DualRangeSlider from '@/components/ui/DualRangeSlider';
import { SectionType, FireBaseDocument } from '@/app/utils/types';

const MAX_STOCK_EMULATOR = 9999999999;
const MAX_PRICE_EMULATOR = 999999999999999;
const MAX_STOCK_PRODUCTION = 20;
const MAX_PRICE_PRODUCTION = 2000;

const MAX_STOCK = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ? MAX_STOCK_EMULATOR : MAX_STOCK_PRODUCTION;
const MAX_PRICE = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ? MAX_PRICE_EMULATOR : MAX_PRICE_PRODUCTION;

interface ProductFilterModalProps {
    showStoreProducts: boolean;
    setShowStoreProducts: (value: boolean) => void;
    showOutStoreProducts: boolean;
    setShowOutStoreProducts: (value: boolean) => void;
    estoqueRange: [number, number];
    setEstoqueRange: (value: [number, number]) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    isOpen: boolean;
    onClose: () => void;
    selectedSection: string;
    setSelectedSection: (value: string) => void;
    selectedSubsection: string;
    setSelectedSubsection: (value: string) => void;
    siteSections: (SectionType & FireBaseDocument)[];
    // Novos filtros:
    showPromotional: boolean;
    setShowPromotional: (value: boolean) => void;
    showLancamento: boolean;
    setShowLancamento: (value: boolean) => void;
}

export default function ProductFilterModal({ 
    showStoreProducts, 
    setShowStoreProducts,
    showOutStoreProducts,
    setShowOutStoreProducts,
    estoqueRange,
    setEstoqueRange,
    priceRange,
    setPriceRange,
    isOpen,
    onClose,
    selectedSection,
    setSelectedSection,
    selectedSubsection,
    setSelectedSubsection,
    siteSections,
    showPromotional,
    setShowPromotional,
    showLancamento,
    setShowLancamento,
}: ProductFilterModalProps) {
    // Obtém as subseções disponíveis para a seção selecionada
    const currentSection = siteSections.find(s => s.sectionName === selectedSection);
    const availableSubsections = currentSection?.subsections || [];

    return (
        <SlideUpModal
            isOpen={ isOpen }
            closeModelClick={ onClose }
            title="Filtros"
        >
            <div className="flex flex-col gap-6 p-4 w-full max-w-md mx-auto">
                { /* Filtro por Seção */ }
                <div className="flex flex-col gap-2">
                    <Label htmlFor="section-select" className="text-sm font-medium">
                        Seção
                    </Label>
                    <select
                        id="section-select"
                        value={ selectedSection }
                        onChange={ (e) => {
                            setSelectedSection(e.target.value);
                            // Ao mudar a seção, reseta a subseção
                            setSelectedSubsection('');
                        } }
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="">Todas as seções</option>
                        { siteSections.map((section) => (
                            <option key={ section.id } value={ section.sectionName }>
                                { section.sectionName }
                            </option>
                        )) }
                    </select>
                </div>

                { /* Filtro por Subseção – exibido somente se uma seção estiver selecionada */ }
                { selectedSection && availableSubsections.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subsection-select" className="text-sm font-medium">
                            Subseção
                        </Label>
                        <select
                            id="subsection-select"
                            value={ selectedSubsection }
                            onChange={ (e) => setSelectedSubsection(e.target.value) }
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="">Todas as subseções</option>
                            { availableSubsections.map((sub) => (
                                <option key={ sub } value={ sub }>{ sub }</option>
                            )) }
                        </select>
                    </div>
                ) }

                <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-store"
                            checked={ showStoreProducts }
                            onCheckedChange={ setShowStoreProducts }
                            aria-labelledby="show-store-label"
                            className="focus:ring focus:ring-blue-500"
                        />
                        <Label id="show-store-label" htmlFor="show-store">
                            Mostrar produtos da loja
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-out-store"
                            checked={ showOutStoreProducts }
                            onCheckedChange={ setShowOutStoreProducts }
                            aria-labelledby="show-out-store-label"
                            className="focus:ring focus:ring-blue-500"
                        />
                        <Label id="show-out-store-label" htmlFor="show-out-store">
                            Mostrar produtos fora da loja
                        </Label>
                    </div>
                </div>

                <DualRangeSlider
                    label="Estoque"
                    value={ estoqueRange }
                    onChange={ setEstoqueRange }
                    min={ 0 }
                    max={ MAX_STOCK }
                    step={ 1 }
                />

                <DualRangeSlider
                    label="Preço (R$)"
                    value={ priceRange }
                    onChange={ setPriceRange }
                    min={ 0 }
                    max={ MAX_PRICE }
                    step={ 1 }
                />

                { /* Novos filtros para Promoção e Lançamento */ }
                <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-promotional"
                            checked={ showPromotional }
                            onCheckedChange={ setShowPromotional }
                            aria-labelledby="show-promotional-label"
                            className="focus:ring focus:ring-blue-500"
                        />
                        <Label id="show-promotional-label" htmlFor="show-promotional">
                            Apenas produtos em promoção
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-lancamento"
                            checked={ showLancamento }
                            onCheckedChange={ setShowLancamento }
                            aria-labelledby="show-lancamento-label"
                            className="focus:ring focus:ring-blue-500"
                        />
                        <Label id="show-lancamento-label" htmlFor="show-lancamento">
                            Apenas produtos em lançamento
                        </Label>
                    </div>
                </div>
            </div>
        </SlideUpModal>
    );
}
