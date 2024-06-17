// CartIcon.test.tsx

import { act, render, screen } from '@testing-library/react';
import CartIcon from '../CartIcon';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

import { useUserInfo } from '../../hooks/useUserInfo';
import { AuthContextProvider } from '@/app/context/AuthContext';

describe('CartIcon Component', () => {
    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        jest.clearAllMocks();
    });
    
    it('Exibe a quantidade correta de itens no carrinho', async() => {
        (useUserInfo as jest.Mock).mockReturnValue({ carrinho: [
            { id: '1', productId: 'prod1', quantidade: 2, userId: 'user1' },
            { id: '2', productId: 'prod2', quantidade: 1, userId: 'user1' },
        ], userInfo: { uid: 'user123' } });
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartIcon />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        // Verifica se a quantidade total (3) está sendo exibida
        expect(screen.getByText('3')).toBeInTheDocument(); 
    });

    it('Exibe 0 quando o carrinho está vazio', async() => {
        (useUserInfo as jest.Mock).mockReturnValue({ carrinho: [], userInfo: { uid: 'user123' } });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartIcon />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});