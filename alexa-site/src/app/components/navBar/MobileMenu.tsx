// src/app/components/navBar/MobileMenu.tsx
'use client';

import React, { useTransition } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import NavFooterLogged from './NavFooterLogged';
import NavFooterUnlogged from './NavFooterUnlogged';
import { FireBaseDocument, SectionType, CollectionType, UserType } from '@/app/utils/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { createSlugName } from '@/app/utils/createSlugName';
import SearchSection from './SearchSection';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: SectionType | null;
  menuSections: SectionType[];
  collections: (CollectionType & FireBaseDocument)[];
  handleSectionClick: (section: SectionType) => void;
  handleBackToMain: () => void;
  router: AppRouterInstance;
  userInfo: (UserType & FireBaseDocument) | null;
}

export default function MobileMenu({
    isMenuOpen,
    setIsMenuOpen,
    activeSection,
    menuSections,
    collections,
    handleSectionClick,
    handleBackToMain,
    router,
    userInfo,
}: MobileMenuProps) {
    const [, startTransition] = useTransition();

    // Função para tratar clique no item "COLEÇÕES"
    const handleCollectionsClick = () => {
        // Define activeSection como um objeto "fictício" para COLEÇÕES
        handleSectionClick({ sectionName: 'COLEÇÕES' });
    };

    return (
        <Sheet open={ isMenuOpen } onOpenChange={ setIsMenuOpen }>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className=" text-[#C48B9F]"
                    aria-label={ isMenuOpen ? 'Fechar menu' : 'Abrir menu' }
                >
                    { isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-6 w-6" /> }
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-4/5 sm:w-2/3 p-0 bg-transparent shadow-2xl shadow-slate-800"
                style={ {
                    background: 'linear-gradient(to bottom, rgba(248, 248, 248, 1) 0%, rgba(248, 248, 248, 1) 50%, rgba(248, 248, 248, 0.7) 100%)',
                } }
            >
                <DialogTitle hidden></DialogTitle>
                <nav className="h-full flex flex-col" aria-label="Root Menu">
                    <div className="flex-1 overflow-hidden relative">
                        <div
                            className={ `absolute inset-0 transition-transform duration-300 ease-in-out ${
                                activeSection ? '-translate-x-full' : 'translate-x-0'
                            }` }
                        >
                            <div className="h-full overflow-auto p-2 md:p-4">
                                <h2 className="px-4 pt-4 text-3xl font-bold mb-8 text-[#C48B9F]">Menu</h2>
                                <SearchSection closeMobileMenu={ () => setIsMenuOpen(false) } />
                                <ul
                                    className="space-y-4 px-4 pt-6 pb-4"
                                    style={ {
                                        background: 'linear-gradient(to bottom, rgba(248, 248, 248, 0.3) 0%, rgba(248, 248, 248, 1) 50%, rgba(248, 248, 248, 0.3) 100%)',
                                    } }
                                >
                                    { menuSections.map((section: SectionType, index: number) => (
                                        <li key={ index } className="border-b-2 border-[#C48B9F]">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between text-lg hover:bg-white/30 transition-colors duration-200"
                                                onClick={ () => {
                                                    if (section.subsections && section.subsections.length > 0) {
                                                        handleSectionClick(section);
                                                    } else {
                                                        startTransition(() => {
                                                            router.push('/section/' + createSlugName(section.sectionName));
                                                        });
                                                        setIsMenuOpen(false);
                                                    }
                                                } }
                                            >
                                                { section.sectionName.toUpperCase() }
                                                { section.subsections && section.subsections.length > 0 && (
                                                    <ChevronRight className="h-5 w-5 ml-auto" />
                                                ) }
                                            </Button>
                                        </li>
                                    )) }
                                    { /* Item para "COLEÇÕES" */ }
                                    <li className="border-b-2 border-[#C48B9F]">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between text-lg hover:bg-white/30 transition-colors duration-200"
                                            onClick={ handleCollectionsClick }
                                        >
                                            COLEÇÕES
                                            <ChevronRight className="h-5 w-5 ml-auto" />
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div
                            className={ `absolute inset-0 transition-transform duration-300 ease-in-out ${
                                activeSection ? 'translate-x-0' : 'translate-x-full'
                            }` }
                            style={ {
                                background: 'linear-gradient(to bottom, #f8f8f8 0%, rgba(248, 248, 248, 1) 50%, rgba(248, 248, 248, 0.7) 100%)',
                            } }
                        >
                            { activeSection && (
                                <>
                                    <div className="border-t-2 border-b-2 border-[#C48B9F] py-2 ">
                                        <Button
                                            variant="ghost"
                                            onClick={ handleBackToMain }
                                            className="hover:bg-white/30 text-lg text-[#C48B9F]"
                                        >
                                            <ChevronLeft className="mr-2 h-5 w-5" />
                                            Voltar
                                        </Button>
                                    </div>
                                    <div className="h-full overflow-auto p-6 ">
                                        { activeSection.sectionName === 'COLEÇÕES' ? (
                                            <>
                                                <h2 className="text-2xl font-bold mb-6 text-[#C48B9F]">
                                                    COLEÇÕES
                                                </h2>
                                                <ul className="space-y-2">
                                                    { collections.map((collection, index) => (
                                                        <li key={ `collection-${index}` } className="border-b-2 border-[#c48b9f]">
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start hover:bg-white/30 "
                                                                onClick={ () => {
                                                                    startTransition(() => {
                                                                        router.push('/colecoes/' + collection.slugName);
                                                                    });
                                                                    setIsMenuOpen(false);
                                                                } }
                                                            >
                                                                { collection.name.toUpperCase() }
                                                            </Button>
                                                        </li>
                                                    )) }
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl font-bold mb-6 text-[#C48B9F]">
                                                    { activeSection.sectionName.toUpperCase() }
                                                </h2>
                                                <ul className="space-y-2">
                                                    <li>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-center hover:bg-white/30 text-[#C48B9F]"
                                                            onClick={ () => {
                                                                handleBackToMain();
                                                                setIsMenuOpen(false);
                                                                startTransition(() => {
                                                                    router.push('/section/' + createSlugName(activeSection.sectionName));
                                                                });
                                                            } }
                                                        >
                                                            Mostrar todos
                                                        </Button>
                                                    </li>
                                                    { activeSection.subsections &&
                                                        activeSection.subsections.map((subsection: string, index: number) => (
                                                            <li key={ index } className="border-b-2 border-[#c48b9f]">
                                                                <Button
                                                                    variant="ghost"
                                                                    className="w-full justify-start hover:bg-white/30"
                                                                    onClick={ () => {
                                                                        handleBackToMain();
                                                                        setIsMenuOpen(false);
                                                                        startTransition(() => {
                                                                            router.push(
                                                                                '/section/' +
                                                                                createSlugName(activeSection.sectionName) +
                                                                                '/' +
                                                                                createSlugName(subsection),
                                                                            );
                                                                        });
                                                                    } }
                                                                >
                                                                    { subsection.toUpperCase() }
                                                                </Button>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </>
                                        ) }
                                    </div>
                                </>
                            ) }
                        </div>
                    </div>
                    { userInfo ? (
                        <NavFooterLogged userInfo={ userInfo } router={ router } closeMenu={ () => setIsMenuOpen(false) } />
                    ) : (
                        <NavFooterUnlogged router={ router } closeMenu={ () => setIsMenuOpen(false) } />
                    ) }
                </nav>
            </SheetContent>
        </Sheet>
    );
}
