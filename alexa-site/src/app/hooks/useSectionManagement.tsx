import { useState, useEffect } from 'react';
import { SectionType } from '@/app/utils/types';

export type SavedSubSectionType = {
  sectionName: string;
  subsection: string;
};

interface UseSectionManagementProps {
  initialState: SectionType[] | never[];
}

export function useSectionManagement({ initialState }: UseSectionManagementProps) {
    const [sectionList, setSectionList] = useState<SectionType[]>(initialState);
    const [savedSections, setSavedSections] = useState<string[]>([]);
    const [savedSubSections, setSavedSubSections] = useState<SavedSubSectionType[]>([]);
    const [selectedSection, setSelectedSection] = useState<SectionType | undefined>();
    const [selectedSubSection, setSelectedSubSection] = useState<string | undefined>();

    useEffect(() => {
        const initialSavedSections = initialState.map((e) => e.sectionName);
        setSavedSections(initialSavedSections);

        const savedSubSections = initialState
            .flatMap(({ sectionName, subsections }) =>
                subsections?.map((subsection) => ({ sectionName, subsection })),
            );

        setSavedSubSections(savedSubSections.filter(savedSubSection => savedSubSection !== undefined));
    }, []);

    const handleSectionClick = (section: SectionType) => {
        setSelectedSection(section);
        setSelectedSubSection(undefined);
    };

    const handleSubSectionClick = (subsection: string) => {
        setSelectedSubSection(subsection);
    };

    const addSectionOrSubSection = () => {
        if (!selectedSection) return;

        const newSectionList = [...sectionList];
        const foundSectionIndex = sectionList.findIndex(section => section.sectionName === selectedSection.sectionName);

        if (selectedSubSection) {
            if (foundSectionIndex !== -1) {
                const foundSection = newSectionList[foundSectionIndex];
                
                const updatedSubsections = foundSection.subsections
                    ? Array.from(new Set([...foundSection.subsections, selectedSubSection]))
                    : [selectedSubSection];

                newSectionList[foundSectionIndex] = { ...foundSection, subsections: updatedSubsections };
            } else {
                newSectionList.push({ ...selectedSection, subsections: [selectedSubSection] });
            }

            saveSubSection(selectedSection.sectionName, selectedSubSection);
            
        } else if (foundSectionIndex === -1) {
            newSectionList.push({ ...selectedSection, subsections: [] });
        }

        saveSection(selectedSection);
        setSectionList(newSectionList);
    };

    const removeSectionOrSubSection = () => {
        if (!selectedSection) return;

        if(!selectedSubSection) {
            const updatedSectionList = sectionList.filter(section => section.sectionName !== selectedSection.sectionName);
            setSectionList(updatedSectionList);
        }

        if(selectedSubSection) {
            const updatedSectionList = sectionList.map((section) => {
                if(section.sectionName === selectedSection.sectionName) {
                    const updatedSubsections = section.subsections?.filter(sub => sub !== selectedSubSection);
                    return { ...section, subsections: updatedSubsections };
                }
                else {
                    return section;
                }
            });
            setSectionList(updatedSectionList);
        }

        if (selectedSubSection) {
            setSavedSubSections(prev =>
                prev.filter(sub => !(sub.sectionName === selectedSection.sectionName && sub.subsection === selectedSubSection)),
            );
        } else {
            setSavedSubSections(prev => prev.filter(sub => sub.sectionName !== selectedSection.sectionName));
            setSavedSections(prev => prev.filter(sectionName => sectionName !== selectedSection.sectionName));
        }
    };

    const saveSection = (section: SectionType) => {
        setSavedSections(prev => [...prev, section.sectionName]);
    };

    const saveSubSection = (sectionName: string, subsection: string) => {
        setSavedSubSections((prev) => {
            const prevClone = [...prev];
            const filteredPrevSections = prevClone.filter((p) => p.sectionName === sectionName);
            if(filteredPrevSections.some((filtPrev) => filtPrev.subsection.includes(subsection)) === false) {
                return [...prev, { sectionName, subsection }];
            } else return prev;
        });
    };

    return {
        siteSectionManagement: {
            sectionList,
            savedSections,
            savedSubSections,
            selectedSection,
            selectedSubSection,
            handleSectionClick,
            handleSubSectionClick,
            addSectionOrSubSection,
            removeSectionOrSubSection,
        },
    };
}
