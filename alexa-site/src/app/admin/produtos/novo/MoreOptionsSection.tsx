import { StateNewProductType, UseNewProductState } from '@/app/utils/types';

interface MoreOptionsSectionProps { state: StateNewProductType; handlers: UseNewProductState; }

export default function MoreOptionsSection({ state, handlers }: MoreOptionsSectionProps) {
    return(
        <section className='p-4 border rounded-md bg-white'>
            <h2 className='pb-4'>Mais Opções</h2>
            <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 flex flex-col gap-2" aria-labelledby="dropdownSearchButton">
                {
                    state.moreOptions.map((option, index) => {
                        return (
                            <li key={ index } >
                                <div className={ `${ option.isChecked ? 'bg-pink-300' : 'bg-pink-50' } flex items-center rounded px-2` }>
                                    <input
                                        id={ option.label + index }
                                        className="w-5 h-5"
                                        type="checkbox"
                                        checked={ option.isChecked }
                                        onChange={ (event) => {
                                            const newOptions = [...state.moreOptions];
                                            newOptions[index].isChecked = event.target.checked;
                                            handlers.handleSetMoreOptions(newOptions);
                                        } }
                                    />
                                    <label htmlFor={ option.label + index } className="w-full ms-2 text-sm font-medium text-gray-900 rounded h-full p-2 ">
                                        { option.label }
                                    </label>
                                </div>
                            </li>
                        );
                    })
                }

            </ul>
        </section>
    );
}