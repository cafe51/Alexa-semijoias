
import { act, render, screen } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

describe('SearchBar Component', () => {
    it('Renderiza o campo de pesquisa e o botão', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <SearchBar />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        // Verifica se o placeholder do input está presente
        expect(screen.getByPlaceholderText('O que você está procurando?')).toBeInTheDocument();
        // Verifica se o botão de busca existe
        expect(screen.getByRole('button')).toBeInTheDocument(); 
    });
});

//Simular a digitação no campo de pesquisa e verificar se o valor do input é atualizado.
// Simular o clique no botão de pesquisa e verificar se uma função de busca é chamada (se houver uma lógica de busca implementada no componente).