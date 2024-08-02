/* eslint-disable react/display-name */
// FullHeader.test.tsx
import { act, render, screen } from '@testing-library/react';
import FullHeader from '../header/FullHeader';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para o Link do Next.js
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => (
        <a href={ href }>{ children }</a>
    );
});

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('FullHeader Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renderiza os elementos do cabeçalho', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <FullHeader />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('Alexa')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('O que você está procurando?')).toBeInTheDocument();
        expect(screen.getByTestId('useIcon')).toBeInTheDocument();
        expect(screen.getByTestId('cartIcon')).toBeInTheDocument();

        const navElement = screen.getByRole('navigation');
        expect(navElement).toBeInTheDocument();
    });
});