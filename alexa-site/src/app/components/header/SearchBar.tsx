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
        <div className="relative flex-grow max-w-4xl mx-4">
            <Input
                className="pl-14 pr-4 py-6 w-full bg-[#F8C3D3]/50 border-none text-lg rounded-xl"
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-7 w-7 cursor-pointer"
                onClick={ handleSearch }
            />
        </div>
    );
}