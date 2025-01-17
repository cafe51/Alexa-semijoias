import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import SlideUpModal from '@/app/components/ModalMakers/SlideUpModal';
import DualRangeSlider from '@/components/ui/DualRangeSlider';

interface ProductFilterProps {
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
}


export default function ProductFilter({ 
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
}: ProductFilterProps) {
    return (
        <SlideUpModal
            isOpen={ isOpen }
            closeModelClick={ onClose }
            title="Filtros"
        >
            <div className="flex flex-col gap-6 p-4 w-full max-w-md mx-auto">
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
                    max={ 20 }
                    step={ 1 }
                />

                <DualRangeSlider
                    label="Preço (R$)"
                    value={ priceRange }
                    onChange={ setPriceRange }
                    min={ 0 }
                    max={ 2000 }
                    step={ 1 }
                />
            </div>
        </SlideUpModal>
    );
}
