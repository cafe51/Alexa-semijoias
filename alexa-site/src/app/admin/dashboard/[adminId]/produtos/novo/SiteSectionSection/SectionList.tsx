import React, { Dispatch, SetStateAction, useState } from 'react';
import { SectionType } from '@/app/utils/types';
import ModalMaker from '@/app/components/ModalMaker';

interface SectionListProps {
  sections: SectionType[];
  savedSections: string[];
  selectedSection: SectionType | undefined;
  onSelectSection: (section: SectionType) => void;
  setNewSections: Dispatch<SetStateAction<SectionType[] | never[]>>
}

export default function SectionList({
    sections,
    savedSections,
    selectedSection,
    onSelectSection,
    setNewSections,
}: SectionListProps){
    const [showSectionEditionModal, setShowSectionEditionModal] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    return (
        <div className="flex flex-col gap-2">
            { (showSectionEditionModal) && (
                <ModalMaker
                    title='Criar nova seção'
                    closeModelClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
                >
                    <section className='flex flex-col gap-4'>
                        <div className="p-2">
                            { /* <label className="flex flex-col p-2" htmlFor='name'>Nome</label> */ }
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                id='newSection'
                                name='newSection'
                                type="text"
                                value={ newSectionName }
                                onChange={ (e) => setNewSectionName(e.target.value) }
                                placeholder="Nova Seção"
                            />
                        </div>
                        <button
                            className='p-2 bg-green-500 disabled:bg-gray-300 '
                            disabled={ !(!!newSectionName && newSectionName.length > 0)  }
                            onClick={ () => {
                                setNewSections([{ sectionName: newSectionName }]);
                                setShowSectionEditionModal(!showSectionEditionModal);
                            } }
                        >
                            Criar
                        </button>
                    </section>
                    
                </ModalMaker>) }
            { sections.map((section, index) => (
                <p
                    key={ index }
                    className={ `p-2 rounded-lg text-sm min-w-20
            ${selectedSection?.sectionName === section.sectionName ? 'border-solid border-blue-500 border-4' : ''}
            ${savedSections.includes(section.sectionName) ? 'bg-green-500 text-white' : 'bg-gray-100'}` }
                    onClick={ () => onSelectSection(section) }
                >
                    { section.sectionName }
                </p>
            )) }
            <p
                className={ 'p-2 rounded-lg text-sm min-w-20 bg-gray-100 border-dashed border-2 border-green-500 text-center text-green-500' }
                onClick={ () => setShowSectionEditionModal(!showSectionEditionModal) }
            >
                +
            </p>
        </div>
    );
}
