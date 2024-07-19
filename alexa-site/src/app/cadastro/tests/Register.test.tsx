// app/cadastro/tests/Register.test.tsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Register from '../page';
import { useSignUp } from '../../hooks/useSignUp';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock para o hook useSignUp
jest.mock('../../hooks/useSignUp', () => ({
    useSignUp: jest.fn(),
}));

describe('Register Component', () => {
    let mockSignup: jest.Mock;
    let mockError: string | null = null;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSignup = jest.fn();
        (useSignUp as jest.Mock).mockReturnValue({ signup: mockSignup, error: mockError });
    });

    const renderComponent = async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <Register />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
    };

    it('renderiza o formulário de cadastro', async() => {
        await renderComponent();

        expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
        expect(screen.getByLabelText('Senha')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirme a senha')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cadastre-se/i })).toBeInTheDocument();
    });

    it('exibe mensagens de erro de validação', async() => {
        await renderComponent();

        const submitButton = screen.getByRole('button', { name: /Cadastre-se/i });

        expect(submitButton).toBeDisabled();
        // fireEvent.click(submitButton);

        // await waitFor(() => {
        //     expect(screen.getByText('Nome completo é obrigatório')).toBeInTheDocument();
        //     expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
        //     expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
        //     expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument();
        // });
    });

    it('chama a função de cadastro ao submeter o formulário', async() => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        await renderComponent();

        const nomeInput = screen.getByLabelText('Nome Completo');
        const emailInput = screen.getByLabelText('Email');
        const telInput = screen.getByLabelText('Telefone');
        const passwordInput = screen.getByLabelText('Senha');
        const confirmPasswordInput = screen.getByLabelText('Confirme a senha');
        const submitButton = screen.getByRole('button', { name: /Cadastre-se/i });

        await act(async() => {
            fireEvent.change(nomeInput, { target: { value: 'Teste da Silva' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(telInput, { target: { value: '1234567890' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                nome: 'Teste da Silva',
                email: 'test@example.com',
                tel: '1234567890',
                password: 'password123',
            });

            // expect(mockPush).toHaveBeenCalledWith('/minha-conta');
        });
    });

    it('exibe mensagem de erro se o cadastro falhar', async() => {
        mockError = 'Erro ao registrar. Tente novamente mais tarde.';
        (useSignUp as jest.Mock).mockReturnValue({ signup: mockSignup, error: mockError });

        await renderComponent();

        const nomeInput = screen.getByLabelText('Nome Completo');
        const emailInput = screen.getByLabelText('Email');
        const telInput = screen.getByLabelText('Telefone');
        const passwordInput = screen.getByLabelText('Senha');
        const confirmPasswordInput = screen.getByLabelText('Confirme a senha');
        const submitButton = screen.getByRole('button', { name: /Cadastre-se/i });

        await act(async() => {
            fireEvent.change(nomeInput, { target: { value: 'Teste da Silva' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(telInput, { target: { value: '1234567890' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Erro ao registrar. Tente novamente mais tarde.')).toBeInTheDocument();
        });
    });
});