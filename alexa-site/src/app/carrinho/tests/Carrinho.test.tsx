import { act, render, screen } from '@testing-library/react';
import Carrinho from '../page';
import { CartInfoType, ProductType } from '@/app/utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useSnapshot2 } from '@/app/hooks/useSnapshot2';


jest.mock('../../hooks/useSnapshot2', () => ({
    useSnapshot2: jest.fn(),
}));

// Simula itens no carrinho do usuário
const mockCartItems: CartInfoType[] = [
    { productId: 'prod1', quantidade: 2, userId: 'user1' },
    { productId: 'prod2', quantidade: 1, userId: 'user1' },
    { productId: 'prod3', quantidade: 0, userId: 'user1' },
];

const mockProducts: ({ id: string; exist: boolean; } & ProductType)[] = [
    {
        id: 'prod1',
        exist: true,
        nome: 'Produto 1',
        image: ['/imagem1.jpg'],
        preco: 10,
        estoque: 8,
        categoria: '',
        descricao: '',
        desconto: 0,
        lancamento: false,
    },
    {
        id: 'prod2',
        exist: true,
        nome: 'Produto 2',
        image: ['/imagem2.jpg'],
        preco: 20,
        estoque: 5,
        categoria: '',
        descricao: '',
        desconto: 0,
        lancamento: false,
    },
    {
        id: 'prod3',
        exist: true,
        nome: 'Produto 3',
        image: ['/imagem3.jpg'],
        preco: 30,
        estoque: 2,
        categoria: '',
        descricao: '',
        desconto: 0,
        lancamento: false,
    },
];

describe('Carrinho Component', () => {
    beforeEach(() => {
        (useSnapshot2 as jest.Mock).mockImplementation((collectionName: string) => {
            if (collectionName === 'carrinhos') {
                return { documents: mockCartItems };
            }
            if (collectionName === 'produtos') {
                return { documents: mockProducts };
            }
            return { documents: [] };
        });
        
    });

    it('renderiza "Loading..." quando mappedProducts é null', async() => {
        (useSnapshot2 as jest.Mock).mockReturnValue({ documents: null });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Carrinho/>
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
                        <Carrinho/>
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
                        <Carrinho/>
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
                        <Carrinho/>
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