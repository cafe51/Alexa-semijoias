import { act, render, screen } from '@testing-library/react';
import CartItemsSection from '../CartItemsSection';
import { useCart } from '../../hooks/useCart';
import { CartInfoType, ProductCartType } from '@/app/utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useCart', () => ({
    useCart: jest.fn(),
}));

// Simula itens no carrinho do usuário
const mockCartItems: CartInfoType[] = [
    { productId: 'prod1', quantidade: 2, userId: 'user1' },
    { productId: 'prod2', quantidade: 1, userId: 'user1' },
    { productId: 'prod3', quantidade: 0, userId: 'user1' },
];

const mockMappedProducts: ProductCartType[] = [
    {
        id: 'prod1',
        exist: true,
        nome: 'Produto 1',
        image: '/imagem1.jpg',
        preco: 10,
        estoque: 8,
        productId: 'prod1',
        quantidade: 2,
        userId: 'user1',
    },
    {
        id: 'prod2',
        exist: true,
        nome: 'Produto 2',
        image: '/imagem2.jpg',
        preco: 20,
        estoque: 5,
        productId: 'prod2',
        quantidade: 1,
        userId: 'user1',
    },
    {
        id: 'prod3',
        exist: true,
        nome: 'Produto 3',
        image: '/imagem3.jpg',
        preco: 30,
        estoque: 2,
        productId: 'prod3',
        quantidade: 0,
        userId: 'user1',
    },
];

describe('CartItemsSection Component', () => {
    beforeEach(() => {
        (useCart as jest.Mock).mockReturnValue({ mappedProducts: mockMappedProducts });
    });

    it('renderiza "Loading..." quando mappedProducts é null', async() => {
        (useCart as jest.Mock).mockReturnValue({ mappedProducts: null }); // Simula carregamento

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItemsSection productIds={ ['prod1', 'prod2'] } carrinho={ mockCartItems } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renderiza apenas produtos com quantidade > 0', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItemsSection productIds={ ['prod1', 'prod2', 'prod3'] } carrinho={ mockCartItems } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Produto 1')).toBeInTheDocument();
        expect(screen.getByText('Produto 2')).toBeInTheDocument();
        expect(screen.queryByText('Produto 3')).not.toBeInTheDocument(); // Produto 3 não deve ser renderizado
    });

    it('exibe o subtotal correto', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItemsSection productIds={ ['prod1', 'prod2', 'prod3'] } carrinho={ mockCartItems } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('R$ 40.00')).toBeInTheDocument(); // Subtotal = (2 * 10) + (1 * 20)
    });

    it('exibe o resumo da compra', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItemsSection productIds={ ['prod1', 'prod2', 'prod3'] } carrinho={ mockCartItems } />
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