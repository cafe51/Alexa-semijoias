// SearchBar.tsx
import { IoSearchSharp } from 'react-icons/io5';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps){
    return (
        <div className="flex items-center p-0">
            <input
                type="text"
                value={ searchQuery }
                onChange={ (e) => setSearchQuery(e.target.value) }
                placeholder="Buscar por nome, e-mail ou CPF"
                className="border p-2 rounded-lg flex-grow"
            />
            <button className="border p-2 rounded-lg bg-white">
                < IoSearchSharp size={ 24 }/>
            </button>
        </div>
    );
}