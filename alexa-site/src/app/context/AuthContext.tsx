// app/context/AuthContext.tsx
'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from '../hooks/useCollection';
import { CartInfoType, UserType } from '../utils/types';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
// import { useCollection2 } from '../hooks/useCollection2';

interface AuthState {
    user: (User & { carrinho: (CartInfoType & DocumentData)[] | null }) | null;
    authIsReady: boolean;
}

interface AuthAction {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_IS_READY';
    payload: (User & { carrinho: (CartInfoType & DocumentData)[] | null }) | null;
}

export const AuthContext = createContext<AuthState & { dispatch: React.Dispatch<AuthAction> }| undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    
    switch (action.type) {
    case 'LOGIN':
        return { ...state, user: action.payload };
    case 'LOGOUT':
        return { ...state, user: null };
    case 'AUTH_IS_READY':
        return { user: action.payload, authIsReady: true };
    default:
        return state;
    }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    // const [cartInfoState, setCarInfoState] = useState<CartInfoType[] | null>(null);
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        authIsReady: false,
    });

    // const produtoFilterOptions = useMemo(() => {
    //     return [{ field: 'userId', operator: '==', value: state.user ? state.user.uid : '' }];
    // }, [state.user]);

    // const produtoFilterOptions = useMemo(() => {
    //     return state.user ? state.user.uid : '';
    // }, [state.user]);

    // const { documents: carrinho } = useCollection2<CartInfoType>(
    //     'carrinhos',
    //     [{ field: 'userId', operator: '==', value: state.user ? state.user.uid : '' }],
    // );

    // const memoCart = useMemo(() => {
    //     if (state.user && carrinho) {
    //         return carrinho;
    //     }
    //     return null;
    // }, [state.user, carrinho]);



    // const { getAllDocuments: getAllCarts } = useCollection<CartInfoType>(
    //     'carrinhos',
    //     // state.user ? [{ field: 'userId', operator: '==', value: state.user.uid }] : null,
    //     null,
    // );


    const { documents: usuarios } = useCollection<UserType>(
        'usuarios',
        state.user ? [{ field: 'userId', operator: '==', value: state.user.uid }] : null,
    );

    // const { documents: carrinho } = useCollection2<CartInfoType>(
    //     'carrinhos',
    //     state.user,
    // );

    // useEffect(() => {
    //     const fetchCartInfos = async() => {
    //         const cartInfos = await getAllCarts([{ field: 'userId', operator: '==', value: state.user ? state.user.uid : '' }]);
    //         setCarInfoState(cartInfos);
    //     };

    //     fetchCartInfos();
    // }, [dispatch]);
    

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            const userInfo = usuarios ? usuarios[0] : null;
            console.log('userInfo', usuarios ? usuarios : null);
            dispatch({ type: 'AUTH_IS_READY', payload: user ? { ...user, carrinho: null, ...userInfo } : null });
            unsub();
        });
    }, []);

    return (
        <AuthContext.Provider value={ { ...state, dispatch } }>
            { children }
        </AuthContext.Provider>
    );
};
