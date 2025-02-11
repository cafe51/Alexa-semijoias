// app/admin/coupons/UserSelectorModal.tsx
import React, { useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useCollection } from '@/app/hooks/useCollection';
import { UserType, FireBaseDocument } from '@/app/utils/types';

interface UserSelectorModalProps {
  initialSelected: (UserType & FireBaseDocument)[];
  onClose: () => void;
  onConfirm: (selected: (UserType & FireBaseDocument)[]) => void;
}

const UserSelectorModal: React.FC<UserSelectorModalProps> = ({ initialSelected, onClose, onConfirm }) => {
    const { getAllDocuments } = useCollection<UserType>('usuarios');
    const [users, setUsers] = useState<(UserType & FireBaseDocument)[]>([]);
    const [selected, setSelected] = useState<(UserType & FireBaseDocument)[]>(initialSelected);

    useEffect(() => {
        const fetchUsers = async() => {
            const docs = await getAllDocuments();
            setUsers(docs);
        };
        fetchUsers();
    }, [getAllDocuments]);

    const toggleSelect = (user: UserType & FireBaseDocument) => {
        if (selected.find(item => item.id === user.id)) {
            setSelected(selected.filter(item => item.id !== user.id));
        } else {
            setSelected([...selected, user]);
        }
    };

    return (
        <ModalWrapper onClose={ onClose }>
            <h2 className="text-xl font-bold mb-4">Selecionar Usuários</h2>
            <div className="max-h-80 overflow-y-auto mb-4">
                { users.map(user => (
                    <div
                        key={ user.id }
                        className={ `p-2 border rounded mb-2 cursor-pointer ${
                            selected.find(item => item.id === user.id) ? 'bg-blue-100' : ''
                        }` }
                        onClick={ () => toggleSelect(user) }
                    >
                        <p>{ user.nome }</p>
                        <p className="text-sm text-gray-600">{ user.email }</p>
                    </div>
                )) }
            </div>
            <div className="flex justify-end space-x-4">
                <button onClick={ onClose } className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          Cancelar
                </button>
                <button onClick={ () => onConfirm(selected) } className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Confirmar
                </button>
            </div>
        </ModalWrapper>
    );
};

export default UserSelectorModal;
