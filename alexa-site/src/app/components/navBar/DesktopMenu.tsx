// src/app/components/navBar/DesktopMenu.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionType, CollectionType } from '@/app/utils/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createSlugName } from '@/app/utils/createSlugName';

export type DesktopMenuProps = {
  menuSections: SectionType[];
  collections: CollectionType[];
  router: AppRouterInstance;
};

export default function DesktopMenu({ menuSections, collections, router }: DesktopMenuProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [openCollections, setOpenCollections] = useState(false);
    const [, startTransition] = useTransition();

    const hasSubsections = (section: SectionType) => {
        return Array.isArray(section.subsections) && section.subsections.length > 0;
    };

    return (
        <nav className="flex items-center justify-start gap-2" aria-label="Root Menu">
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
                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-lg group focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 mx-0 px-4"
                            size="lg"
                            onClick={ () => {
                                startTransition(() => {
                                    router.push('/section/' + createSlugName(section.sectionName));
                                });
                            } }
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
                                { section.subsections?.map((subsection: string, subIndex: number) => (
                                    <Button
                                        key={ subIndex }
                                        variant="ghost"
                                        className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        onClick={ () => {
                                            startTransition(() => {
                                                router.push(
                                                    '/section/' +
                                                    createSlugName(section.sectionName) +
                                                    '/' +
                                                    createSlugName(subsection),
                                                );
                                            });
                                        } }
                                    >
                                        { subsection.toUpperCase() }
                                    </Button>
                                )) }
                            </div>
                        </PopoverContent>
                    ) }
                </Popover>
            )) }
            { /* Item de menu para Coleções */ }
            { collections.length > 0 && (
                <Popover open={ openCollections } onOpenChange={ (open) => setOpenCollections(open) }>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-lg group mx-0 px-4"
                            size="lg"
                            onClick={ () => {} }
                            onMouseEnter={ () => setOpenCollections(true) }
                            onMouseLeave={ () => setOpenCollections(false) }
                        >
                            COLEÇÕES
                            <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none"
                        sideOffset={ 5 }
                        onMouseEnter={ () => setOpenCollections(true) }
                        onMouseLeave={ () => setOpenCollections(false) }
                    >
                        <div className="flex flex-col">
                            { collections.map((collection, index) => (
                                <Button
                                    key={ `collection-${index}` }
                                    variant="ghost"
                                    className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onClick={ () => {
                                        startTransition(() => {
                                            router.push('/colecoes/' + collection.slugName);
                                        });
                                    } }
                                >
                                    { collection.name.toUpperCase() }
                                </Button>
                            )) }
                        </div>
                    </PopoverContent>
                </Popover>
            ) }
        </nav>
    );
}
