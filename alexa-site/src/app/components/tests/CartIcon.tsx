// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import CartIcon from '../CartIcon';
// import { UserInfoProvider } from '../../context/UserInfoContext';

// describe('CartIcon', () => {
//     it('renders the cart icon with badge', () => {
//     // Renderize o componente CartIcon dentro do provider
//         render(
//             <UserInfoProvider value={ { carrinho: [{ productId: '1', quantidade: 2, userId: '1' }], userInfo: null, pedidos: null } }>
//                 <CartIcon />
//             </UserInfoProvider>,
//         );

//         // Verifique se o ícone do carrinho é renderizado
//         expect(screen.getByRole('link')).toBeInTheDocument();

//         // Verifique se o badge com a quantidade é renderizado e exibe o valor correto
//         const badge = screen.getByText('2'); 
//         expect(badge).toBeInTheDocument(); 
//     });

//     it('renders the cart icon without badge when cart is empty', () => {
//         render(
//             <UserInfoProvider value={ { carrinho: [], userInfo: null, pedidos: null } }> 
//                 <CartIcon />
//             </UserInfoProvider>,
//         );

//         // Verifique se o ícone do carrinho é renderizado
//         expect(screen.getByRole('link')).toBeInTheDocument();

//         // Verifique se o badge não é renderizado quando o carrinho está vazio
//         const badge = screen.queryByText('0'); 
//         expect(badge).not.toBeInTheDocument(); 
//     });
// });