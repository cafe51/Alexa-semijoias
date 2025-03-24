import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { CheckboxData, CollectionType, FireBaseDocument, StateNewProductType, UseNewProductState } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import CollectionsListFromFb from './CollectionsListFromFb';

interface CollectionsSectionProps { handlers: UseNewProductState; state: StateNewProductType; }


export default function CollectionsSection({ state, handlers }: CollectionsSectionProps) {
    const { collections, collectionsFromFirebase } = state;
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);
    const { getAllDocuments } = useCollection<CollectionType>('colecoes');
    const [collectionsStateFromFirebase, setCollectionsStateFromFirebase] = useState<(CollectionType & FireBaseDocument)[] | never[]>([]);
    const [options, setOptions] = useState<CheckboxData[]>([]);

    useEffect(() => {
        console.log('state', state);
        console.log('collectionsFromFirebase', collectionsFromFirebase);
    }, [collectionsFromFirebase]);
    
    useEffect(() => {
        async function getCollectionsFromFirebase() {
            const res = await getAllDocuments();
            setCollectionsStateFromFirebase(res);
        }
        getCollectionsFromFirebase();
    }, []);
    
    useEffect(() => {
        const initialOptions = collectionsStateFromFirebase.map((coll) => ({ label: coll.name, isChecked: collectionsFromFirebase.includes(coll.name) }));
        setOptions(initialOptions);
    }, [collectionsStateFromFirebase]);

    function handleCheckboxChange(label: string) {
        const updatedOptions = options.map((option) =>
            option.label === label ? { ...option, isChecked: !option.isChecked } : option,
        );
        setOptions(updatedOptions);
      
        // Atualizando selectedOptions
        const newSelectedOptions = updatedOptions
            .filter((option) => option.isChecked)
            .map((option) => option.label);
        handlers.handleSetCollectionsFromFb(newSelectedOptions);
    }
    
    return (
        <section className="p-4 border rounded-md bg-white">
            { (showVariationEditionModal) && (
                <ModalMaker title='Adicione à coleção' closeModelClick={ () => setShowVariationEditionModal(!showVariationEditionModal) } >
                    <CollectionsListFromFb
                        handlers={ handlers }
                        handleCheckboxChange={ handleCheckboxChange }
                        options={ options }
                        selectedOptions={ [...collections, ...collectionsFromFirebase] }
                        
                        
                    />
                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Coleções</h2>
                { ((collections && collections.length > 0) || (collectionsFromFirebase && collectionsFromFirebase.length > 0)) &&
                    <button className='text-blue-500'
                        onClick={ () => setShowVariationEditionModal(!showVariationEditionModal) }>
                            Editar
                    </button> }
            </div>
    
            <div className=' border-t border-solid w-full p-4'>
                {
                    ((collections && collections.length > 0) || (collectionsFromFirebase && collectionsFromFirebase.length > 0))
                        ?
                        <div className='flex flex-wrap gap-2'>
                            {
                                [...collections, ...collectionsFromFirebase].map((category, index) => {
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
                                    Adicionar à coleção
                            </button>
                        </div>)
                }
            </div>
        </section>
    );
}
    