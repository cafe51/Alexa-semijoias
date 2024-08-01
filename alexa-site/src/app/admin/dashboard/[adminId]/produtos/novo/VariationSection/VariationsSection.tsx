// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { UseNewProductStateType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import ProductVariationFormFilled from './ProductVariationFormFilled';
import CreateNewProductVariationForm from './CreateNewProductVariationForm';

interface VariationsSectionProps {
    showVariationEditionModal: boolean;
    setShowVariationEditionModal: Dispatch<SetStateAction<boolean>>;
    handleVariationsChange: (variations: string[] | never[]) => void;
    state: UseNewProductStateType;
    handleAddProductVariation: (productVariation: any) => void;
    handleRemoveProductVariation: (productVariation: any) => void;
    handleUpdateProductVariation: (oldVariation: any, newVariation: any) => void;
    handleAddNewVariationInAllProductVariations: (newVariation: string) => void;
    handleRemoveVariationInAllProductVariations: (variationToBeRemoved: string) => void;
    handleClearProductVariations: () => void;

}

// const vars = ['cor', 'tamanho'];
// const vars = ['cor', 'tamanho', 'peso', 'idade', 'altura', 'nacionalidade', 'nome', 'sobrenome', 'seila', 'cidade', 'estado', 'rua', 'bairro', 'cep', 'idioma'];
// const produtosMock = [
//     { cor: 'amarelo', tamanho: 'pequeno', quantidade: 2 },
//     { cor: 'vermelho', tamanho: 'pequeno', quantidade: 3 },
//     { cor: 'amarelo', tamanho: 'grande', quantidade: 5 },
// ];

export default function VariationsSection({
    state: { variations, productVariations },
    showVariationEditionModal,
    setShowVariationEditionModal,
    handleVariationsChange,
    handleAddProductVariation,
    handleRemoveProductVariation,
    handleUpdateProductVariation,
    handleAddNewVariationInAllProductVariations,
    handleRemoveVariationInAllProductVariations,
    handleClearProductVariations,
}: VariationsSectionProps) {
    const [productVariationState, setProductVariationState] = useState({});

    function handleShowModal() {
        showVariationEditionModal ? setShowVariationEditionModal(false) : setShowVariationEditionModal(true);
    }

    return (
        <section className="flex flex-col gap-2 p-4 border rounded-md bg-white w-full">
            { (showVariationEditionModal) && (
                <ModalMaker title='Crie novas variações' closeModelClick={ handleShowModal }>
                    <CreateVariationsForm
                        handleVariationsChange={ handleVariationsChange }
                        variations={ variations }
                        handleAddNewVariationInAllProductVariations={ handleAddNewVariationInAllProductVariations }
                        handleRemoveVariationInAllProductVariations={ handleRemoveVariationInAllProductVariations }
                        handleClearProductVariations={ handleClearProductVariations }

                    />
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Variações</h2>
                { (variations && variations.length > 0) && <p className='text-blue-500' onClick={ handleShowModal }>Editar</p> }
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
                            <button className="text-blue-500" onClick={ handleShowModal } >Adicionar variações</button>
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
