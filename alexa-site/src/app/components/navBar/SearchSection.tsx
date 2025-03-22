// src/app/components/navBar/DesktopSearchMenu.tsx
'use client';
import { useState } from 'react';
import SearchBar from '../header/SearchBar';
import ProductCardsList from '../ProductList/ProductCardsList';
import Link from 'next/link';

interface SearchSectionProps {
    closeMobileMenu?: () => void;
}

export default function SearchSection({ closeMobileMenu }: SearchSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <section
            className=''
            style={ {
                background: 'linear-gradient(to bottom, rgba(248, 248, 248, 1) 0%, rgba(248, 248, 248, 1) 50%, rgba(248, 248, 248, 0.3) 100%)',
            } }
        >
            <SearchBar searchTerm={ searchTerm } setSearchTerm={ (searchTerm) => setSearchTerm(searchTerm) }/>
            { searchTerm &&
            <div className='md:p-8 h-full w-full flex flex-col items-start gap-4'>
                <h1 className='text-xl md:text-3xl'>Produtos:</h1>
                <ProductCardsList
                    orderBy={ 'creationDate' }
                    direction={ 'asc' }
                    searchTerm={ searchTerm }
                    closeMobileMenu={ closeMobileMenu }
                    itemsPerPage={ 4 }
                    isMobileLayout
                    isHomePage
                />
                <Link
                    className='border-t-0 border-x-0 border-b-2 border-[#F8C3D3] text-center md:text-3xl self-center mt-4'
                    href={ `/search/${searchTerm}` }>
                    Mostrar todos os resultados
                </Link>
            </div> }
        </section>
    );
}