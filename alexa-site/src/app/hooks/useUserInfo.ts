// app/hooks/useUserInfo.ts

import { UserInfoContext } from '../context/UserInfoContext';
import { useContext } from 'react';

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);

    if (!context) {
        throw Error('useUserInfo must be inside an UserInfoProvider');
    }

    return context;
};