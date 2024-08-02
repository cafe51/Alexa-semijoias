// Navbar.test.tsx

import { act, render, screen } from '@testing-library/react';
import Navbar from '../navBar/Navbar';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

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


describe('Navbar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuthContext as jest.Mock).mockReturnValue({ user: null, authIsReady: false });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: null, carrinho: [] });

    });

    it('Renderiza os links de navegação', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Navbar isMenuOpen={ false } setIsMenuOpen={ jest.fn() } /> 
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('Início')).toBeInTheDocument();
        expect(screen.getByText('Brincos')).toBeInTheDocument();
        expect(screen.getByText('Pulseiras')).toBeInTheDocument();
        expect(screen.getByText('Colares')).toBeInTheDocument();
        expect(screen.getByText('Anéis')).toBeInTheDocument();
        expect(screen.getByText('Fale Comigo')).toBeInTheDocument();
    });

});

// falta testar a navegação