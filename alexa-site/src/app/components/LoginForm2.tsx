// app/components/LoginForm.tsx
'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    loadingButton: boolean;
    setLoadingButton: Dispatch<SetStateAction<boolean>>;
    onClick: () => void;
}

export default function LoginForm({ setLoadingButton, onClick }: LoginFormProps) {
    const { error, login } = useLogin();
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registerValues, setRegisterValues] = useState({
        email: '',
        password: '',
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        setLoadingButton(false);
    }, []);

    const isButtonDisabled = () => {
        return !(registerValues.email.length > 0 && registerValues.password.length > 0);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingButton(true);
        setLoginErrorMessage('');

        try {
            login(registerValues.email, registerValues.password);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Erro desconhecido');
            }
            setLoginErrorMessage('Usuário ou senha inválidos');
        } finally {
            setLoadingButton(false);
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="space-y-4">
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base sm:text-lg md:text-xl font-medium text-[#333333]">
                            E-mail
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-sm sm:text-base md:text-lg border border-gray-300 rounded-md text-[#333333] focus:ring-2 focus:ring-[#C48B9F]"
                        onChange={ handleChange }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-base sm:text-lg md:text-xl font-medium text-[#333333]">
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
                            required
                        />
                        <button
                            type="button"
                            onClick={ togglePasswordVisibility }
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#333333] transition duration-200"
                        >
                            { showPassword ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm sm:text-base">
                        <a href="#" className="font-medium text-[#C48B9F] hover:text-[#D4AF37] transition-colors duration-300">
                                Esqueceu a senha?
                        </a>
                    </div>
                </div>
                { loginErrorMessage && (
                    <p className="text-red-600 text-sm sm:text-base md:text-lg" aria-live="assertive">
                        { loginErrorMessage }
                    </p>
                ) }
                <Button
                    disabled={ isButtonDisabled() }
                    onClick={ onClick }
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 rounded-md text-sm sm:text-base md:text-lg transition-all duration-300"
                >
                        Entrar
                </Button>
                { error && <p className="text-red-500 text-sm sm:text-base md:text-lg">{ error }</p> }
            </div>
        </form>
    );
}
