import { render, screen } from '@testing-library/react';
import Card from '../Card'; // Importe o componente Card

// Dados de exemplo para o produto
const productData = {
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

// Mock para o hook useAuthContext
jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: () => ({ user: { uid: 'user123' } }),
}));

// Mock para o hook useUserInfo
jest.mock('../../hooks/useUserInfo', () => ({
    useUserInfo: () => ({ carrinho: [] }),
}));

describe('Card Component', () => {
    it('renders product data correctly', () => {
        render(<Card cardData={ productData } productType="aneis" />);

        expect(screen.getByText('Anel Dourado')).toBeInTheDocument();
        expect(screen.getByText('R$ 100')).toBeInTheDocument();
        expect(screen.getByText('R$ 16.67')).toBeInTheDocument();

    });
});