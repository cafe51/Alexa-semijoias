// app/minha-conta/tests/CardOrder.test.tsx
import { act, render, screen } from '@testing-library/react';
import CardOrder from '../CardOrder';
import { OrderType } from '../../utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para o componente Image do Next.js
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => (
        <img src={ src } alt={ alt } data-testid="product-image" />
    ),
}));

const mockOrder: OrderType = {
    cartSnapShot: [
        {
            id: 'prod1',
            nome: 'Produto 1',
            image: '/imagem1.jpg',
            preco: 20,
            categoria: '',
            productId: '',
            quantidade: 4,
        },
        {
            id: 'prod2',
            nome: 'Produto 2',
            image: '/imagem2.jpg',
            preco: 30,
            categoria: '',
            productId: '',
            quantidade: 3,
        },
    ],
    data: '01/04/2023',
    status: 'Entregue',
    valor: { soma: 50, frete: 10, total: 60 },
    endereco: {
        cep: '12345678',
        bairro: 'Bairro Teste',
        logradouro: 'Rua Teste',
        localidade: 'Cidade Teste',
        uf: 'Estado Teste',
        numero: '123',
        complemento: 'Apto 456',
        referencia: 'Próximo ao mercado',
        ddd: '',
        gia: '',
        ibge: '',
        siafi: '',
        unidade: '',
    },
    userId: '',
    totalQuantity: 6,
    paymentOption: '',
    deliveryOption: '',
};

describe('CardOrder Component', () => {
    it('renderiza os detalhes do pedido', async() => {
        const setShowFullOrderModalMock = jest.fn() as jest.MockedFunction<
            React.Dispatch<React.SetStateAction<{ pedido?: OrderType }>>
        >;
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CardOrder setShowFullOrderModal={ setShowFullOrderModalMock } pedido={ mockOrder } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('01/04/2023')).toBeInTheDocument();
        expect(screen.getByText('R$ 60,00')).toBeInTheDocument();
        expect(screen.getByText('Entregue')).toBeInTheDocument();

        const productImages = screen.getAllByTestId('product-image');
        expect(productImages).toHaveLength(2);
        expect(productImages[0]).toHaveAttribute('src', '/imagem1.jpg');
        expect(productImages[1]).toHaveAttribute('src', '/imagem2.jpg');
    });
});