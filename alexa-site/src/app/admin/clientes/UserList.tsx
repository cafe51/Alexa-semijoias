// UserList.tsx
import { FireBaseDocument, UserType } from '@/app/utils/types';
import UserCard from './UserCard';

interface UserListProps {
    users?: (UserType & FireBaseDocument)[];
    onEmailClick: (email: string) => void;
    onWhatsAppClick: (whatsapp: string) => void;
}

export default function UserList({ users, onEmailClick, onWhatsAppClick }: UserListProps) {
    return (
        <div className='flex flex-col gap-2 text-sm'>
            { users?.map(user => (
                <UserCard
                    key={ user.id }
                    user={ user }
                    onEmailClick={ () => onEmailClick(user.email) }
                    onWhatsAppClick={ () => user.phone && onWhatsAppClick(user.phone) }
                />
            )) }
        </div>
    );
}
