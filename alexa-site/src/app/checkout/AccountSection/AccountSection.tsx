// app/checkout/AccountSection/AccountSection.tsx
import { Dispatch, SetStateAction } from 'react';
import AccountSectionFilled from './AccountSectionFilled';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { UseCheckoutStateType } from '@/app/utils/types';

interface AccountSectionProps {
    state: UseCheckoutStateType
    handleShowLoginSection: (isLogin: boolean) => void;
    setIsCartLoading: Dispatch<SetStateAction<boolean>>;

  }

export default function AccountSection({ state, handleShowLoginSection, setIsCartLoading }: AccountSectionProps) {
    const { userInfo } = useUserInfo();

    if (userInfo) return <AccountSectionFilled nome={ userInfo.nome } cpf={ userInfo.cpf } email={ userInfo.email } telefone={ userInfo.tel }  />;
    
    if(state.showLoginSection && !userInfo) return <LoginSection setShowLogin={ handleShowLoginSection } setIsCartLoading={ setIsCartLoading }/>;
    
    if (!state.showLoginSection && !userInfo) return <RegisterSection setShowLogin={ handleShowLoginSection }/>;

}