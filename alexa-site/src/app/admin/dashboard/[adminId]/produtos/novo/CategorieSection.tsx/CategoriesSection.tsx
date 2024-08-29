// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CategoriesSection.tsx
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useState } from 'react';
import CreateCategoriesForm from './CreateCategories';
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';

interface CategoriesSectionProps { handlers: UseNewProductState; state: StateNewProductType; }

export default function CategoriesSection({ state, handlers }: CategoriesSectionProps) {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);

    return (
        <section className="p-4 border rounded-md bg-white">
            { (showVariationEditionModal) && (
                <ModalMaker title='Crie novas categorias' closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) } >
                    <CreateCategoriesForm categories={ [...state.categories, ...state.categoriesFromFirebase]  } handlers={ handlers }/>
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Categorias</h2>
                { ((state.categories && state.categories.length > 0) || (state.categoriesFromFirebase && state.categoriesFromFirebase.length > 0)) &&
                <button className='text-blue-500'
                    onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                        Editar
                </button> }
            </div>

            <div className=' border-t border-solid w-full p-4'>
                {
                    ((state.categories && state.categories.length > 0) || (state.categoriesFromFirebase && state.categoriesFromFirebase.length > 0))
                        ?
                        <div className='flex flex-wrap gap-2'>
                            {
                                [...state.categories, ...state.categoriesFromFirebase].map((category, index) => {
                                    return (
                                        <div key={ index } className='p-2 bg-green-700 text-white text-xs rounded-lg'>
                                            { category }
                                        </div>
                                    );
                                })
                            }
                        </div>
                        :
                        (<div className="mt-2 text-center w-full">
                            <button
                                className="text-blue-500"
                                onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                            >
                                Adicionar categorias
                            </button>
                        </div>)
                }
            </div>
        </section>
    );
}
