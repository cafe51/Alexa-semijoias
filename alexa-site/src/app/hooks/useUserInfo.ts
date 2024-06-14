// app/hooks/useUserInfo.ts

import { UserInfoContext } from '../context/UserInfoContext';
import { useContext } from 'react';

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);

    return context;
};