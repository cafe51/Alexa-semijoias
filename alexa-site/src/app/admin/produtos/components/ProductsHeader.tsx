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
        </div>
    );
};

export default ProductsHeader;