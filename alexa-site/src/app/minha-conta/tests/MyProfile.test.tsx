// app/minha-conta/tests/MyProfile.test.tsx
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import MyProfile from '../page';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserInfo } from '../../hooks/useUserInfo';
import { UserType, OrderType } from '../../utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useRouter } from 'next/navigation';

jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockUser: UserType = {
    id: 'userId123',
    nome: 'Fulano de Tal',
    email: 'fulano@example.com',
    cpf: '12345678901',
    tel: '1234567890',
    admin: false,
    userId: 'userId123',
};

const mockOrders: OrderType[] = [
    {
        cartSnapShot: [],
        data: '01/05/2023',
        status: 'Em processamento',
        valor: { soma: 100, frete: 10, total: 110 },
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
        totalQuantity: 2,
        paymentOption: '',
        deliveryOption: '',
    },
    {
        cartSnapShot: [],
        data: '15/04/2023',
        status: 'Entregue',
        valor: { soma: 50, frete: 5, total: 55 },
        endereco: {
            cep: '87654321',
            bairro: 'Outro Bairro',
            logradouro: 'Outra Rua',
            localidade: 'Outra Cidade',
            uf: 'Outro Estado',
            numero: '456',
            complemento: 'Casa',
            referencia: 'Em frente à padaria',
            ddd: '',
            gia: '',
            ibge: '',
            siafi: '',
            unidade: '',
        },
        userId: '',
        totalQuantity: 4,
        paymentOption: '',
        deliveryOption: '',
    },
];

describe('MyProfile Component', () => {
    let mockPush: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it('redireciona para a página de login se o usuário não estiver autenticado', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: undefined, authIsReady: false }); 
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: undefined, carrinho: [], pedidos: undefined });


        render(
            <AuthContextProvider>
                <UserInfoProvider>
                    <MyProfile />
                </UserInfoProvider>
            </AuthContextProvider>,
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('renderiza os dados do usuário e pedidos', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'userId123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: mockUser, carrinho: [], pedidos: mockOrders });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <MyProfile />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Fulano de Tal')).toBeInTheDocument();
        expect(screen.getByText('fulano@example.com')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
    



        expect(screen.getByText('01/05/2023')).toBeInTheDocument();
        expect(screen.getByText('Em processamento')).toBeInTheDocument();
        expect(screen.getByText('15/04/2023')).toBeInTheDocument();
        expect(screen.getByText('Entregue')).toBeInTheDocument();
    });

    it('exibe a mensagem "Realize sua primeira compra" se não houver pedidos', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'userId123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: mockUser, carrinho: [], pedidos: [] }); 

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <MyProfile />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        expect(screen.getByText('Realize sua primeira compra')).toBeInTheDocument();
    });

    it('não renderiza os dados do usuário enquanto carrega', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'userId123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: null, carrinho: [], pedidos: [] }); 

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <MyProfile />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        expect(screen.queryByText('Fulano de Tal')).not.toBeInTheDocument();
        expect(screen.queryByText('fulano@example.com')).not.toBeInTheDocument();
        expect(screen.queryByText('1234567890')).not.toBeInTheDocument();
    });

    it('exibe o DeleteMySelfForm quando o botão "Excluir minha conta" é clicado', async() => {
        (useAuthContext as jest.Mock).mockReturnValue({ user: { uid: 'userId123' }, authIsReady: true });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: mockUser, carrinho: [], pedidos: mockOrders });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <MyProfile />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
        
        const deleteButton = screen.getByText('Excluir minha conta');

        fireEvent.click(deleteButton);

        expect(screen.getByText('EMAIL/CPF')).toBeVisible(); // Verifica se o formulário é exibido
    });
});