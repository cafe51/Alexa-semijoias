// Header.test.tsx
import { act, render, screen } from '@testing-library/react';
import Header from '../header/Header';

import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para o usePathname do next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

describe('Header Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renderiza o FullHeader na rota inicial', async() => {
        (usePathname as jest.Mock).mockReturnValue('/');

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByTestId('full-header')).toBeInTheDocument();
    });

    it('Renderiza o SimpleHeader nas rotas de login', async() => {
        (usePathname as jest.Mock).mockReturnValue('/login');

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByTestId('simple-header')).toBeInTheDocument();
    });

    it('Renderiza o SimpleHeader nas rotas de login', async() => {
        (usePathname as jest.Mock).mockReturnValue('/cadastro');

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByTestId('simple-header')).toBeInTheDocument();
    });

    it('Renderiza o FullHeader em outras rotas', async() => {
        // Testa uma rota diferente de /login e /cadastro
        (usePathname as jest.Mock).mockReturnValue('/outra-rota');
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Header />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByTestId('full-header')).toBeInTheDocument();
    });
});