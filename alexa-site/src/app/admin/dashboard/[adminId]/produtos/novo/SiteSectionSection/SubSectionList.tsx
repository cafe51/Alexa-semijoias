import React, { Dispatch, SetStateAction, useState } from 'react';
import { SiteSectionManagementType } from '@/app/utils/types';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';

interface SubSectionListProps {
    siteSectionManagement: SiteSectionManagementType;
    setNewSubSection: Dispatch<SetStateAction<{ sectionName: string; subsection: string; } | undefined>>
}

export default function SubSectionList({ siteSectionManagement, setNewSubSection }: SubSectionListProps) {
    const isSubSectionSaved = (sectionName: string, subsection: string) => {
        return siteSectionManagement.savedSubSections.some(saved => saved.sectionName === sectionName && saved.subsection === subsection);
    };
    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);
    const [newSubSectionName, setNewSubSectionName] = useState('');

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
                                value={ newSubSectionName }
                                onChange={ (e) => setNewSubSectionName(e.target.value) }
                                placeholder="Nova Sub Seção"
                            />
                        </div>
                        <button
                            className='p-2 bg-green-500 disabled:bg-gray-300 '
                            disabled={ !(!!newSubSectionName && newSubSectionName.length > 0)  }
                            onClick={ () => {
                                siteSectionManagement.selectedSection?.sectionName
                                && setNewSubSection({ sectionName: siteSectionManagement.selectedSection?.sectionName, subsection: newSubSectionName });

                                siteSectionManagement.selectedSection
                                && siteSectionManagement.handleSectionClick(
                                    {
                                        ...siteSectionManagement.selectedSection,
                                        subsections: siteSectionManagement.selectedSection.subsections
                                            ? [...siteSectionManagement.selectedSection.subsections, newSubSectionName ]
                                            : [newSubSectionName],
                                    },
                                );
                                setNewSubSectionName('');
                                setShowSectionEditionModal(!showSectionEditionModal);
                            } }
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
                        onClick={ () => siteSectionManagement.handleSubSectionClick(subsection) }
                    >
                        { subsection }
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

