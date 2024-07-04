// NavBarUserSection.test.tsx

import { act, render, screen } from '@testing-library/react';
import NavBarUserSection from '../NavBarUserSection';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { AuthContextProvider } from '@/app/context/AuthContext';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserInfo } from '../../hooks/useUserInfo';

describe('NavBarUserSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Exibe opções de login/cadastro para usuários não logados', async() => {
        // Simula um usuário não logado
        (useAuthContext as jest.Mock).mockReturnValue({ user: null, authIsReady: false });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: null, carrinho: [] });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <NavBarUserSection />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
        expect(screen.getByText('Iniciar Sessão')).toBeInTheDocument();
    });

    it('Exibe saudação e opções de conta para usuários logados', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'user123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123',  nome: 'Fulana Teste' }, carrinho: [] });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <NavBarUserSection />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Olá, Fulana!')).toBeInTheDocument();
        expect(screen.getByText('Minha Conta')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();
    });
});