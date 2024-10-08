// ProductsList.test.test.tsx

import { act, render, screen } from '@testing-library/react';
import ProductsList from '../ProductList/ProductsList';
import { ProductType } from '@/app/utils/types';
import { useSnapshot } from '../../hooks/useSnapshot';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useSnapshot', () => ({
    useSnapshot: jest.fn(),
}));

describe('ProductsList Component', () => {

    const mockProducts: ProductType[] = [
        {
            exist: true,
            id: '1',
            nome: 'Anel de Ouro',
            descricao: 'Um anel de ouro bonito',
            image: ['/anel-ouro.jpg'],
            preco: 200,
            estoque: 5,
            desconto: 0,
            lancamento: false,
            categoria: 'aneis',
        },
        {
            exist: true,
            id: '2',
            nome: 'Anel de Prata',
            descricao: 'Um anel de prata elegante',
            image: ['/anel-prata.jpg'],
            preco: 100,
            estoque: 8,
            desconto: 0,
            lancamento: true,
            categoria: 'aneis',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renderiza o título da categoria corretamente', async() => {
        (useSnapshot as jest.Mock).mockReturnValue({ documents: [] }); // Simula lista vazia


        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <ProductsList productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Ainda não há produtos nessa categoria')).toBeInTheDocument();

    });

    it('Mostra mensagem de carregamento enquanto os dados são buscados', async() => {
        (useSnapshot as jest.Mock).mockReturnValue({ documents: null }); // Simula estado inicial

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <ProductsList productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('Laoding...')).toBeInTheDocument();
    });

    it('Renderiza os produtos da categoria', async() => {
        (useSnapshot as jest.Mock).mockReturnValue({ documents: mockProducts });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <ProductsList productType="aneis" />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.getByText('Anel de Ouro')).toBeInTheDocument();
        expect(screen.getByText('Anel de Prata')).toBeInTheDocument();
    });


});
