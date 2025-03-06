// src/app/admin/carrinhos/useUser.ts
import { UserType } from '@/app/utils/types';
import { useDocument } from './useDocument';

export function useUser(userId: string) {
    const { document, loading, error } = useDocument<UserType>('usuarios', userId);
    return { user: document, loading, error };
}
