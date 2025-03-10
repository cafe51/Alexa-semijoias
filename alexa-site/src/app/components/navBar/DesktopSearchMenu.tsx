// src/app/components/navBar/DesktopSearchMenu.tsx
'use client';
import { useState } from 'react';
import SearchBar from '../header/SearchBar';
import ProductCardsList from '../ProductList/ProductCardsList';
import Link from 'next/link';

export default function DesktopSearchMenu() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <section className='h-full w-full'>
            <SearchBar searchTerm={ searchTerm } setSearchTerm={ (searchTerm) => setSearchTerm(searchTerm) }/>
            { searchTerm &&
            <div className='p-8 h-full w-full flex flex-col items-start gap-4'>
                <h1>Produtos:</h1>
                <ProductCardsList
                    orderBy={ 'creationDate' }
                    direction={ 'asc' }
                    searchTerm={ searchTerm }
                    itemsPerPage={ 4 }
                    isMobileLayout
                />
                <Link
                    className='hover:border-t-0 hover:border-x-0 hover:border-b-2 hover:border-[#F8C3D3] text-center text-3xl self-center mt-4'
                    href={ `/search/${searchTerm}` }>
                    Mostrar todos os resultados
                </Link>
            </div> }
        </section>
    );
}