/* eslint-disable react/display-name */
// SimpleHeader.test.tsx
import { act, render, screen } from '@testing-library/react';
import SimpleHeader from '../SimpleHeader';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para o Link do Next.js
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => (
        <a href={ href }>{ children }</a>
    );
});

describe('FullHeader Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renderiza os elementos do cabeçalho', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <SimpleHeader />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('Alexa')).toBeInTheDocument();
    });
});