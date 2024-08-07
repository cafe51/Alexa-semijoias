// app/admin/dashboard/[adminId]/produtos/novo/NameAndDescriptionSection.tsx
import { FullProductType } from '@/app/utils/types';

interface NameAndDescriptionSectionProps {
    state: FullProductType;
    handleNameChange: (name: string) => void;
    handleDescriptionChange: (description: string) => void; 
}

export default function NameAndDescriptionSection({ state: { name, description }, handleNameChange, handleDescriptionChange }: NameAndDescriptionSectionProps) {

    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Nome e descrição</h2>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='name'>Nome</label>
                <input
                    id='name'
                    name='name'
                    type="text"
                    value={ name }
                    onChange={ (e) => handleNameChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Nome do produto"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='description'>Descrição</label>
                <textarea
                    id='description'
                    name='description'
                    value={ description }
                    onChange={ (e) => handleDescriptionChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md min-h-44"
                    placeholder="Descrição do produto"
                />
            </div>
        </section>
    );
}