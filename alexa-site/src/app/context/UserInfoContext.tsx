// app/context/UserInfoContext
'use client';

import { ReactNode, createContext, useMemo } from 'react';
// import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';
import { CartInfoType } from '../utils/types';
import { useCollection2 } from '../hooks/useCollection2';

export const UserInfoContext = createContext<any>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
    // const [ userInfoState, setUserInfoState ] = useState<any>(null);

    const { user } = useAuthContext();

    const userQuery = useMemo(() => 
        [{ field: 'userId', operator: '==', value: user ? user.uid : 'invalidId' }],
    [user], // Só recriar a query quando 'user' mudar
    );
    
    const { documents: carrinho } = useCollection2<CartInfoType>(
        'carrinhos',
        userQuery, 
    );


    // const { documents: carrinho } = useCollection2<CartInfoType>(
    //     'carrinhos',
    //     null,
    //     // [{ field: 'userId', operator: '==', value: user ? user.uid : 'invalidId' }],
    // );

    return (
        <UserInfoContext.Provider value={ { carrinho: carrinho }  }>
            { children }
        </UserInfoContext.Provider>
    );

    // const { getAllDocuments: getCarts } = useCollection<CartInfoType>(
    //     'carrinhos',
    //     null,
    // );

    // useEffect(() => {
    //     const fetchDocuments = async() => {
    //         const cartItems = await getCarts([{ field: 'userId', operator: '==', value: user ? user.uid : 'invalidId' }]);
    //         setUserInfoState(cartItems);
    //     };
    //     if (user) {
    //         fetchDocuments();
    //     }

    // }, [user]);

    // return (
    //     <UserInfoContext.Provider value={ { carrinho: userInfoState }  }>
    //         { children }
    //     </UserInfoContext.Provider>
    // );
}