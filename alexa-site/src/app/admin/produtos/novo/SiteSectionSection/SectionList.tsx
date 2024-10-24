import React, { Dispatch, SetStateAction, useState } from 'react';
import { SectionType, SiteSectionManagementType } from '@/app/utils/types';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { normalizeString } from '@/app/utils/normalizeString';
import { removePunctuationAndSpace } from '@/app/utils/removePunctuationAndSpace';

interface SectionListProps {
    firebaseSections: SectionType[];
  setNewSections: Dispatch<SetStateAction<SectionType[] | never[]>>
  siteSectionManagement: SiteSectionManagementType;
}

export default function SectionList({ firebaseSections, setNewSections, siteSectionManagement }: SectionListProps){
    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>();

    return (
        <div className="flex flex-col gap-2">
            { (showSectionEditionModal) && (
                <ModalMaker
                    title='Criar nova seção'
                    closeModelClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                >
                    <section className='flex flex-col gap-4'>
                        <div className="p-2">
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                id='newSection'
                                name='newSection'
                                type="text"
                                value={ newSectionName.toLowerCase() }
                                onChange={ (e) => {
                                    setNewSectionName(removePunctuationAndSpace(e.target.value).toLowerCase());
                                    setErrorMessage(undefined);
                                } }
                                placeholder="nova seção"
                            />
                            { errorMessage && <span className='text-sm text-red-500'>{ errorMessage }</span> }
                        </div>
                        <button
                            className='p-2 bg-green-600 text-white disabled:bg-gray-300 '
                            disabled={ !(!!newSectionName && newSectionName.length > 0)  }
                            onClick={ () => {
                                if(firebaseSections.some((fbsection) => normalizeString(fbsection.sectionName) === normalizeString(newSectionName))) {
                                    setErrorMessage('Já existe uma seção com esse nome');
                                } else {
                                    setNewSections([{ sectionName: newSectionName.toLowerCase().trim() }]);
                                    setNewSectionName('');
                                    setShowSectionEditionModal(!showSectionEditionModal);
                                }
                                
                            } }
                        >
                            Criar
                        </button>
                    </section>
                    
                </ModalMaker>) }
            {
                firebaseSections.map((section, index) => (
                    <p
                        key={ index }
                        className={ `p-2 rounded-lg text-sm min-w-20
            ${siteSectionManagement.selectedSection?.sectionName === section.sectionName ? 'border-solid border-blue-500 border-4' : ''}
            ${siteSectionManagement.savedSections.includes(section.sectionName) ? 'bg-green-500 text-white' : 'bg-gray-100'}` }
                        onClick={ () => siteSectionManagement.handleSectionClick(section) }
                    >
                        { section.sectionName }
                    </p>
                ))
            }
            <p
                className={ 'p-2 rounded-lg text-sm min-w-20 bg-gray-100 border-dashed border-2 border-green-500 text-center text-green-500' }
                onClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
            >
                +
            </p>
        </div>
    );
}
