import { useState } from 'react';
import NavBarItem from './NavBarItem';
import { SectionType } from '@/app/utils/types';

interface NavBarSectionProps {
    closeMenu: () => void;
    section: SectionType;
}

export default function NavBarSection({ section }: NavBarSectionProps) {
    const [isSubSectionOpen, setIsSubsectionOpen] = useState(false);
    const [showSubsection, setShowSubsection] = useState(false);

    return(
        <section className="flex flex-col">
            <div className="flex justify-between text-sm w-full px-2">
                <NavBarItem sectionName={ section.sectionName }/>
                {
                    section.subsections && <button
                        onClick={ () => {
                            setIsSubsectionOpen(!isSubSectionOpen);
                            setShowSubsection(!showSubsection);
                        } }
                    >
                        { isSubSectionOpen ? 'A' : 'V' }
                    </button>
                }
            </div>
            {
                showSubsection && section.subsections &&
                <div className='flex flex-col gap-2 px-2 text-xs'>
                    <a href={ `/${section.sectionName}` } >Ver todos</a>
                    { section.subsections.map((subsectionName) => <NavBarItem key={ subsectionName } sectionName={ subsectionName }/>) }
                </div>
            }
            <div className='w-full h-1 bg-pink-300'></div>
        </section>
    );
}