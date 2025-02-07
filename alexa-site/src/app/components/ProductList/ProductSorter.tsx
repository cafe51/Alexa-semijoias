// src/app/components/ProductList/ProductSorter.tsx
'use client';

import React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';

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
        <div className="relative inline-block mb-4">
            <select
                value={ currentSort }
                onChange={ (e) => {
                    const selectedValue = e.target.value;
                    const option = sortOptions.find((opt) => opt.value === selectedValue);
                    if (option) {
                        onSortChange(option);
                    }
                } }
                className="
          block 
          w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] 
          h-11 sm:h-12 md:h-14 lg:h-16
          pl-3 pr-10 py-2 
          text-base md:text-lg lg:text-xl 
          font-medium 
          bg-[#FAF9F6] 
          text-[#333333] 
          border border-[#C48B9F] 
          rounded-md 
          shadow-sm 
          appearance-none 
          transition-colors 
          hover:bg-[#C48B9F] 
          hover:text-white
        "
            >
                { sortOptions.map((option) => (
                    <option key={ option.value } value={ option.value }>
                        { option.label }
                    </option>
                )) }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <CaretSortIcon className="h-6 w-6 "  />
            </div>
        </div>
    );
}
