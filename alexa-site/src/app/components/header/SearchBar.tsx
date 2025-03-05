'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search/${searchTerm}`);
        }
    };

    return (
        <div className="flex-grow max-w-4xl w-full pb-1 pt-0 md:mx-4">
            <div className="relative">
                <Input
                    className="pl-4 pr-14 py-0 md:py-6 w-full bg-[#F8C3D3]/50 border-none text-s md:text-lg md:rounded-xl focus:bg-white"
                    type="text"
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    value={ searchTerm }
                    placeholder="Buscar..."
                    onKeyDown={ (e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    } }
                />
                <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5 md:h-7 md:w-7 cursor-pointer"
                    onClick={ handleSearch }
                />
            </div>
        </div>
    );
}