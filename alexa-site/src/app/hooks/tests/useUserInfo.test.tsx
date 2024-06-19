// app/hooks/useUserInfo.test.tsx
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useUserInfo } from '../useUserInfo';
import { UserInfoContext } from '@/app/context/UserInfoContext';
import { CartInfoType, OrderType, UserType } from '@/app/utils/types';
import { DocumentData } from 'firebase/firestore';

jest.mock('../../context/UserInfoContext', () => {
    return {
        UserInfoContext: React.createContext(null),
    };
});

const mockCartInfo: (CartInfoType & DocumentData)[] = [
    {
        id: 'cartItemId1',
        productId: 'productId1',
        quantidade: 2,
        userId: 'userId1',
    },
];
const mockUserInfo: (UserType & DocumentData) = {
    id: 'userId1',
    nome: 'John Doe',
    email: 'john.doe@example.com',
    cpf: '12345678901',
    tel: '1234567890',
    admin: false,
    userId: 'userId1',
};
const mockOrder: (OrderType & DocumentData)[] = [
    {
        id: 'orderId1',
        cartSnapShot: [],
        data: '2023-04-01',
        status: 'Em processamento',
        valor: { soma: 100, frete: 10, total: 110 },
        endereco: {
            cep: '12345678',
            bairro: 'Bairro Teste',
            rua: 'Rua Teste',
            cidade: 'Cidade Teste',
            estado: 'Estado Teste',
            numero: '123',
            complemento: 'Apto 456',
            referencia: 'Próximo ao mercado',
        },
    },
];


const renderHookWithException = (hook: () => void) => {
    try {
        renderHook(hook);
    } catch (error) {
        return error;
    }
    return null;
};

describe('useUserInfo Hook', () => {
    it('retorna o contexto de informações do usuário', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <UserInfoContext.Provider value={ { carrinho: mockCartInfo, userInfo: mockUserInfo, pedidos: mockOrder } }>
                { children }
            </UserInfoContext.Provider>
        );

        const { result } = renderHook(() => useUserInfo(), { wrapper });

        expect(result.current).toEqual({
            carrinho: mockCartInfo,
            userInfo: mockUserInfo,
            pedidos: mockOrder,
        });
    });

    it('lança um erro quando o hook é usado fora do UserInfoContextProvider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const error = renderHookWithException(() => useUserInfo());

        spy.mockRestore();

        expect(error).toEqual(Error('useUserInfo must be inside an UserInfoProvider'));
    });
});