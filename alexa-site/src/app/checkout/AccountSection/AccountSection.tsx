// app/checkout/AccountSection/AccountSection.tsx
import AccountSectionFilled from './AccountSectionFilled';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { UseCheckoutStateType } from '@/app/utils/types';

interface AccountSectionProps {
    state: UseCheckoutStateType
    handleShowLoginSection: (isLogin: boolean) => void;
  }

export default function AccountSection({ state, handleShowLoginSection }: AccountSectionProps) {
    const { userInfo } = useUserInfo();

    if (userInfo) return <AccountSectionFilled cpf={ userInfo.cpf } email={ userInfo.email } telefone={ userInfo.tel } />;
    
    if(state.showLoginSection && !userInfo) return <LoginSection setShowLogin={ handleShowLoginSection } />;
    
    if (!state.showLoginSection && !userInfo) return <RegisterSection setShowLogin={ handleShowLoginSection }/>;

}