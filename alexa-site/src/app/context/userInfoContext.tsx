// app/context/AuthContext.tsx
'use client';

import { createContext, useEffect, ReactNode, useContext } from 'react';


export const UserInfoContext = createContext<any>(undefined);


export const UserInfoContextProvider = ({ children }: { children: ReactNode }) => {

    useEffect(() => {
        
    }, []);

    return (
        <UserInfoContext.Provider value={ { user } }>
            { children }
        </UserInfoContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserInfoContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};