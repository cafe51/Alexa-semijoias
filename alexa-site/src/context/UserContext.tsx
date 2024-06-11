// 'use client';
// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { UserType } from '../app/utils/types';


// interface UserContextType {
//   user: UserType | null;
//   setUser: (user: UserType | null) => void;
//   logout: () => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<UserType | null>(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, []);

//     useEffect(() => {
//         if (user) {
//             localStorage.setItem('user', JSON.stringify(user));
//         } else {
//             localStorage.removeItem('user');
//         }
//     }, [user]);

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//         localStorage.removeItem('carrinho');
//     };

//     return (
//         <UserContext.Provider value={ { user, setUser, logout } }>
//             { children }
//         </UserContext.Provider>
//     );
// };

// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (context === undefined) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };
