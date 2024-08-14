// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CategoriesSection.tsx

import ModalMaker from '@/app/components/ModalMaker';
import { useState } from 'react';
import CreateCategoriesForm from './CreateCategories';
import { StateNewProductType } from '@/app/utils/types';

interface CategoriesSectionmProps {
    handleAddCategories: (category: string) => void
    handleRemoveAllCategories: () => void
    handleRemoveCategory: (category: string) => void
    state: StateNewProductType;
  }

export default function CategoriesSection({
    state: { categories },
    handleAddCategories,
    handleRemoveAllCategories,
    handleRemoveCategory,
}: CategoriesSectionmProps) {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);

    return (
        <section className="p-4 border rounded-md bg-white">
            { (showVariationEditionModal) && (
                <ModalMaker
                    title='Crie novas categorias'
                    closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }
                >
                    <CreateCategoriesForm
                        categories={ categories }
                        handleAddCategories={ handleAddCategories }
                        handleRemoveAllCategories={ handleRemoveAllCategories }
                        handleRemoveCategory={ handleRemoveCategory }
                    />
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Categorias</h2>
                { (categories && categories.length > 0) &&
                <button className='text-blue-500'
                    onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                        Editar
                </button> }
            </div>

            <div className=' border-t border-solid w-full p-4'>
                {
                    (categories && categories.length > 0)
                        ?
                        <div className='flex flex-wrap gap-2'>
                            {
                                categories.map((category, index) => {
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
                                Adicionar variações
                            </button>
                        </div>)
                }
            </div>
        </section>
    );
}
