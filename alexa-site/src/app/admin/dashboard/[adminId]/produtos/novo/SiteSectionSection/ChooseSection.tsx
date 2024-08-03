import { SectionType } from '@/app/utils/types';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ChooseSectionProps {
  firebaseSections: never[] | (SectionType & WithFieldValue<DocumentData>)[];
  handleAddSection: (sections: SectionType[] | never[]) => void // handleSection altera o valor que será atribuído à initialState no componente pai.
  initialState: SectionType[] | never[];
}

type SavedSubSectionType = {
  sectionName: string;
  subsection: string;
};

export default function ChooseSection({ firebaseSections, handleAddSection, initialState }: ChooseSectionProps) {
    const [sections, setSections] = useState<SectionType[]>([]);
    const [selectedSection, setSelectedSection] = useState<SectionType | undefined>();
    const [selectedSubSection, setSelectedSubSection] = useState<string | undefined>();
    const [sectionList, setSectionList] = useState<SectionType[] | never[]>(initialState);
    const [savedSections, setSavedSections] = useState<string[]>([]);
    const [savedSubSections, setSavedSubSections] = useState<SavedSubSectionType[]>([]);

    useEffect(() => {
        if(initialState) {
            setSectionList(initialState); // define o estado inicial

            const initialStateClone = [...initialState];
            const initialStateCloneClone = [...initialStateClone];

            const initialSavedSections = initialStateCloneClone.map((e) => e.sectionName);
            setSavedSections(initialSavedSections); // define as cores das sections inicial


            const initialSavedSubSections = initialStateClone.map((e) => {
                if (e.subsections) {
                    return e.subsections.map((subsection) => ({ sectionName: e.sectionName, subsection: subsection }));
                }
            }); // isso vai retornar um array do tipo: [[a,b], [c,d]]


            const flattenedInitialSavedSubSections = initialSavedSubSections.reduce((accumulator, current) => {
                if(accumulator && current) {
                    return [...accumulator, ...current];
                }
            }, []); // isso transforma o array para: [a,b,c,d]

            console.log('to be saved on:', flattenedInitialSavedSubSections);
            flattenedInitialSavedSubSections && setSavedSubSections(flattenedInitialSavedSubSections);  // define as cores das subsections inicial

        }
    }, []);

    useEffect(() => {
        // filtra as chaves id e exist de firebaseSections
        if(firebaseSections) {
            const filteredSections = firebaseSections.map(({ sectionName, subsections }) => ({ sectionName, subsections }));
            setSections(filteredSections);
        }
    }, [firebaseSections]);

    useEffect(() => {
        console.log('SectionList mudou', sectionList);
        console.log('savedSubSections mudou', savedSubSections);
        handleAddSection(sectionList);
    }, [sectionList]);

    const handleSectionClick = (section: SectionType) => {
        setSelectedSection(section);
        setSelectedSubSection(undefined);
    };

    const handleSubSectionClick = (subsection: string) => {
        setSelectedSubSection(subsection);
    };

    const isSubSectionSaved = (sectionName: string, subsection: string) => {
        return savedSubSections.some(saved => saved.sectionName === sectionName && saved.subsection === subsection);
    };

    const saveSection = (section: SectionType) => {
        setSavedSections(prev => [...prev, section.sectionName]);
    };

    const saveSubSection = (sectionName: string, subsection: string) => {
        setSavedSubSections(prev => [...prev, { sectionName, subsection }]);
    };

    const addSectionOrSubSection = () => {
        if (selectedSection) {
            const newSectionList = [...sectionList];
            const foundSectionIndex = newSectionList.findIndex(section => section.sectionName === selectedSection.sectionName);

            if (selectedSubSection) {
                if (foundSectionIndex !== -1) {
                    const foundSection = newSectionList[foundSectionIndex];
                    const updatedSubsections = foundSection.subsections ? [...foundSection.subsections, selectedSubSection] : [selectedSubSection];
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
        }
    };

    const removeSectionOrSubSection = () => {
        if (selectedSection) {
            const updatedSectionList = sectionList.filter(section => {
                if (section.sectionName === selectedSection.sectionName) {
                    if (selectedSubSection) {
                        const updatedSubsections = section.subsections?.filter(sub => sub !== selectedSubSection);
                        if (updatedSubsections?.length) {
                            return { ...section, subsections: updatedSubsections };
                        }
                    }
                    return false;
                }
                return true;
            });

            setSectionList(updatedSectionList);

            if (selectedSubSection) {
                setSavedSubSections(prev => prev.filter(sub => !(sub.sectionName === selectedSection.sectionName && sub.subsection === selectedSubSection)));
            } else {
                setSavedSubSections(prev => prev.filter(sub => sub.sectionName !== selectedSection.sectionName));
                setSavedSections(prev => prev.filter(sectionName => sectionName !== selectedSection.sectionName));
            }
        }
    };

    return (
        <section className="flex flex-col h-full w-full gap-2">
            <div className="flex gap-2 p-2 h-full w-full">
                <div className="flex flex-col gap-2">
                    { sections.map((section, index) => {
                        return (
                            <p
                                key={ index }
                                className={ `p-2 rounded-lg text-xs min-w-20 ${selectedSection?.sectionName === section.sectionName ? 'bg-blue-500 text-white' : savedSections.includes(section.sectionName) ? 'bg-green-500 text-white' : 'bg-gray-100'}` }
                                onClick={ () => handleSectionClick(section) }
                            >
                                { section.sectionName }
                            </p>
                        );})
                    }
                </div>

                <div className="min-h-full border border-solid border-gray-200 w-[1px]" />

                <div className="flex flex-col gap-2 bg-gray-100 w-full">
                    { selectedSection?.subsections?.map((subsection, index) => (
                        <p
                            key={ index }
                            className={ `p-2 rounded-lg text-xs min-w-20 ${selectedSubSection === subsection ? 'bg-blue-500 text-white' : isSubSectionSaved(selectedSection.sectionName, subsection) ? 'bg-green-500 text-white' : 'bg-gray-200'}` }
                            onClick={ () => handleSubSectionClick(subsection) }
                        >
                            { subsection }
                        </p>
                    )) }
                </div>
            </div>

            <div className="flex gap-2 self-end">
                <button className="bg-green-600 text-white rounded-full p-2 px-4 w-fit" onClick={ addSectionOrSubSection }>+</button>
                <button className="bg-red-600 text-white rounded-full p-2 px-4 w-fit" onClick={ removeSectionOrSubSection }>-</button>
            </div>
        </section>
    );
}
