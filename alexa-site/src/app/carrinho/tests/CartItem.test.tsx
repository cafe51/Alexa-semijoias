import { act, fireEvent, render, screen } from '@testing-library/react';
import CartItem from '../CartItem';
import { ProductCartType } from '@/app/utils/types';
import { useCollection } from '../../hooks/useCollection';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para o componente Image do Next.js
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => (
        <img src={ src } alt={ alt } data-testid="product-image" />
    ),
}));

// Mock para o hook useCollection
jest.mock('../../hooks/useCollection', () => ({
    useCollection: jest.fn(),
}));

const mockProduto: ProductCartType = {
    id: 'cartItem123',
    productId: 'product123',
    quantidade: 2,
    userId: 'user123',
    nome: 'Produto Teste',
    image: '/imagem-produto.jpg',
    preco: 50,
    estoque: 10,
    exist: true,
};

describe('CartItem Component', () => {
    let mockUpdateDocumentField: jest.Mock;
    let mockDeleteDocument: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdateDocumentField = jest.fn();
        mockDeleteDocument = jest.fn();

        (useCollection as jest.Mock).mockReturnValue({
            updateDocumentField: mockUpdateDocumentField,
            deleteDocument: mockDeleteDocument,
        });
    });

    it('renderiza os detalhes do item do carrinho', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItem produto={ mockProduto } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Produto Teste')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); 
        expect(screen.getByText('R$ 100.00')).toBeInTheDocument(); 
        expect(screen.getByTestId('product-image')).toHaveAttribute('src', '/imagem-produto.jpg'); 
    });

    it('atualiza a quantidade do item', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItem produto={ mockProduto } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const decreaseButton = screen.getByText('-');
        const increaseButton = screen.getByText('+');

        fireEvent.click(increaseButton);
        expect(mockUpdateDocumentField).toHaveBeenCalledWith('cartItem123', 'quantidade', 3);

        fireEvent.click(decreaseButton);
        expect(mockUpdateDocumentField).toHaveBeenCalledWith('cartItem123', 'quantidade', 2); 
    });

    it('remove o item do carrinho', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <CartItem produto={ mockProduto } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        // const deleteButton = screen.getByRole('button', { name: /lixeira/i }); // Encontra pelo ícone da lixeira
        const deleteButton = screen.getByTestId('trashButton');
        fireEvent.click(deleteButton);

        expect(mockDeleteDocument).toHaveBeenCalledWith('cartItem123');
    });
});