import { useState } from 'react';
import NavBarItem from './NavBarItem';
import { SectionType } from '@/app/utils/types';
import Link from 'next/link';

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
                    <Link href={ `/section/${section.sectionName}` } >Ver todos</Link>
                    { section.subsections.map((subsectionName) => <NavBarItem key={ subsectionName } sectionName={ `${ section.sectionName }/${subsectionName}` }/>) }
                </div>
            }
            <div className='w-full h-1 bg-pink-'></div>
        </section>
    );
}