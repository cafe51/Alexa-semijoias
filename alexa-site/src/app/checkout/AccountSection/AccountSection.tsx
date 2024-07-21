// app/checkout/AccountSection/AccountSection.tsx
import AccountSectionFilled from './AccountSectionFilled';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { UseCheckoutStateType } from '@/app/utils/types';

interface AccountSectionProps {
    state: UseCheckoutStateType
    handleShowRegisterSection: (isLogin: boolean) => void;
  }

export default function AccountSection({ state, handleShowRegisterSection }: AccountSectionProps) {
    const { userInfo } = useUserInfo();

    if (userInfo) return <AccountSectionFilled cpf={ userInfo.cpf } email={ userInfo.email } telefone={ userInfo.tel } />;

    if (state.showRegisterSection && !userInfo) return <RegisterSection setShowRegister={ handleShowRegisterSection }/>;

    if(!state.showRegisterSection && !userInfo) return <LoginSection setShowRegister={ handleShowRegisterSection } />;
}