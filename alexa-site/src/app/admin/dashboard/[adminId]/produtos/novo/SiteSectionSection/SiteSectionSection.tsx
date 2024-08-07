// app/admin/dashboard/[adminId]/produtos/novo/SiteSectionSection.tsx
import ModalMaker from '@/app/components/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { SectionType, FullProductType } from '@/app/utils/types';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ChooseSection from './ChooseSection';

interface SiteSectionSectionProps {
    state: FullProductType;
    handleAddSection: (sections: SectionType[] | never[]) => void
}
export default function SiteSectionSection({ state: { sectionsSite }, handleAddSection }: SiteSectionSectionProps) {
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [sections, setSections] = useState<(SectionType & WithFieldValue<DocumentData>)[] | never[]>([]);

    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);

    useEffect(() => {
        async function getSectionsFromFireBase() {
            const res = await getAllDocuments();
            setSections(res);
        }
        getSectionsFromFireBase();
    }, []);

    return (
        <section className="p-4 border rounded-md bg-white">
            { (showSectionEditionModal) && (
                <ModalMaker
                    title='Selecione a seção'
                    closeModelClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                >
                    <ChooseSection firebaseSections={ sections } handleAddSection={ handleAddSection } initialState={ sectionsSite }/>
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

                        <button onClick={ () => handleAddSection([]) }>X</button>
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
