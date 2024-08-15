// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { StateNewProductType, VariationProductType } from '@/app/utils/types';
import { useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import ProductVariationFormFilled from './ProductVariationFormFilled';
import CreateNewProductVariationForm from './CreateNewProductVariationForm';

interface VariationsSectionProps {
    handleVariationsChange: (variations: string[] | never[]) => void;
    state: StateNewProductType;
    handleAddProductVariation: (productVariation: VariationProductType) => void;
    handleRemoveProductVariation: (productVariation: VariationProductType) => void;
    handleUpdateProductVariation: (oldVariation: VariationProductType, newVariation: VariationProductType) => void;
    handleAddNewVariationInAllProductVariations: (newVariation: string) => void;
    handleRemoveVariationInAllProductVariations: (variationToBeRemoved: string) => void;
    handleClearProductVariations: () => void;
    handleStockQuantityChange: (estoque: number | undefined) => void
}

// const variations = [ 'tamanho', 'cor' ];

// const productVariations = [
//     {
//         customProperties: { tamanho: 'P', cor: 'verde' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
//     {
//         customProperties: { tamanho: 'G', cor: 'verde' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
//     {
//         customProperties: { tamanho: 'M', cor: 'amarelo' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
// ];

export default function VariationsSection({
    state: { variations, productVariations, images },
    handleVariationsChange,
    handleAddProductVariation,
    handleRemoveProductVariation,
    handleUpdateProductVariation,
    handleAddNewVariationInAllProductVariations,
    handleRemoveVariationInAllProductVariations,
    handleClearProductVariations,
    handleStockQuantityChange,
}: VariationsSectionProps) {
    const [productVariationState, setProductVariationState] = useState<VariationProductType>({
        customProperties: { },
        defaultProperties: {
            imageIndex: 0,
            peso: 0,
            estoque: 0,
            dimensions: {
                largura: 0,
                altura: 0,
                comprimento: 0,
            },
        },
    });
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);

    return (
        <section className="flex flex-col gap-2 p-4 border rounded-md bg-white w-full">
            { showVariationEditionModal &&(
                <ModalMaker
                    title='Crie novas variações'
                    closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                >
                    <CreateVariationsForm
                        handleVariationsChange={ handleVariationsChange }
                        variations={ variations }
                        handleAddNewVariationInAllProductVariations={ handleAddNewVariationInAllProductVariations }
                        handleRemoveVariationInAllProductVariations={ handleRemoveVariationInAllProductVariations }
                        handleClearProductVariations={ handleClearProductVariations }
                        setProductVariationState={ setProductVariationState }


                    />
                </ModalMaker>
            ) }

            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Variações</h2>
                { (variations && variations.length > 0) &&
                <button className='text-blue-500'
                    onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                        Editar
                </button> }
            </div>
            
            <div className=' border-t border-solid w-full'>
                {
                    (variations && variations.length > 0)
                        ?
                        <CreateNewProductVariationForm
                            variations={ variations }
                            productVariationState={ productVariationState }
                            setProductVariationState={ setProductVariationState }
                            handleAddProductVariation={ handleAddProductVariation }
                            handleStockQuantityChange={ handleStockQuantityChange }
                        />
                        
                        :
                        (<div className="mt-2 text-center w-full">
                            <button
                                className="text-blue-500"
                                onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                            >
                                Adicionar variações
                            </button>
                        </div>)
                }
                {
                    (productVariations && productVariations.length > 0 && variations && variations.length > 0)
                        &&
                        <ProductVariationFormFilled
                            images={ images && images.length > 0 ? images.map((image) => image.localUrl) :  null }
                            productVariations={ productVariations }
                            variations={ variations }
                            handleRemoveProductVariation={ handleRemoveProductVariation }
                            handleUpdateProductVariation={ handleUpdateProductVariation }
                        />
                }
            </div>
        </section>
    );
}
