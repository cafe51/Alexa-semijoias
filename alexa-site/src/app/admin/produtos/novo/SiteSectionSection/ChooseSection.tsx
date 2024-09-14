import React, { Dispatch, SetStateAction, useEffect } from 'react';
import SectionList from './SectionList';
import SubSectionList from './SubSectionList';
import { FireBaseDocument, SectionType, StateNewProductType, UseNewProductState } from '@/app/utils/types';
import { useSectionManagement } from '@/app/hooks/useSectionManagement';

interface ChooseSectionProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    firebaseSections: never[] | (SectionType & FireBaseDocument)[] | SectionType[];
    setNewSections: Dispatch<SetStateAction<SectionType[] | never[]>>
    setNewSubSection: Dispatch<SetStateAction<{ sectionName: string; subsection: string; } | undefined>>
}

export default function ChooseSection({ state, firebaseSections, handlers, setNewSections, setNewSubSection }: ChooseSectionProps) {
    const { siteSectionManagement } = useSectionManagement({ initialState: state.sectionsSite });

    useEffect(() => {
        handlers.handleAddSectionsSite(siteSectionManagement.sectionList);
        handlers.handleAddSection(siteSectionManagement.sectionList.map(({ sectionName }) => sectionName));
        handlers.handleAddSubSection(siteSectionManagement.savedSubSections.map(({ sectionName, subsection }) => `${sectionName}:${subsection}`));
    }, [siteSectionManagement.sectionList, siteSectionManagement.savedSubSections]);

    return (
        <section className="flex flex-col h-full w-full gap-2">
            <div className="flex gap-2 h-full w-full">
                <SectionList
                    firebaseSections={ firebaseSections }
                    siteSectionManagement={ siteSectionManagement }
                    setNewSections={ setNewSections }
                />

                <div className="min-h-full border border-solid border-gray-200 w-[1px]" />

                <SubSectionList
                    firebaseSections={ firebaseSections }
                    setNewSubSection={ setNewSubSection }
                    siteSectionManagement={ siteSectionManagement }
                />
            </div>
            <div className="flex gap-2 self-end">
                <button className="bg-green-600 text-white rounded-full p-2 px-4 w-fit" onClick={ siteSectionManagement.addSectionOrSubSection }>+</button>
                <button className="bg-red-600 text-white rounded-full p-2 px-4 w-fit" onClick={ siteSectionManagement.removeSectionOrSubSection }>-</button>
            </div>
        </section>
    );
}
     
