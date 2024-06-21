import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteMySelfForm from '../DeleteMySelfForm';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { useLogout } from '../../hooks/useLogout';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

jest.mock('../../hooks/useDeleteUser', () => ({
    useDeleteUser: jest.fn(),
}));

jest.mock('../../hooks/useLogout', () => ({
    useLogout: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('DeleteMySelfForm Component', () => {
    let mockShowForm: jest.Mock;
    let mockDeleteUserAccount: jest.Mock;
    let mockLogout: jest.Mock;
    // let mockError: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockShowForm = jest.fn();
        mockDeleteUserAccount = jest.fn().mockResolvedValueOnce(undefined);
        mockLogout = jest.fn().mockResolvedValue(undefined);
        // mockError = jest.fn();
        (useDeleteUser as jest.Mock).mockReturnValue({ deleteUserAccount: mockDeleteUserAccount });
        (useLogout as jest.Mock).mockReturnValue({ logout: mockLogout });
    });

    it('renderiza o formulário de exclusão de conta', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <DeleteMySelfForm showForm={ mockShowForm } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const deleteButton = screen.getByTestId('delete-button');
        const closeWindowButton = screen.getByTestId('close-window-button');

        expect(screen.getByText('EMAIL/CPF')).toBeInTheDocument();
        expect(screen.getByText('SENHA')).toBeInTheDocument();
        expect(closeWindowButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    it('chama deleteUserAccount ao submeter o formulário e faz logout ao deletar usuário', async() => {
        const mockDeleteUserAccount = jest.fn().mockResolvedValueOnce(undefined);
        const mockLogout = jest.fn().mockResolvedValue(undefined);
        (useDeleteUser as jest.Mock).mockReturnValue({ deleteUserAccount: mockDeleteUserAccount, error: null });
        (useLogout as jest.Mock).mockReturnValue({ logout: mockLogout });
  
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <DeleteMySelfForm showForm={ mockShowForm } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });
  
        const deleteButton = screen.getByTestId('delete-button');
        const emailInput = screen.getByRole('textbox', { name: 'EMAIL/CPF' });
        const passwordInput = screen.getByLabelText('SENHA');
  
        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(deleteButton);
        });
  
        await waitFor(() => {
            expect(mockDeleteUserAccount).toHaveBeenCalledWith('test@example.com', 'password123');
        });
  
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
        });
    });

    it('exibe mensagem de erro no console se deleteUserAccount falhar', async() => {
        const errorMessage = 'Erro ao excluir a conta';
        const deleteError = new Error(errorMessage);
        // mockError.mockReturnValue(deleteError.message);
        mockDeleteUserAccount.mockRejectedValueOnce(deleteError);
        (useDeleteUser as jest.Mock).mockReturnValue({ deleteUserAccount: mockDeleteUserAccount, error: deleteError.message });

        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <DeleteMySelfForm showForm={ mockShowForm } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const deleteButton = screen.getByTestId('delete-button');
        const emailInput = screen.getByRole('textbox', { name: 'EMAIL/CPF' });
        const passwordInput = screen.getByLabelText('SENHA');

        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(deleteButton);
        });

        await act(async() => {
            expect(mockDeleteUserAccount).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        await act(async() => {
            expect(mockLogout).not.toHaveBeenCalled();
            // expect(console.log).toHaveBeenCalled();

            // expect(console.log).toHaveBeenCalledWith(errorMessage);
        });
    });

    it('valida o campo de email e exibe mensagem de erro personalizada', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <DeleteMySelfForm showForm={ mockShowForm } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const emailInput = screen.getByRole('textbox', { name: 'EMAIL/CPF' }) as HTMLElement & { validationMessage: string };
        const passwordInput = screen.getByLabelText('SENHA');
        const deleteButton = screen.getByTestId('delete-button');

        // fireEvent.change(emailInput, { target: { value: 'invalid' } });
        await act(async() => {
            fireEvent.change(emailInput, { target: { value: 'invalid' } });
            fireEvent.change(passwordInput, { target: { value: '123' } });
    
            fireEvent.click(deleteButton);
        });

        await act(async() => {
            expect(emailInput.validationMessage).toBe('Por favor, insira um email válido.');
        });

        // expect(emailInput.validationMessage).toBe('');
    });

    it('fecha o formulário ao clicar no botão "X"', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <DeleteMySelfForm showForm={ mockShowForm } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        const closeButton = screen.getByTestId('close-window-button');

        await act(async() => {
            fireEvent.click(closeButton);
        });

        await act(async() => {
            expect(mockShowForm).toHaveBeenCalledWith(false);
        });

    });
});
