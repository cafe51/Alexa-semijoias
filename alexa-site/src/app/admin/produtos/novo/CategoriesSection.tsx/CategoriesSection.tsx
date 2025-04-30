// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CategoriesSection.tsx
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useEffect, useState } from 'react';
import CreateCategoriesForm from './CreateCategories';
import { CategoryType, CheckboxData, FireBaseDocument, StateNewProductType, UseNewProductState } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';

interface CategoriesSectionProps { handlers: UseNewProductState; state: StateNewProductType; }

export default function CategoriesSection({ state, handlers }: CategoriesSectionProps) {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);
    const { getAllDocuments } = useCollection<CategoryType>('categories');
    const [categoriesStateFromFirebase, setCategoriesStateFromFirebase] = useState<(CategoryType & FireBaseDocument)[] | never[]>([]);
    const [options, setOptions] = useState<CheckboxData[]>([]);

    useEffect(() => {
        async function getCategoriesFromFirebase() {
            const res = await getAllDocuments();
            setCategoriesStateFromFirebase(res);
        }
        getCategoriesFromFirebase();
    }, []);

    useEffect(() => {
        const initialOptions = categoriesStateFromFirebase.map((c) => ({ label: c.categoryName, isChecked: state.categoriesFromFirebase.includes(c.categoryName) }));
        setOptions(initialOptions);
    }, [categoriesStateFromFirebase]);

    return (
        <section className="p-4 border rounded-md bg-white">
            { (showVariationEditionModal) && (
                <ModalMaker title='Crie novas categorias' closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) } narrowViewport >
                    <CreateCategoriesForm
                        categories={ [...state.categories, ...state.categoriesFromFirebase]  }
                        options={ options }
                        setOptions={ setOptions }
                        handlers={ handlers }
                    />
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
