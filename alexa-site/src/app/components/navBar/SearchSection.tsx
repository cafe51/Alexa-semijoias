// src/app/components/navBar/DesktopSearchMenu.tsx
'use client';
import { useState } from 'react';
import SearchBar from '../header/SearchBar';
import ProductCardsList from '../ProductList/ProductCardsList';
import Link from 'next/link';

export default function SearchSection() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <section className=''>
            <SearchBar searchTerm={ searchTerm } setSearchTerm={ (searchTerm) => setSearchTerm(searchTerm) }/>
            { searchTerm &&
            <div className='md:p-8 h-full w-full flex flex-col items-start gap-4'>
                <h1 className='text-xl md:text-3xl'>Produtos:</h1>
                <ProductCardsList
                    orderBy={ 'creationDate' }
                    direction={ 'asc' }
                    searchTerm={ searchTerm }
                    itemsPerPage={ 4 }
                    isMobileLayout
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