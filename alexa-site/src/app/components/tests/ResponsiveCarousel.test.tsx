// ResponsiveCarousel.test.tsx

import { act, render, screen } from '@testing-library/react';
import ResponsiveCarousel from '../ResponsiveCarousel';
import { ProductType } from '@/app/utils/types';
import { AuthContextProvider } from '@/app/context/AuthContext';
import { UserInfoProvider } from '@/app/context/UserInfoContext';

// Mock para a imagem, para evitar erros no teste
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => (
        <img src={ src } alt={ alt } />
    ),
}));

jest.mock('react-responsive-carousel', () => ({
    Carousel: ({ children }: { children: React.ReactNode }) => (
        <div>{ children }</div> // Renderiza apenas as crianças, sem lógica extra
    ),
}));

describe('ResponsiveCarousel Component', () => {
    const productData: ProductType = {
        exist: true,
        id: '123',
        nome: 'Produto com Carrossel',
        descricao: 'Um produto com um carrossel de imagens',
        image: ['/imagem1.jpg', '/imagem2.png', '/imagem3.gif'],
        preco: 50,
        estoque: 20,
        desconto: 10,
        lancamento: true,
        categoria: 'aneis',
    };

    it('Renderiza as imagens do produto no carrossel', async() => {
        await act(async() => {
            render(
                <AuthContextProvider>
                    <UserInfoProvider>
                        <ResponsiveCarousel productData={ productData } />
                    </UserInfoProvider>
                </AuthContextProvider>,
            );
        });

        // Verifica se as três imagens estão presentes no documento
        const imageElements = screen.getAllByRole('img', { name: 'slides' });
        
        expect(imageElements).toHaveLength(productData.image.length);


        // Iterar sobre as imagens e verificar se a propriedade 'src' corresponde à URL esperada
        imageElements.forEach((imageElement, index) => {
            expect(imageElement).toHaveAttribute('src', productData.image[index]);
        });
    });
});