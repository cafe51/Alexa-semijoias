// app/admin/dashboard/[adminId]/produtos/novo/SiteSectionSection.tsx
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, SectionType, StateNewProductType } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import ChooseSection from './ChooseSection';
import { useSectionManagement } from '@/app/hooks/useSectionManagement';

interface SiteSectionSectionProps {
    state: StateNewProductType;
    handleAddSection: (sections: string[]) => void
    handleAddSubSection: (sections: string[] | undefined) => void
    handleAddSectionsSite: (sections: SectionType[] | never[]) => void
}
export default function SiteSectionSection({
    state: { sectionsSite },
    handleAddSectionsSite,
    handleAddSubSection,
    handleAddSection,
}: SiteSectionSectionProps) {
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [sections, setSections] = useState<((SectionType & FireBaseDocument)[]) | (SectionType[])| never[]>([]);
    const [newSections, setNewSections] = useState<(SectionType)[] | never[]>([]);
    const [newSubSection, setNewSubSection] = useState<{sectionName: string, subsection: string} | undefined>(undefined);

    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);

    const {
        sectionList,
        savedSections,
        savedSubSections,
        selectedSection,
        selectedSubSection,
        handleSectionClick,
        handleSubSectionClick,
        addSectionOrSubSection,
        removeSectionOrSubSection,
    } = useSectionManagement({ initialState: sectionsSite });

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
                        setNewSubSection={ setNewSubSection }
                        setNewSections={ setNewSections }
                        firebaseSections={ sections }
                        handleAddSectionsSite={ handleAddSectionsSite }
                        handleAddSection={ handleAddSection }
                        handleAddSubSection={ handleAddSubSection }
                        sectionList={ sectionList }
                        savedSections={ savedSections }
                        savedSubSections={ savedSubSections }
                        selectedSection={ selectedSection }
                        selectedSubSection={ selectedSubSection }
                        handleSectionClick={ handleSectionClick }
                        handleSubSectionClick={ handleSubSectionClick }
                        addSectionOrSubSection={ addSectionOrSubSection }
                        removeSectionOrSubSection={ removeSectionOrSubSection }
                    />

                </ModalMaker>
            ) }
            <div className='flex justify-between'>
                <h2 className="text-lg font-bold">Seção</h2>
                { (sectionsSite && sectionsSite.length > 0) &&
                <button className='text-blue-500'
                    onClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }>
                        Editar
                </button> }
            </div>
            {
                (sectionsSite && sectionsSite.length > 0)
                    ?
                    (<div className="mt-2 flex flex-col justify-between border-t border-solid text-center w-full text-xs">
                        {
                            sectionsSite.map((section, index) => {
                                return (
                                    <div key={ index } className='flex gap-1'>
                                        <div className='p-2 bg-blue-500 text-white rounded-lg'>
                                            { section.sectionName }
                                        </div>
                                        {
                                            section.subsections && section.subsections.length > 0
                                            &&
                                        <div className='p-2 bg-blue-500 text-white rounded-lg'>
                                            { section.subsections.map((subsection, index) => {
                                                return (<p key={ index }>
                                                    { subsection }
                                                </p>);
                                            }) }
                                        </div>
                                        }
                                        
                                    </div>
                                );
                            })
                        }

                        <button onClick={ () => {
                            handleAddSectionsSite([]);
                            handleAddSubSection([]);
                            handleAddSection([]);
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
