import { CheckboxData, UseNewProductState } from '@/app/utils/types';
import { useEffect, useState } from 'react';

interface CategoriesListFromFbProps {
    handlers: UseNewProductState;
    options: CheckboxData[];
    handleCheckboxChange(label: string): void;
    selectedOptions: string[];
}

export default function CategoriesListFromFb({ options, selectedOptions, handleCheckboxChange, handlers }: CategoriesListFromFbProps) {
    const [filteredOptions, setFilteredOptions] = useState<CheckboxData[] | never[]>([]);
    const [newSearch, setNewSearch] = useState('');

    useEffect(() => console.log('newSearch', newSearch), [newSearch]);
    useEffect(() => console.log('filteredOptions', filteredOptions), [filteredOptions]);


    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    useEffect(() => {
        const optionsClone = [...options];
        setFilteredOptions(optionsClone.filter((op) => op.label.includes(newSearch)));
    }, [newSearch]);

    return (
        <section id="dropdownSearch" className="z-10 bg-white rounded-lg shadow w-full ">
            <div className="p-3">
                <label htmlFor="input-group-search" className="sr-only">Pesquisar</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        id="input-group-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                        type="text"
                        placeholder="Procurar Categoria"
                        value={ newSearch }
                        onChange={ (e) => setNewSearch(e.target.value) }

                    />
                </div>
            </div>
            <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 flex flex-col gap-2" aria-labelledby="dropdownSearchButton">
                {
                    filteredOptions.map(({ isChecked, label }, index) => {
                        const bgColor = index % 2 == 0 ? 'bg-pink-50' : 'bg-pink-100';
                        return (
                            <li key={ index } >
                                <div className={ `${ isChecked ? 'bg-pink-300' : bgColor } flex items-center rounded px-2 hover:bg-pink-200` }>
                                    <input
                                        id={ label + index }
                                        className="w-4 h-4"
                                        type="checkbox"
                                        checked={ isChecked }
                                        onChange={ () => {
                                            handleCheckboxChange(label);
                                        } }
                                    />
                                    <label htmlFor={ label + index } className="w-full ms-2 text-sm font-medium text-gray-900 rounded h-full p-2 ">{ label }</label>
                                </div>
                            </li>
                        );
                    })
                }
                { !filteredOptions.some((op) => op.label === newSearch) &&
                (newSearch.length > 0) &&
                !selectedOptions.includes(newSearch) &&
                <li>
                    {
                        <div
                            className={ 'bg-green-200 text-green-600 rounded p-2 hover:bg-pink-200 w-full full ms-2 text-sm font-medium' }
                            onClick={ () => {
                                handlers.handleAddCategories(newSearch);
                                setNewSearch('');
                            } }
                        >
                            Criar { newSearch }
                        </div>
                    }
                </li>
                }

            </ul>

        </section>
    );
}