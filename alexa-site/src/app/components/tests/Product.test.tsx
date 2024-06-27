// Product.test.test.tsx

import { act, render, screen } from '@testing-library/react';
import Product from '../Product';
import { ProductType } from '@/app/utils/types';
import { useCollection } from '../../hooks/useCollection';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useCollection', () => ({
    useCollection: jest.fn(),
}));

const mockProductData: ProductType = {
    exist: true,
    id: '123',
    nome: 'Colar de Pérolas',
    descricao: 'Um elegante colar de pérolas.',
    image: ['/colar-perolas1.jpg', '/colar-perolas2.jpg'],
    preco: 300,
    estoque: 15,
    desconto: 5,
    lancamento: true,
    categoria: 'colares',
};

jest.mock('../../hooks/useCollection', () => ({
    useCollection: jest.fn(),
}));


describe('Product Component', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renderiza os detalhes do produto corretamente', async() => {
        // Simula o retorno do hook useCollection com os dados do produto
        (useCollection as jest.Mock).mockReturnValue({ 
            getDocumentById: jest.fn().mockResolvedValue(mockProductData),
        });


        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Product id="123" productType="colares" /> 
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Colar de Pérolas')).toBeInTheDocument(); 
        expect(screen.getByText('Um elegante colar de pérolas.')).toBeInTheDocument();
        expect(screen.getByText('R$ 300,00')).toBeInTheDocument();
        expect(screen.getByText('em até 6x de R$ 50,00 sem juros')).toBeInTheDocument();

    });

    it('Exibe mensagem de carregamento enquanto busca os dados', async() => {
        (useCollection as jest.Mock).mockReturnValue({ 
            getDocumentById: jest.fn().mockResolvedValue({ exist: false }), // Simula que ainda não há dados
        });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Product id="123" productType="colares" /> 
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('carregando')).toBeInTheDocument(); 
    });
});