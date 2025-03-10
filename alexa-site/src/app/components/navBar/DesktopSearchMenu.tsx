// src/app/components/navBar/DesktopSearchMenu.tsx
'use client';
import { useState } from 'react';
import SearchBar from '../header/SearchBar';
import ProductCardsList from '../ProductList/ProductCardsList';

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
            </div> }
        </section>
    );
}