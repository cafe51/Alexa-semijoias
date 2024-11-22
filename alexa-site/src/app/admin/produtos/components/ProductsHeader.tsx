import React from 'react';
import Link from 'next/link';

interface ProductsHeaderProps {
    totalProducts: number;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ totalProducts }) => {


    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg w-full">
            <div className="flex gap-2 justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Produtos ({ totalProducts })</h1>
                <Link href="/admin/produtos/novo" className="bg-blue-500 hover:bg-blue-600 text-white text-center font-bold p-2 rounded">
                    Adicionar Produto
                </Link>
            </div>
            <form onSubmit={ () => { } } className="flex flex-col md:flex-row gap-2 w-full">
                <input
                    className="p-2 border border-gray-300 rounded w-full md:w-auto"
                    type="text"
                    value={ '' }
                    onChange={ () => {} }
                    placeholder="Buscar produtos..."
                />
                <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full md:w-auto">
                    Buscar
                </button>
            </form>
        </div>
    );
};

export default ProductsHeader;