// app/carrinho/tests/Carrinho.test.tsx

import { act, render, screen } from '@testing-library/react';
import Carrinho from '../page';
import { ProductCartType } from '@/app/utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useAuthContext } from '@/app/hooks/useAuthContext';
import { useSnapshot } from '@/app/hooks/useSnapshot';
import { useCart } from '@/app/hooks/useCart';

// import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));


jest.mock('../../hooks/useSnapshot', () => ({
    useSnapshot: jest.fn(),
}));

jest.mock('../../hooks/useCart', () => ({
    useCart: jest.fn(),
}));

jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

const mockCartItems: ProductCartType[] = [
    {
        id: 'cartItem123',
        productId: 'prod1',
        quantidade: 2,
        userId: 'user1',
        nome: 'Produto 1',
        image: '/imagem1.jpg',
        preco: 50,
        estoque: 8,
        exist: true,
    },
    {
        id: 'cartItem124',
        productId: 'prod2',
        quantidade: 1,
        userId: 'user1',
        nome: 'Produto 2',
        image: '/imagem2.jpg',
        preco: 30,
        estoque: 5,
        exist: true,
    },
    {
        id: 'cartItem125',
        productId: 'prod3',
        quantidade: 0,
        userId: 'user1',
        nome: 'Produto 3',
        image: '/imagem3.jpg',
        preco: 60,
        estoque: 2,
        exist: true,
    },
];

const mockUser = {
    uid: 'user1',
};

const mockUserInfo = [
    {
        uid: 'user1',
        name: 'Test User',
    },
];

const mockCartInfos = [
    {
        productId: 'prod1',
        quantidade: 2,
    },
    {
        productId: 'prod2',
        quantidade: 1,
    },
];

describe('Carrinho Component', () => {
    beforeEach(() => {
        (useSnapshot as jest.Mock).mockImplementation((collectionName) => {
            switch (collectionName) {
                case 'usuarios':
                    return { documents: mockUserInfo };
                case 'carrinhos':
                    return { documents: mockCartInfos };
                case 'produtos':
                    return { documents: mockCartItems };
                default:
                    return { documents: [] };
            }
        });

        // (useUserInfo as jest.Mock).mockReturnValue({ carrinho: mockCartItems, userInfo: { uid: 'user1' } });
        (useCart as jest.Mock).mockReturnValue({ mappedProducts: mockCartItems });


        (useAuthContext as jest.Mock).mockReturnValue({ user: mockUser, authIsReady: true });
    });

    it('renderiza "Loading..." quando mappedProducts é null', async () => {
        (useCart as jest.Mock).mockReturnValue({ mappedProducts: null });

        await act(async () => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renderiza apenas produtos com quantidade > 0', async () => {
        await act(async () => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Produto 1')).toBeInTheDocument();
        expect(screen.getByText('Produto 2')).toBeInTheDocument();
        expect(screen.queryByText('Produto 3')).not.toBeInTheDocument(); // Produto 3 não deve ser renderizado
    });

    it('exibe o subtotal correto', async () => {
        await act(async () => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('R$ 130,00')).toBeInTheDocument(); // Subtotal = (2 * 10) + (1 * 20)
    });

    it('exibe o resumo da compra', async () => {
        await act(async () => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Resumo')).toBeInTheDocument();
        expect(screen.getByText('Subtotal')).toBeInTheDocument();
        expect(screen.getByText('Frete')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
    });
});
