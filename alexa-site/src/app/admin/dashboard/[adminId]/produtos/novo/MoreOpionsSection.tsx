import { CheckboxData } from '@/app/utils/types';
import { useState } from 'react';

const initialOptions = [ { isChecked: false, label: 'Exibir na minha loja' }, { isChecked: false, label: 'Esse produto possui frete grátis' } ];

export default function MoreOptionsSection() {
    const [options, setOptions] = useState<CheckboxData[]>(initialOptions);

    return(
        <section className='p-4 border rounded-md bg-white'>
            <h2 className='pb-4'>Mais Opções</h2>
            <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 flex flex-col gap-2" aria-labelledby="dropdownSearchButton">
                {
                    options.map((option, index) => {
                        return (
                            <li key={ index } >
                                <div className={ `${ option.isChecked ? 'bg-pink-300' : 'bg-pink-50' } flex items-center rounded px-2` }>
                                    <input
                                        id={ option.label + index }
                                        className="w-5 h-5"
                                        type="checkbox"
                                        checked={ option.isChecked }
                                        onChange={ (event) => {
                                            const newOptions = [...options];
                                            newOptions[index].isChecked = event.target.checked;
                                            setOptions(newOptions);
                                        } }
                                    />
                                    <label htmlFor={ option.label + index } className="w-full ms-2 text-sm font-medium text-gray-900 rounded h-full p-2 ">{ option.label }</label>
                                </div>
                            </li>
                        );
                    })
                }

            </ul>
        </section>
    );
}