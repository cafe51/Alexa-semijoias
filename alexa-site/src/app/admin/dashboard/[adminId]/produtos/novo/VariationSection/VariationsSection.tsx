// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { UseNewProductStateType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import ProductVariationForm from './ProductVariationForm';



interface VariationsSectionProps {
    showVariationEditionModal: boolean;
    setShowVariationEditionModal: Dispatch<SetStateAction<boolean>>;
    handleVariationsChange: (variations: string[] | never[]) => void;
    state: UseNewProductStateType;
    handleAddProductVariation: (productVariation: any) => void;
}

const vars = ['cor', 'tamanho'];
// const vars = ['cor', 'tamanho', 'peso', 'idade', 'altura', 'nacionalidade', 'nome', 'sobrenome', 'seila', 'cidade', 'estado', 'rua', 'bairro', 'cep', 'idioma'];


export default function VariationsSection({ showVariationEditionModal, setShowVariationEditionModal, handleVariationsChange, state: { variations, productVariations }, handleAddProductVariation }: VariationsSectionProps) {
    const [productVariationState, setProductVariationState] = useState({});

    function handleShowModal() {
        showVariationEditionModal ? setShowVariationEditionModal(false) : setShowVariationEditionModal(true);
    }

    return (
        <section className="flex flex-col gap-2 p-4 border rounded-md bg-white w-full">
            { (showVariationEditionModal) && (
                <ModalMaker title='Crie novas variações' closeModelClick={ handleShowModal }>
                    <CreateVariationsForm handleVariationsChange={ handleVariationsChange } variations={ vars }/>
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Variações</h2>
                { (vars && vars.length > 0) && <p className='text-blue-500' onClick={ handleShowModal }>Editar</p> }
            </div>
            <div className=' border-t border-solid w-full'>
                {
                    (vars && vars.length > 0)
                        ?
                        <ProductVariationForm
                            variations={ vars }
                            productVariationState={ productVariationState }
                            setProductVariationState={ setProductVariationState }
                            handleAddProductVariation={ handleAddProductVariation }
                        />
                        :
                        (<div className="mt-2 text-center w-full">
                            <button className="text-blue-500" onClick={ handleShowModal } >Adicionar variações</button>
                        </div>)
                }
            </div>
        </section>
    );
}
