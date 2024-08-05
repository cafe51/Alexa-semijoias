// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { UseNewProductStateType, VariationProductType } from '@/app/utils/types';
import { useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import ProductVariationFormFilled from './ProductVariationFormFilled';
import CreateNewProductVariationForm from './CreateNewProductVariationForm';

interface VariationsSectionProps {
    handleVariationsChange: (variations: string[] | never[]) => void;
    state: UseNewProductStateType;
    handleAddProductVariation: (productVariation: VariationProductType) => void;
    handleRemoveProductVariation: (productVariation: VariationProductType) => void;
    handleUpdateProductVariation: (oldVariation: VariationProductType, newVariation: VariationProductType) => void;
    handleAddNewVariationInAllProductVariations: (newVariation: string) => void;
    handleRemoveVariationInAllProductVariations: (variationToBeRemoved: string) => void;
    handleClearProductVariations: () => void;

}

// const vars = ['cor', 'tamanho'];
// const vars = ['cor', 'tamanho', 'peso', 'idade', 'altura', 'nacionalidade', 'nome', 'sobrenome', 'seila', 'cidade', 'estado', 'rua', 'bairro', 'cep', 'idioma'];
// const produtosMock = [
//     { cor: 'amarelo', tamanho: 'pequeno', quantidade: 2, peso: 1,  dimensions: { altura: 2, largura: 5 ,comprimento: 4 } },
//     { cor: 'vermelho', tamanho: 'pequeno', quantidade: 3, peso: 1,  dimensions: { altura: 2, largura: 5 ,comprimento: 4 }  },
//     { cor: 'amarelo', tamanho: 'grande', quantidade: 5, peso: 1,  dimensions: { altura: 2, largura: 5 ,comprimento: 4 }   },
// ];

export default function VariationsSection({
    state: { variations, productVariations },
    handleVariationsChange,
    handleAddProductVariation,
    handleRemoveProductVariation,
    handleUpdateProductVariation,
    handleAddNewVariationInAllProductVariations,
    handleRemoveVariationInAllProductVariations,
    handleClearProductVariations,
}: VariationsSectionProps) {
    const [productVariationState, setProductVariationState] = useState<VariationProductType>({
        customProperties: { },
        defaultProperties: {
            peso: 0,
            quantidade: 0,
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
            { (showVariationEditionModal) && (
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
                    (productVariations && productVariations.length > 0)
                        &&
                        <ProductVariationFormFilled
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
