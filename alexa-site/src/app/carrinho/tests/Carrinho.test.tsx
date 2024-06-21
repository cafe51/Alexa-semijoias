// app/carrinho/tests/Carrinho.test.tsx
import { render, screen, act } from '@testing-library/react';
import Carrinho from '../page';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

import { useUserInfo } from '../../hooks/useUserInfo';

describe('Carrinho Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza "Loading..." enquanto carrega os dados', async() => {
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123' }, carrinho: null }); // Simula que o carrinho ainda não foi carregado

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho /> 
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('FINALIZE SUA COMPRA')).toBeNull(); 
    });

    it('renderiza CartItemsSection quando os dados do carrinho estão disponíveis', async() => {
        const mockCartItems = [
            { productId: 'prod1', quantidade: 2, userId: 'user1' },
            { productId: 'prod2', quantidade: 1, userId: 'user1' },
        ];
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123' }, carrinho: mockCartItems }); 

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho /> 
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('FINALIZE SUA COMPRA')).toBeInTheDocument(); 
    });
});