// AdminPage.tsx
'use client';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import UserList from './UserList';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, UserType } from '@/app/utils/types';


export default function DashBoardUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<(UserType & FireBaseDocument)[] | undefined | null>(null);
    const { getAllDocuments } = useCollection<UserType>('usuarios');

    useEffect(() => {
        async function getClients() {
            const clientes = await getAllDocuments(
                undefined,
                undefined,
                { field: 'createdAt', direction: 'desc' },
            );
            setUsers(clientes);
        }
        getClients();
    }, []);

    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleWhatsAppClick = (whatsapp: string) => {
        window.location.href = `https://wa.me/${whatsapp}`;
    };

    const filteredUsers = users?.filter(user => 
        user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="p-0 ">
            <h1 className="text-2xl font-bold mb-4">Clientes</h1>
            <SearchBar searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } />
            <UserList users={ filteredUsers } onEmailClick={ handleEmailClick } onWhatsAppClick={ handleWhatsAppClick } />
        </div>
    );
}