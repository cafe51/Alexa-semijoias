// app/login/tests/Login.test.tsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Login from './../page';
import { useLogin } from '../../hooks/useLogin';
import { useUserInfo } from '../../hooks/useUserInfo';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../hooks/useLogin', () => ({
    useLogin: jest.fn(),
}));

jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

describe('Login Component', () => {
    let mockLogin: jest.Mock;
    let mockError: string | null = null;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogin = jest.fn();
        (useLogin as jest.Mock).mockReturnValue({ login: mockLogin, error: mockError });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: null, carrinho: [] }); 
    });

    const renderComponent = async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Login />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
    };

    it('renderiza o formulário de login', async() => {
        await renderComponent();

        expect(screen.getByText('Entre na sua conta')).toBeInTheDocument();
        expect(screen.getByLabelText('EMAIL/CPF')).toBeInTheDocument();
        expect(screen.getByLabelText('SENHA')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Continuar/i })).toBeInTheDocument();
    });

    it('chama a função de login ao submeter o formulário', async() => {
        await renderComponent();

        const emailInput = screen.getByLabelText('EMAIL/CPF');
        const passwordInput = screen.getByLabelText('SENHA');
        const submitButton = screen.getByRole('button', { name: /Continuar/i });

        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('exibe mensagem de erro se o login falhar', async() => {
        mockError = 'Usuário ou senha inválidos';
        (useLogin as jest.Mock).mockReturnValue({ login: mockLogin, error: mockError });

        await renderComponent();

        const emailInput = screen.getByLabelText('EMAIL/CPF');
        const passwordInput = screen.getByLabelText('SENHA');
        const submitButton = screen.getByRole('button', { name: /Continuar/i });

        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Usuário ou senha inválidos')).toBeInTheDocument();
        });
    });

    it('redireciona para a página inicial se o usuário já estiver logado', async() => {
        const mockUserInfo = { uid: 'user123', nome: 'Fulano' };
        const mockPush = jest.fn();

        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: mockUserInfo, carrinho: [] });
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        await renderComponent();

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    it('captura e exibe erros durante o handleSubmit', async() => {
        const mockError = new Error('Erro no handleSubmit');
        (useLogin as jest.Mock).mockReturnValue({
            login: jest.fn().mockImplementation(() => {
                throw mockError;
            }),
            error: null,
        });

        await renderComponent();

        const emailInput = screen.getByLabelText('EMAIL/CPF');
        const passwordInput = screen.getByLabelText('SENHA');
        const submitButton = screen.getByRole('button', { name: /Continuar/i });

        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Usuário ou senha inválidos')).toBeInTheDocument();
        });
    });
});
