// app/admin/dashboard/[adminId]/produtos/novo/NameAndDescriptionSection.tsx
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';

interface NameAndDescriptionSectionProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
}

export default function NameAndDescriptionSection({ state, handlers }: NameAndDescriptionSectionProps) {
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Nome e descrição</h2>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='name'>Nome</label>
                <input
                    id='name'
                    name='name'
                    type="text"
                    value={ state.name }
                    onChange={ (e) => handlers.handleNameChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Nome do produto"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='description'>Descrição</label>
                <textarea
                    id='description'
                    name='description'
                    value={ state.description }
                    onChange={ (e) => handlers.handleDescriptionChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md min-h-44"
                    placeholder="Descrição do produto"
                />
            </div>
        </section>
    );
}