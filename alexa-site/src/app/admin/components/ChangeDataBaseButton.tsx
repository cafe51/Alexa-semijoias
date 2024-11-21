import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ChangeDataBaseButton() {
    const [ showModalConfirmation, setShowModalConfirmation ] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    // console.log('webhook address: ', process.env.NEXT_PUBLIC_URL_FOR_WEBHOOK);

    const handleUpdateProducts = async() => {
        setIsUpdating(true);
        setUpdateMessage('Atualizando produtos...');

        try {
            const response = await fetch('/api/update-products', { method: 'POST' });
            if (response.ok) {
                setUpdateMessage('Produtos atualizados com sucesso!');
            } else {
                setUpdateMessage('Erro ao atualizar produtos. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao atualizar produtos:', error);
            setUpdateMessage('Erro ao atualizar produtos. Por favor, tente novamente.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mt-6">
            {
                showModalConfirmation
                && <ModalMaker
                    title="Atualizar Produtos"
                    closeModelClick={ () => setShowModalConfirmation(false) }
                >
                    <div className='flex flex-col gap-8'>
                        <p className="text-sm">
                                Você tem certeza que deseja atualizar os produtos?
                        </p>
                        <div className="flex justify-between gap-2">
                            <Button onClick={ handleUpdateProducts }>
                                Sim
                            </Button>
                            <Button color='green' onClick={ () => setShowModalConfirmation(false) }>
                                Voltar
                            </Button>
                        </div>
                    </div>
                </ModalMaker>
            }
            <button
                onClick={ () => setShowModalConfirmation(true) }
                disabled={ isUpdating }
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                { isUpdating ? 'Atualizando...' : 'Atualizar Produtos' }
            </button>
            { updateMessage && (
                <p className={ `mt-2 ${updateMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}` }>
                    { updateMessage }
                </p>
            ) }
        </div>
    );
}