import React, { useState } from 'react';
import Link from 'next/link';

interface ProductsHeaderProps {
    totalProducts: number;
    onSearch: (query: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ totalProducts, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Produtos ({ totalProducts })</h1>
                <Link href="/admin/produtos/novo" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Adicionar Produto
                </Link>
            </div>
            <form onSubmit={ handleSearch } className="flex gap-2">
                <input
                    type="text"
                    value={ searchQuery }
                    onChange={ (e) => setSearchQuery(e.target.value) }
                    placeholder="Buscar produtos..."
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Buscar
                </button>
            </form>
        </div>
    );
};

export default ProductsHeader;