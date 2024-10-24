import React, { Dispatch, SetStateAction, useState } from 'react';
import { FireBaseDocument, SectionType, SiteSectionManagementType } from '@/app/utils/types';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { normalizeString } from '@/app/utils/normalizeString';
import { removePunctuationAndSpace } from '@/app/utils/removePunctuationAndSpace';

interface SubSectionListProps {
    siteSectionManagement: SiteSectionManagementType;
    setNewSubSection: Dispatch<SetStateAction<{ sectionName: string; subsection: string; } | undefined>>
    firebaseSections: never[] | (SectionType & FireBaseDocument)[] | SectionType[]
}

export default function SubSectionList({ siteSectionManagement, setNewSubSection, firebaseSections }: SubSectionListProps) {
    const isSubSectionSaved = (sectionName: string, subsection: string) => {
        return siteSectionManagement.savedSubSections.some(saved => saved.sectionName === sectionName && saved.subsection === subsection);
    };
    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);
    const [newSubSectionName, setNewSubSectionName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>();

    function handleCrateNewSubSection() {
        const selectedSection = siteSectionManagement.selectedSection;
        if(!selectedSection || !selectedSection.sectionName) return;

        const foundedSection = firebaseSections.find((fbsection) => normalizeString(fbsection.sectionName) === selectedSection.sectionName);
        if(foundedSection?.subsections?.some((ss) => ss === newSubSectionName)) {
            setErrorMessage('Já existe uma sub seção com esse nome');
        } else {
            setNewSubSection({ sectionName: selectedSection.sectionName.trim(), subsection: newSubSectionName.trim() });

            siteSectionManagement.handleSectionClick(
                {
                    ...selectedSection,
                    subsections: selectedSection.subsections
                        ? [...selectedSection.subsections, newSubSectionName.trim() ]
                        : [newSubSectionName.trim()],
                },
            );
            setNewSubSectionName('');
            setShowSectionEditionModal(!showSectionEditionModal);
        }
    }


    return (
        <div className="flex flex-col gap-2 bg-gray-100 w-full">
            { (showSectionEditionModal) && (
                <ModalMaker
                    title='Criar nova sub seção'
                    closeModelClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                >
                    <section className='flex flex-col gap-4'>
                        <div className="p-2">
                            { /* <label className="flex flex-col p-2" htmlFor='name'>Nome</label> */ }
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                id='newSubSectionName'
                                name='newSubSectionName'
                                type="text"
                                value={ newSubSectionName.toLowerCase() }
                                onChange={ (e) => {
                                    //Preciso de uma forma de remover sinais de pontuação do valor criado no onChange para o e.target.value.
                                    setNewSubSectionName(removePunctuationAndSpace(e.target.value.toLowerCase()));
                                    setErrorMessage(undefined);
                                } }
                                placeholder="nova subseção"
                            />
                            { errorMessage && <span className='text-sm text-red-500'>{ errorMessage }</span> }

                        </div>
                        <button
                            className='p-2 bg-green-500 disabled:bg-gray-300 '
                            disabled={ !(!!newSubSectionName && newSubSectionName.length > 0)  }
                            onClick={ handleCrateNewSubSection }
                        >
                            Criar
                        </button>
                    </section>
                    
                </ModalMaker>) }
            {
                siteSectionManagement.selectedSection?.subsections?.map((subsection, index) => (
                    <p
                        key={ index }
                        className={ `p-2 rounded-lg text-xs min-w-20
            ${siteSectionManagement.selectedSubSection === subsection ? 'border-solid border-blue-500 border-4' : ''}
            ${siteSectionManagement.selectedSection
                && siteSectionManagement.selectedSection.sectionName
                && isSubSectionSaved(siteSectionManagement.selectedSection.sectionName!, subsection)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200'}` }
                        onClick={ () => siteSectionManagement.handleSubSectionClick(subsection.toLowerCase()) }
                    >
                        { subsection.toLowerCase() }
                    </p>
                ))
            }
            
            { siteSectionManagement.selectedSection && <p
                className={ 'p-2 rounded-lg text-sm min-w-20 bg-gray-100 border-dashed border-2 border-green-500 text-center text-green-500' }
                onClick={ () =>  setShowSectionEditionModal(!showSectionEditionModal) }
            >
                +
            </p> }
        </div>
    );
}

