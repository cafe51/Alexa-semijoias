// app/hooks/useAuthContext.ts
import { useContext } from 'react';
import { AuthContext, AuthState } from '../context/AuthContext';

export const useAuthContext = (): AuthState & { dispatch: React.Dispatch<any> } => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuthContext must be inside an AuthContextProvider');
    }

    return context;
};