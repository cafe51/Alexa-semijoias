// app/hooks/useCart.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useCart } from '../useCart';
import { useCollection } from '../useCollection';
import { CartInfoType, ProductType } from '../../utils/types';
import { useAuthContext } from '../useAuthContext';

jest.mock('../useCollection');

jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

describe('useCart Hook', () => {
    
    const mockProducts: ProductType[] = [
        {
            id: 'prod1',
            exist: true,
            nome: 'Produto 1',
            image: ['/imagem1.jpg'],
            preco: 10,
            categoria: 'brincos',
            descricao: 'belo brinco belo produto muito bonito',
            desconto: 10,
            estoque: 8,
            lancamento: false,
        },
        {
            id: 'prod2',
            exist: true,
            nome: 'Produto 2',
            image: ['/imagem2.jpg'],
            preco: 20,
            categoria: 'aneis',
            descricao: 'anel todo de ouro todo dourado bem bonitinho',
            desconto: 0,
            estoque: 5,
            lancamento: true,
        },
    ];

    const mockUser = {
        uid: 'user1',
    };

    const mockCartItems: CartInfoType[] = [
        { productId: 'prod1', quantidade: 2, userId: 'user1' },
        { productId: 'prod3', quantidade: 1, userId: 'user1' }, // Produto 3 não existe na lista de produtos
    ];

    it('mapeia corretamente os produtos do carrinho com seus detalhes', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: mockUser, authIsReady: true });

        (useCollection as jest.Mock).mockReturnValue({
        });

        const { result } = renderHook(() => useCart(mockCartItems, mockProducts, () => {}));

        await waitFor(() => expect(result.current.mappedProducts).toEqual([
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
        ]));

    });
});
