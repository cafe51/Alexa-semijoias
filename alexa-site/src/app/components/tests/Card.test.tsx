// Card.test.tsx

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Card from '../Card';
import { ProductType } from '@/app/utils/types';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { AuthContextProvider } from '@/app/context/AuthContext';

const productData: ProductType = {
    exist: true,
    id: '123',
    nome: 'Anel Dourado',
    descricao: 'Um lindo anel dourado...',
    image: ['/anel-dourado.jpg'],
    preco: 100,
    estoque: 10,
    desconto: 0,
    lancamento: false,
    categoria: 'aneis',
};

// Mocks fora do escopo do teste
jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

jest.mock('../../hooks/useCollection', () => ({
    useCollection: jest.fn(),
}));

import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useCollection } from '../../hooks/useCollection';

describe('Card Component', () => {
    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        jest.clearAllMocks();
    });

    it('Renderiza os dados do produto corretamente', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'user123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123' }, carrinho: [] });
        (useCollection as jest.Mock).mockReturnValue({ addDocument: jest.fn(), updateDocumentField: jest.fn() });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Card cardData={ productData } productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Anel Dourado')).toBeInTheDocument();
        expect(screen.getByText('R$ 100')).toBeInTheDocument();
        expect(screen.getByText('R$ 16.67')).toBeInTheDocument();
    });

    it('Mostra uma mensagem de carregamento quando o produto não foi carregado', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'user123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123' }, carrinho: [] });
        (useCollection as jest.Mock).mockReturnValue({ addDocument: jest.fn(), updateDocumentField: jest.fn() });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Card cardData={ null } productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('Chama addDocument quando o botão "COMPRAR" é clicado e o produto não está no carrinho', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'user123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { uid: 'user123' }, carrinho: [] });

        const addDocumentMock = jest.fn();
        const updateDocumentFieldMock = jest.fn();
        (useCollection as jest.Mock).mockReturnValue({ addDocument: addDocumentMock, updateDocumentField: updateDocumentFieldMock });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Card cardData={ productData } productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const buyButton = screen.getByText('COMPRAR');

        // Aguarde o botão estar habilitado (contexto atualizado)
        await waitFor(() => expect(buyButton).toBeEnabled());

        act(() => {
            fireEvent.click(buyButton);
        });

        expect(addDocumentMock).toHaveBeenCalledTimes(1);
        expect(addDocumentMock).toHaveBeenCalledWith({
            productId: '123',
            quantidade: 1,
            userId: 'user123',
        });
        expect(updateDocumentFieldMock).not.toHaveBeenCalled();
    });

    it('Chama updateDocumentField quando o produto já está no carrinho', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'user123' }, authIsReady: true });

        const addDocumentMock = jest.fn();
        const updateDocumentFieldMock = jest.fn();
        (useUserInfo as jest.Mock).mockReturnValue({
            userInfo: { uid: 'user123' },
            carrinho: [
                {
                    id: 'cartItem123',
                    productId: '123',
                    quantidade: 2,
                    userId: 'user123',
                },
            ],
        });

        (useCollection as jest.Mock).mockReturnValue({
            addDocument: addDocumentMock,
            updateDocumentField: updateDocumentFieldMock,
        });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Card cardData={ productData } productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const buyButton = screen.getByText('COMPRAR');

        // Aguarde o botão estar habilitado (contexto atualizado)
        await waitFor(() => expect(buyButton).toBeEnabled());

        act(() => {
            fireEvent.click(buyButton);
        });

        expect(updateDocumentFieldMock).toHaveBeenCalledTimes(1);
        expect(updateDocumentFieldMock).toHaveBeenCalledWith('cartItem123', 'quantidade', 3);
        expect(addDocumentMock).not.toHaveBeenCalled();
    });

});