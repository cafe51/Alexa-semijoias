// src/app/components/navBar/DesktopMenu.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionType, CollectionType } from '@/app/utils/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createSlugName } from '@/app/utils/createSlugName';

export type DesktopMenuProps = {
  menuSections: SectionType[];
  maxDesktopMenuItems: number
  collections: CollectionType[];
  router: AppRouterInstance;
};

export default function DesktopMenu({ menuSections, maxDesktopMenuItems, collections, router }: DesktopMenuProps) {
    // Estados separados para itens visíveis e itens ocultos
    const [openMainIndex, setOpenMainIndex] = useState<number | null>(null);
    const [openHiddenIndex, setOpenHiddenIndex] = useState<number | null>(null);
    const [openMore, setOpenMore] = useState(false);
    const [, startTransition] = useTransition();

    // Timeout para delay no fechamento do popover "MAIS"
    const [popoverTimeout, setPopoverTimeout] = useState<NodeJS.Timeout | null>(null);

    // Quantos itens serão exibidos diretamente no header
    // const MAX_VISIBLE_ITEMS = 4;
    const visibleMenuSections = menuSections.slice(0, maxDesktopMenuItems);
    const hiddenMenuSections = menuSections.slice(maxDesktopMenuItems);

    // Verifica se a seção possui subsections
    const hasSubsections = (section: SectionType) => {
        return Array.isArray(section.subsections) && section.subsections.length > 0;
    };

    /**
   * Renderiza um item de menu com popover para subsections, se houver.
   * @param section A seção a ser renderizada.
   * @param index Índice numérico usado como chave.
   * @param lateralPopover Se true, indica que o item está dentro do popover "MAIS".
   */
    const renderMenuItem = (
        section: SectionType,
        index: number,
        lateralPopover: boolean = false,
    ) => {
        const key = index; // índice numérico estável como key
        // Usa estado diferente dependendo se o item está dentro do popover oculto ou não
        const isOpen = lateralPopover ? openHiddenIndex === key : openMainIndex === key;
        const setOpen = lateralPopover ? setOpenHiddenIndex : setOpenMainIndex;

        return hasSubsections(section) ? (
            <Popover
                key={ key }
                open={ isOpen }
                onOpenChange={ (open: boolean) => {
                    if (open) {
                        setOpen(key);
                    } else {
                        setOpen(null);
                    }
                } }
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-[#333333] hover:bg-[#F8C3D3]/20 text-sm lg:text-sm xl:text-base mx-0 px-0 pr-2 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0 focus:outline-none focus:ring-0"
                        size="lg"
                        onClick={ () => {
                            startTransition(() => {
                                router.push('/section/' + createSlugName(section.sectionName));
                            });
                        } }
                        onMouseEnter={ () => setOpen(key) }
                        onMouseLeave={ () => setOpen(null) }
                    >
                        { section.sectionName.toUpperCase() }
                        { lateralPopover ? (
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform" />
                        ) : (
                            <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                        ) }
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side={ lateralPopover ? 'right' : 'bottom' }
                    align={ lateralPopover ? 'start' : 'center' }
                    // Para popovers laterais (dentro do "MAIS"), sideOffset=0 garante que o topo fique alinhado
                    sideOffset={ lateralPopover ? 0 : 5 }
                    className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none focus:outline-none focus:ring-0"
                    onMouseEnter={ () => setOpen(key) }
                    onMouseLeave={ () => setOpen(null) }
                >
                    <div className="flex flex-col">
                        { section.subsections?.map((subsection: string, subIndex: number) => (
                            <Button
                                key={ subIndex }
                                variant="ghost"
                                className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
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
            </Popover>
        ) : (
            <Button
                key={ key }
                variant="ghost"
                className="text-[#333333] hover:bg-[#F8C3D3]/20 text-sm lg:text-sm xl:text-base mx-0 px-0 pr-2 focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
                size="lg"
                onClick={ () => {
                    startTransition(() => {
                        router.push('/section/' + createSlugName(section.sectionName));
                    });
                } }
            >
                { section.sectionName.toUpperCase() }
            </Button>
        );
    };

    return (
        <nav className="flex items-center justify-start gap-2" aria-label="Root Menu">
            { /* Itens visíveis diretamente */ }
            { visibleMenuSections.map((section, index) => renderMenuItem(section, index, false)) }

            { /* Se houver itens ocultos ou coleções, renderiza o popover "MAIS" */ }
            { (hiddenMenuSections.length > 0) && (
                <Popover open={ openMore } onOpenChange={ (open) => setOpenMore(open) }>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-sm lg:text-sm xl:text-base mx-0 px-0 focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
                            size="lg"
                            onMouseEnter={ () => {
                                if (popoverTimeout) {
                                    clearTimeout(popoverTimeout);
                                    setPopoverTimeout(null);
                                }
                                setOpenMore(true);
                            } }
                            onMouseLeave={ () => {
                                setPopoverTimeout(setTimeout(() => setOpenMore(false), 150));
                            } }
                        >
              MAIS
                            <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
                        sideOffset={ 5 }
                        onMouseEnter={ () => {
                            if (popoverTimeout) {
                                clearTimeout(popoverTimeout);
                                setPopoverTimeout(null);
                            }
                            setOpenMore(true);
                        } }
                        onMouseLeave={ () => {
                            setPopoverTimeout(setTimeout(() => setOpenMore(false), 150));
                        } }
                    >
                        <div className="flex flex-col">
                            { hiddenMenuSections.map((section, index) =>
                            // Itens do popover "MAIS" usam popover lateral (ícone ChevronRight)
                                renderMenuItem(section, index, true),
                            ) }
                            { /* Se coleções existir, renderiza como último item dentro do popover "MAIS" */ }
                            { collections.length > 0 && (
                                <Popover
                                    key="collections"
                                    open={ openHiddenIndex === -1 }
                                    onOpenChange={ (open: boolean) => {
                                        if (open) {
                                            setOpenHiddenIndex(-1);
                                        } else {
                                            setOpenHiddenIndex(null);
                                        }
                                    } }
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-sm lg:text-sm xl:text-base mx-0 px-0 focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
                                            size="lg"
                                            onMouseEnter={ () => setOpenHiddenIndex(-1) }
                                            onMouseLeave={ () => setOpenHiddenIndex(null) }
                                        >
                      COLEÇÕES
                                            <ChevronRight className="ml-2 h-4 w-4 transition-transform" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="right"
                                        align="start"
                                        // Para alinhar o topo do popover com o item, usamos sideOffset=0
                                        sideOffset={ 0 }
                                        className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none focus:outline-none focus:ring-0"
                                        onMouseEnter={ () => setOpenHiddenIndex(-1) }
                                        onMouseLeave={ () => setOpenHiddenIndex(null) }
                                    >
                                        <div className="flex flex-col">
                                            { collections.map((collection, index) => (
                                                <Button
                                                    key={ `collection-${index}` }
                                                    variant="ghost"
                                                    className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none focus:outline-none focus:ring-0 outline-transparent focus:none focus-visible:ring-transparent ring-transparent outline-none ring-0"
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
                        </div>
                    </PopoverContent>
                </Popover>
            ) }

            { /* Caso não haja itens ocultos, renderiza COLEÇÕES separadamente */ }
            { hiddenMenuSections.length === 0 && collections.length > 0 && (
                <Popover
                    open={ openMainIndex === -1 }
                    onOpenChange={ (open: boolean) => {
                        if (open) {
                            setOpenMainIndex(-1);
                        } else {
                            setOpenMainIndex(null);
                        }
                    } }
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-[#333333] hover:bg-[#F8C3D3]/20 text-sm lg:text-sm xl:text-base mx-0 px-0 focus:outline-none focus:ring-0"
                            size="lg"
                            onMouseEnter={ () => setOpenMainIndex(-1) }
                            onMouseLeave={ () => setOpenMainIndex(null) }
                        >
              COLEÇÕES
                            <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="bottom"
                        className="w-56 bg-white/95 backdrop-blur-sm p-0 border-none focus:outline-none focus:ring-0"
                        sideOffset={ 5 }
                        onMouseEnter={ () => setOpenMainIndex(-1) }
                        onMouseLeave={ () => setOpenMainIndex(null) }
                    >
                        <div className="flex flex-col">
                            { collections.map((collection, index) => (
                                <Button
                                    key={ `collection-${index}` }
                                    variant="ghost"
                                    className="justify-start hover:bg-[#F8C3D3]/20 w-full text-center p-6 border-none focus:outline-none focus:ring-0"
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
