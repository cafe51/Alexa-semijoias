// src/app/components/navBar/DesktopMenu.tsx
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionType } from '@/app/utils/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createSlugName } from '@/app/utils/createSlugName';

interface DesktopMenuProps {
  menuSections: SectionType[];
  router: AppRouterInstance;
}

function DesktopMenu({ menuSections, router }: DesktopMenuProps) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const hasSubsections = (section: SectionType) => {
        return Array.isArray(section.subsections) && section.subsections.length > 0;
    };

    return (
        <nav className="flex items-center justify-center space-x-8">
            { menuSections.map((section, index) => (
                <Popover
                    key={ index }
                    open={ openIndex === index }
                    onOpenChange={ (open: boolean) => {
                        if (open && hasSubsections(section)) {
                            setOpenIndex(index);
                        } else {
                            setOpenIndex(null);
                        }
                    } }
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-lg group focus:outline-none"
                            size="lg"
                            onClick={ () =>
                                router.push('/section/' + createSlugName(section.sectionName))
                            }
                            onMouseEnter={ () => hasSubsections(section) && setOpenIndex(index) }
                            onMouseLeave={ () => setOpenIndex(null) }
                        >
                            { section.sectionName.toUpperCase() }
                            { hasSubsections(section) && (
                                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                            ) }
                        </Button>
                    </PopoverTrigger>
                    { hasSubsections(section) && (
                        <PopoverContent
                            className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none"
                            sideOffset={ 5 }
                            onMouseEnter={ () => setOpenIndex(index) }
                            onMouseLeave={ () => setOpenIndex(null) }
                        >
                            <div className="flex flex-col">
                                { section.subsections?.map(
                                    (subsection: string, subIndex: number) => (
                                        <Button
                                            key={ subIndex }
                                            variant="ghost"
                                            className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none"
                                            onClick={ () =>
                                                router.push(
                                                    '/section/' +
                            createSlugName(section.sectionName) +
                            '/' +
                            createSlugName(subsection),
                                                )
                                            }
                                        >
                                            { subsection.toUpperCase() }
                                        </Button>
                                    ),
                                ) }
                            </div>
                        </PopoverContent>
                    ) }
                </Popover>
            )) }
        </nav>
    );
}

export default React.memo(DesktopMenu);
