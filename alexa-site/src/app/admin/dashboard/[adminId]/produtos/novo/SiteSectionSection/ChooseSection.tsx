import React, { Dispatch, SetStateAction, useEffect } from 'react';
import SectionList from './SectionList';
import SubSectionList from './SubSectionList';
import { SectionType } from '@/app/utils/types';
import { SavedSubSectionType } from '@/app/hooks/useSectionManagement';
import { DocumentData, WithFieldValue } from 'firebase/firestore';

interface ChooseSectionProps {
  firebaseSections: never[] | (SectionType & WithFieldValue<DocumentData>)[];
  handleAddSection: (sections: string[]) => void;
  handleAddSubSection: (sections: string[] | undefined) => void;
  handleAddSectionsSite: (sections: SectionType[] | never[]) => void;
  setNewSections: Dispatch<SetStateAction<SectionType[] | never[]>>
  setNewSubSection: Dispatch<SetStateAction<{
    sectionName: string;
    subsection: string;
} | undefined>>
    sectionList: SectionType[],
    savedSections: string[],
    savedSubSections: SavedSubSectionType[],
    selectedSection: SectionType | undefined,
    selectedSubSection: string | undefined,
    handleSectionClick: (section: SectionType) => void,
    handleSubSectionClick: (subsection: string) => void,
    addSectionOrSubSection: () => void,
    removeSectionOrSubSection: () => void,
}

export default function ChooseSection({
    firebaseSections,
    handleAddSectionsSite,
    handleAddSubSection,
    handleAddSection,
    setNewSections,
    setNewSubSection,
    sectionList,
    savedSections,
    savedSubSections,
    selectedSection,
    selectedSubSection,
    handleSectionClick,
    handleSubSectionClick,
    addSectionOrSubSection,
    removeSectionOrSubSection,
}: ChooseSectionProps) {


    useEffect(() => {
        handleAddSectionsSite(sectionList);
        handleAddSection(sectionList.map(({ sectionName }) => sectionName));
        handleAddSubSection(savedSubSections.map(({ sectionName, subsection }) => `${sectionName}:${subsection}`));
    }, [sectionList, savedSubSections]);

    return (
        <section className="flex flex-col h-full w-full gap-2">
            <div className="flex gap-2 h-full w-full">
                <SectionList
                    sections={ firebaseSections }
                    savedSections={ savedSections }
                    selectedSection={ selectedSection }
                    onSelectSection={ handleSectionClick }
                    setNewSections={ setNewSections }
                />

                <div className="min-h-full border border-solid border-gray-200 w-[1px]" />

                <SubSectionList
                    setNewSubSection={ setNewSubSection }
                    selectedSection={ selectedSection }
                    subsections={ selectedSection?.subsections }
                    savedSubSections={ savedSubSections }
                    selectedSubSection={ selectedSubSection }
                    onSelectSubSection={ handleSubSectionClick }
                    onSelectSection={ handleSectionClick }
                />
            </div>
            <div className="flex gap-2 self-end">
                <button className="bg-green-600 text-white rounded-full p-2 px-4 w-fit" onClick={ addSectionOrSubSection }>+</button>
                <button className="bg-red-600 text-white rounded-full p-2 px-4 w-fit" onClick={ removeSectionOrSubSection }>-</button>
            </div>
        </section>
    );
}
     
