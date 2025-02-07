// src/app/components/ProductList/ProductSorter.tsx
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SortOption = {
    value: string;
    label: string;
    orderBy: string;
    direction: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Novidades', orderBy: 'creationDate', direction: 'desc' },
    { value: 'oldest', label: 'Mais antigos', orderBy: 'creationDate', direction: 'asc' },
    
    { value: 'price-high', label: 'Maiores preços', orderBy: 'finalPrice', direction: 'desc' },
    { value: 'price-low', label: 'Menores preços', orderBy: 'finalPrice', direction: 'asc' },

    { value: 'stock-asc', label: 'Estoque - Altos', orderBy: 'estoqueTotal', direction: 'desc' },
    { value: 'stock-desc', label: 'Estoque - Baixos', orderBy: 'estoqueTotal', direction: 'asc' },

    { value: 'name-asc', label: 'A - Z', orderBy: 'name', direction: 'asc' },
    { value: 'name-desc', label: 'Z - A', orderBy: 'name', direction: 'desc' },



];

type ProductSorterProps = {
    onSortChange: (option: SortOption) => void;
    currentSort: string;
};

export default function ProductSorter({ onSortChange, currentSort }: ProductSorterProps) {
    return (
        <div className="flex justify-end mb-4">
            <Select
                value={ currentSort }
                onValueChange={ (value) => {
                    const option = sortOptions.find(opt => opt.value === value);
                    if (option) {
                        onSortChange(option);
                    }
                } }
            >
                <SelectTrigger className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-[#FAF9F6] text-[#333333] border border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white transition-all">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="text-sm sm:text-base md:text-lg lg:text-xl bg-[#FAF9F6] border border-[#C48B9F]">
                    { sortOptions.map((option) => (
                        <SelectItem 
                            key={ option.value } 
                            value={ option.value }
                            className="py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl text-[#333333] hover:bg-[#F8C3D3] hover:text-white"
                        >
                            { option.label }
                        </SelectItem>
                    )) }
                </SelectContent>
            </Select>
        </div>
    );
}
