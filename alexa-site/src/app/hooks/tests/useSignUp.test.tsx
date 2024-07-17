// app/hooks/tests/useSignUp.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useSignUp } from '../useSignUp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useCollection } from '../useCollection';
import { useLogin } from '../useLogin';
import { UserInfoProvider } from '../../context/UserInfoContext';
import { AuthContextProvider } from '../../context/AuthContext'; // Importe o AuthContextProvider

jest.mock('../useCollection');
jest.mock('../useLogin');

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    getAuth: () => ({
        onAuthStateChanged: jest.fn(),
    }),
}));

const mockUser = {
    uid: 'testUserId',
    email: 'test@example.com',
    emailVerified: false,
    displayName: 'Test User',
    isAnonymous: false,
    photoURL: null,
    providerData: [],
    phoneNumber: null,
    metadata: {
        creationTime: '2021-01-01T00:00:00Z',
        lastSignInTime: '2021-01-01T00:00:00Z',
    },
    refreshToken: '',
    tenantId: null,
    providerId: 'testProviderId',
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
};

const mockUserCredential = {
    user: mockUser,
};

describe('useSignUp Hook', () => {
    const mockAddDocument = jest.fn();
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCollection as jest.Mock).mockReturnValue({ addDocument: mockAddDocument });
        (useLogin as jest.Mock).mockReturnValue({ login: mockLogin });
    });

    it('realiza cadastro com sucesso', async() => {
        (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider>
                <UserInfoProvider>{ children }</UserInfoProvider>
            </AuthContextProvider>
        );
        const { result } = renderHook(() => useSignUp(), { wrapper });

        const singInData = {
            email: 'test@example.com',
            password: 'password123',
            nome: 'Teste da Silva',
            tel: '1234567890',
        };

        await act(async() => {
            await result.current.signup(singInData);
        });

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object), // auth object
            singInData.email,
            singInData.password,
        );
        expect(mockAddDocument).toHaveBeenCalledWith({
            email: singInData.email,
            nome: singInData.nome,
            tel: singInData.tel,
            userId: mockUser.uid,
            admin: false,
            cpf: '',
        });
        expect(mockLogin).toHaveBeenCalledWith(singInData.email, singInData.password);

        expect(result.current.error).toBeNull();
    });
});
