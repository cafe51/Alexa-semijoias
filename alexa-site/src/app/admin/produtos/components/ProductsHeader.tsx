// src/app/admin/produtos/componentes/ProductsHeader.tsx

import Link from 'next/link';

interface ProductsHeaderProps {
    totalProducts: number;
    setSearchTerm: (searchTerm: string) => void;
    searchTerm: string;
    showProductQuantitiesModal: () => void;
}

export default function ProductsHeader({ totalProducts, setSearchTerm, searchTerm, showProductQuantitiesModal }: ProductsHeaderProps) {
    return (
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg w-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <button
                    className='text-2xl font-bold text-[#333333] p-4 border-2 border-[#C48B9F] hover:border-[#D4AF37] transition rounded-xl'
                    onClick={ showProductQuantitiesModal }
                >
                    Produtos ({ totalProducts })
                </button>
                <Link
                    href="/admin/produtos/novo"
                    className="bg-[#C48B9F] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#D4AF37] transition"
                >
                    Adicionar Produto
                </Link>
            </div>
            <form onSubmit={ () => {} } className="flex flex-col md:flex-row gap-4 mt-4">
                <input
                    className="p-3 border border-[#C48B9F] rounded-lg flex-grow text-[#333333] placeholder-[#C48B9F] focus:outline-none"
                    type="text"
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    placeholder="Buscar produtos..."
                />
                <button
                    type="submit"
                    className="bg-[#F8C3D3] text-[#333333] font-medium py-3 px-6 rounded-lg hover:bg-[#C48B9F] hover:text-white transition"
                >
                    Buscar
                </button>
            </form>
        </div>
    );
}