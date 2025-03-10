'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ searchTerm, setSearchTerm } : { searchTerm: string, setSearchTerm: (searchTerm: string) => void }) {
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search/${searchTerm}`);
        }
    };

    return (
        <div className="md:px-8 pt-0 md:pt-8 pb-2 md:pb-1">
            <div className="relative">
                <Input
                    className="py-4 md:py-8 border-t-0 border-x-0 border-b-2 border-[#F8C3D3] text-lg md:text-4xl rounded-none focus:none focus-visible:ring-transparent "
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