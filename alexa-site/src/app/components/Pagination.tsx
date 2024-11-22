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
        <div className="flex justify-center items-center gap-2 mt-4 mb-8">
            <button
                onClick={ () => onPageChange(currentPage - 1) }
                disabled={ currentPage === 1 }
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                Anterior
            </button>

            <div className="flex gap-2">
                { getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={ index }
                            onClick={ () => onPageChange(page) }
                            className={ `px-3 py-1 rounded ${
                                currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                            }` }
                        >
                            { page }
                        </button>
                    ) : (
                        <span key={ index } className="px-2">
                            { page }
                        </span>
                    )
                )) }
            </div>

            <button
                onClick={ () => onPageChange(currentPage + 1) }
                disabled={ currentPage === totalPages }
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                Próxima
            </button>
        </div>
    );
};
