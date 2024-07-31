// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { UseNewProductStateType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useState } from 'react';
import CreateVariationsForm from './CreateVariationsForm';
import VariationFieldInput from './VariationFieldInput';
import LargeButton from '@/app/components/LargeButton';

function InputQuantity({ quantity, setQuantity }: { quantity: number; setQuantity: Dispatch<SetStateAction<number>> }) {
    return (
        <div className='flex flex-col gap-2 p-2 w-full'>
            <label className="text-sm font-small" htmlFor="quantidade">Quantidade</label>
            <input
                className="self-center px-3 py-2 border rounded-md w-5/6"
                id="quantidade"
                name="quantidade"
                type="number"
                value={ quantity }
                onChange={ (e) => setQuantity(Number(e.target.value)) }
                placeholder=''
            />
        </div>
    );
}

interface ProductVariationFormProps {
    variations: string[];
    setProductVariationState: Dispatch<SetStateAction<any>>;
    productVariationState: any;
    handleAddProductVariation: (productVariation: any) => void;
}

function ProductVariationForm({ variations, productVariationState, setProductVariationState, handleAddProductVariation }: ProductVariationFormProps) {
    const [quantity, setQuantity] = useState(0);

    const handleSaveVariation = () => {
        console.log(Object.keys(productVariationState));
        console.log(variations);
        try {
            if (!productVariationState || Object.keys(productVariationState).length === 0) {
                throw new Error('Preenchimento inválido');
            }
            
            for (const key in productVariationState) {
                if (productVariationState[key] === '') {
                    throw new Error('Todos os campos devem estar preenchidos');
                }
            }
            handleAddProductVariation({ ...productVariationState, quantity });
            setProductVariationState({});
            setQuantity(0);
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className='w-full flex flex-col gap-2'>
            { variations.map((variation, index) => (
                <VariationFieldInput
                    key={ index }
                    variation={ variation }
                    productVariationState={ productVariationState }
                    setProductVariationState={ setProductVariationState }
                />
            )) }
        
            <InputQuantity quantity={ quantity } setQuantity={ setQuantity } />
            <LargeButton
                color='blue'
                disabled={ false }
                loadingButton={ false }
                onClick={ handleSaveVariation }>
                    Salvar variação
            </LargeButton>
        </div>
    );
}

interface VariationsSectionProps {
    showVariationEditionModal: boolean;
    setShowVariationEditionModal: Dispatch<SetStateAction<boolean>>;
    handleVariationsChange: (variations: string[] | never[]) => void;
    state: UseNewProductStateType;
    handleAddProductVariation: (productVariation: any) => void;
}

// const vars = ['cor', 'tamanho'];
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
                    <CreateVariationsForm handleVariationsChange={ handleVariationsChange } variations={ variations }/>
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Variações</h2>
                { (variations && variations.length > 0) && <p className='text-blue-500' onClick={ handleShowModal }>Editar</p> }
            </div>
            { (variations && variations.length > 0) && <button className='bg-green-300 p-2' onClick={ () => console.log(productVariations) }>Mostrar produto criado</button> }

            <div className=' border-t border-solid w-full'>
                {
                    (variations && variations.length > 0)
                        ?
                        <ProductVariationForm
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
            </div>
        </section>
    );
}
