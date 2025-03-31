'use client';

import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import ButtonGoogleLogin from './ButtonGoogleLogin';

interface LoginFormProps {
    setUid: (uid: string) => void;
    setIncompleteSignIn: () => void;
    setIsCartLoading?: () => void;
}

export default function LoginForm({
    setIsCartLoading,
    setIncompleteSignIn,
    setUid,
}: LoginFormProps) {
    const { error, login } = useLogin();
    const { signInWithGoogle, error: googleError, isLoading: isGoogleLoading } = useGoogleAuth();
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerValues, setRegisterValues] = useState({
        email: '',
        password: '',
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const isButtonDisabled = () => {
        return !(registerValues.email.length > 0 && registerValues.password.length > 0) || isSubmitting;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
        // Limpa as mensagens de erro quando o usuário começa a digitar
        setLoginErrorMessage('');
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoginErrorMessage('');

        try {
            // Passa o callback onUnverifiedEmail para o hook de login
            const result = await login(
                registerValues.email, 
                registerValues.password,
            );
            if(result?.SignInIncomplete) {
                setIncompleteSignIn();
            }
            result?.uid && setUid(result?.uid);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Erro desconhecido');
            }
            setLoginErrorMessage('Usuário ou senha inválidos');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="space-y-4">


            <ButtonGoogleLogin
                isGoogleLoading={ isGoogleLoading }
                signInWithGoogle={ signInWithGoogle }
                setIncompleteSignIn={ setIncompleteSignIn }
                setUid={ setUid }
                setIsCartLoading={ setIsCartLoading }
            />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
            </div>
            
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label 
                        htmlFor="email" 
                        className="text-base sm:text-lg md:text-xl font-medium text-[#333333]"
                    >
                        E-mail
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-sm sm:text-base md:text-lg border border-gray-300 rounded-md text-[#333333] focus:ring-2 focus:ring-[#C48B9F]"
                        onChange={ handleChange }
                        value={ registerValues.email }
                        disabled={ isSubmitting }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label 
                        htmlFor="password" 
                        className="text-base sm:text-lg md:text-xl font-medium text-[#333333]"
                    >
                        Senha
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={ showPassword ? 'text' : 'password' }
                            placeholder="••••••••"
                            className="w-full px-3 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-sm sm:text-base md:text-lg border border-gray-300 rounded-md text-[#333333] pr-10 focus:ring-2 focus:ring-[#C48B9F]"
                            onChange={ handleChange }
                            value={ registerValues.password }
                            disabled={ isSubmitting }
                            required
                        />
                        <button
                            type="button"
                            onClick={ togglePasswordVisibility }
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#333333] transition duration-200"
                            disabled={ isSubmitting }
                        >
                            { showPassword ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm sm:text-base">
                        <Link 
                            href="/recuperar-senha" 
                            className="font-medium text-[#C48B9F] hover:text-[#D4AF37] transition-colors duration-300"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>
                </div>
                { loginErrorMessage && (
                    <p className="text-red-600 text-sm sm:text-base md:text-lg" aria-live="assertive">
                        { loginErrorMessage }
                    </p>
                ) }
                <Button
                    disabled={ isButtonDisabled() }
                    onClick={ setIsCartLoading }
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 rounded-md text-sm sm:text-base md:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    { isSubmitting ? 'Entrando...' : 'Entrar' }
                </Button>
                { error && <p className="text-red-500 text-sm sm:text-base md:text-lg">{ error }</p> }
            </div>



            { googleError && (
                <p className="text-red-500 text-sm text-center mt-2">{ 'Ocorreu um erro ao tentar fazer login com a sua conta Google, tente novamente.' }</p>
            ) }
        </form>
    );
}
