// app/admin/dashboard/[adminId]/produtos/novo/SiteSectionSection.tsx
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, SectionType, StateNewProductType, UseNewProductState } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import ChooseSection from './ChooseSection';
import ProductSections from '../../productPage/ProductSections';

interface SiteSectionSectionProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
}
export default function SiteSectionSection({ state, handlers }: SiteSectionSectionProps) {
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [sections, setSections] = useState<((SectionType & FireBaseDocument)[]) | (SectionType[])| never[]>([]);
    const [newSections, setNewSections] = useState<(SectionType)[] | never[]>([]);
    const [newSubSection, setNewSubSection] = useState<{sectionName: string, subsection: string} | undefined>(undefined);

    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);


    useEffect(() => {
        async function getSectionsFromFireBase() {
            const res = await getAllDocuments();
            setSections(res);
        }
        getSectionsFromFireBase();
    }, []);

    useEffect(() => {
        setSections((prevSections) => {
            return [...prevSections, ...newSections];
        });
    }, [newSections]);

    useEffect(() => {
        if(newSubSection) {
            setSections((prevSections) => {
                const prevSectionsClone = [...prevSections];
                const newSectionsMapped = prevSectionsClone.map((pvS) => {
                    if(pvS.sectionName === newSubSection.sectionName) {
                        return {
                            ...pvS,
                            subsections: pvS.subsections ? [...pvS.subsections, newSubSection.subsection] : [newSubSection.subsection],
                        };
                    } else return { ...pvS };
                });
                return newSectionsMapped;
            });
        }
    }, [newSubSection]);

    return (
        <section className="p-4 border rounded-md bg-white">
            { (showSectionEditionModal) && (
                <ModalMaker
                    title='Selecione a seção'
                    closeModelClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                >
                    <ChooseSection
                        state={ state }
                        handlers={ handlers }
                        setNewSubSection={ setNewSubSection }
                        setNewSections={ setNewSections }
                        firebaseSections={ sections }
                    />

                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Seção</h2>
                { (state.sectionsSite && state.sectionsSite.length > 0) &&
                <button className='text-blue-500'
                    onClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }>
                        Editar
                </button> }
            </div>
            {
                (state.sectionsSite && state.sectionsSite.length > 0)
                    ?
                    (<div className="mt-2 flex flex-col justify-between border-t border-solid text-center w-full text-xs">
                        { <ProductSections sections={ state.sections } subsections={ state.subsections }/> }
                        <button onClick={ () => {
                            handlers.handleAddSectionsSite([]);
                            handlers.handleAddSubSection([]);
                            handlers.handleAddSection([]);
                        } }>X</button>
                    </div>)
        
                    :
                    (<div className="mt-2 border-t border-solid text-center w-full">
                        <button
                            className="text-blue-500"
                            onClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                        >
                    Escolha a seção
                        </button>
                    </div>)
            }
        </section>
    );
}
