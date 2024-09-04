// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import { useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import ProductVariationFormFilled from './ProductVariationFormFilled';
import CreateNewProductVariationForm from './CreateNewProductVariationForm';

interface VariationsSectionProps { state: StateNewProductType; handlers: UseNewProductState;}

// const variations = [ 'tamanho', 'cor' ];

// const productVariations = [
//     {
//         customProperties: { tamanho: 'pequeno', cor: 'verde', idade: '22', nacionalidade: 'brasileiro' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
//     {
//         customProperties: { tamanho: 'grande', cor: 'verde', idade: '44', nacionalidade: 'indiano' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
//     {
//         customProperties: { tamanho: 'médio', cor: 'amarelo', idade: '233', nacionalidade: 'americano' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 } },
//     },
// ];

export default function VariationsSection({ state, handlers }: VariationsSectionProps) {
    const [errorMessage, setErrorMessage] = useState<string>();
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
            barcode: '',
            sku: '',
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
                    <CreateVariationsForm state={ state } handlers={ handlers } setProductVariationState={ setProductVariationState } />
                </ModalMaker>
            ) }

            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Variações</h2>
                { (state.variations && state.variations.length > 0) &&
                <button className='text-blue-500'
                    onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                        Editar
                </button> }
            </div>
            
            <div className=' border-t border-solid w-full'>
                {
                    (state.variations && state.variations.length > 0)
                        ?
                        <CreateNewProductVariationForm
                            state={ state }
                            errorMessage={ errorMessage }
                            setErrorMessage={ setErrorMessage }
                            handlers={ handlers }
                            productVariationState={ productVariationState }
                            setProductVariationState={ setProductVariationState }
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
                    (state.productVariations && state.productVariations.length > 0 && state.variations && state.variations.length > 0)
                        &&
                        <ProductVariationFormFilled
                            images={ state.images }
                            state={ state }
                            errorMessage={ errorMessage }
                            setErrorMessage={ setErrorMessage }
                            handlers={ handlers }

                        />
                }
            </div>
        </section>
    );
}
