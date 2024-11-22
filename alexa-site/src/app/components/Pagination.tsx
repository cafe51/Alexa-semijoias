import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
}) => {
    // Função para gerar array de números de página a serem exibidos
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Se houver 5 ou menos páginas, mostra todas
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Sempre mostra a primeira página
        pages.push(1);

        // Calcula o intervalo de páginas a serem mostradas
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Ajusta para sempre mostrar 3 números no meio
        if (currentPage <= 2) {
            end = 4;
        }
        if (currentPage >= totalPages - 1) {
            start = totalPages - 3;
        }

        // Adiciona reticências antes dos números do meio se necessário
        if (start > 2) {
            pages.push('...');
        }

        // Adiciona os números do meio
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Adiciona reticências depois dos números do meio se necessário
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Sempre mostra a última página
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6 mb-10 w-full">
            { /* Botões de navegação para telas pequenas (mobile) */ }
            <div className="flex justify-between w-full max-w-xs sm:hidden">
                <button
                    onClick={ () => onPageChange(currentPage - 1) }
                    disabled={ currentPage === 1 }
                    className="px-4 py-2 rounded-lg border border-[#C48B9F] bg-white text-[#333333] hover:bg-[#F8C3D3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <button
                    onClick={ () => onPageChange(currentPage + 1) }
                    disabled={ currentPage === totalPages }
                    className="px-4 py-2 rounded-lg border border-[#C48B9F] bg-white text-[#333333] hover:bg-[#F8C3D3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próxima
                </button>
            </div>

            { /* Números das páginas */ }
            <div className="flex overflow-x-auto gap-2 px-2 w-full max-w-full scrollbar-thin scrollbar-thumb-[#C48B9F] scrollbar-track-[#FAF9F6]">
                { getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={ index }
                            onClick={ () => onPageChange(page) }
                            className={ `px-4 py-2 rounded-lg ${
                                currentPage === page
                                    ? 'bg-[#C48B9F] text-white'
                                    : 'border border-[#C48B9F] bg-white text-[#333333] hover:bg-[#F8C3D3] hover:text-white'
                            }` }
                        >
                            { page }
                        </button>
                    ) : (
                        <span key={ index } className="px-4 py-2 text-[#333333]">{ page }</span>
                    )
                )) }
            </div>

            { /* Botões de navegação para telas maiores */ }
            <div className="hidden sm:flex justify-center gap-4 w-full">
                <button
                    onClick={ () => onPageChange(currentPage - 1) }
                    disabled={ currentPage === 1 }
                    className="px-4 py-2 rounded-lg border border-[#C48B9F] bg-white text-[#333333] hover:bg-[#F8C3D3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <button
                    onClick={ () => onPageChange(currentPage + 1) }
                    disabled={ currentPage === totalPages }
                    className="px-4 py-2 rounded-lg border border-[#C48B9F] bg-white text-[#333333] hover:bg-[#F8C3D3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};