// src/app/components/register/RegisterForm2.tsx
import { useState } from 'react';
import { useSignUp } from '@/app/hooks/useSignUp';
import { useGoogleAuth } from '@/app/hooks/useGoogleAuth';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RegisterFormInputType } from '@/app/utils/types';
import { checkDuplicateFields } from '@/app/utils/checkDuplicateFields';
import ButtonGoogleLogin from '../ButtonGoogleLogin';
import validarCPF from '@/app/utils/validarCPF';

interface RegisterForm2Props {
    setSignedEmail: (email: string | undefined) => void;
    setUid: (uid: string) => void;
    setIncompleteSignIn: () => void;
    setIsCartLoading?: () => void;
}

interface FormData extends RegisterFormInputType {
    confirmPassword: string;
}

interface FormErrors {
    nome?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    password?: string;
    confirmPassword?: string;
}

// Lista de domínios de email válidos mais comuns
const validEmailDomains = [
    'com', 'net', 'org', 'edu', 'gov', 'mil',
    'br', 'com.br', 'net.br', 'org.br', 'edu.br', 'gov.br',
    'io', 'co', 'me', 'info', 'biz', 'name',
    'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp',
];

export default function RegisterForm2({ setSignedEmail, setIncompleteSignIn, setUid, setIsCartLoading }: RegisterForm2Props) {
    const { signup, error: signupError, isLoading } = useSignUp();
    const { signInWithGoogle, error: googleError, isLoading: isGoogleLoading } = useGoogleAuth();
    const [localError, setLocalError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        phone: '',
        cpf: '',
        password: '',
        confirmPassword: '',
    });
      
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string): boolean => {
        // Verifica o formato básico do email
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return false;
        }

        // Extrai o domínio do email
        const domain = email.split('@')[1];
        const topLevelDomain = domain.split('.').slice(1).join('.');

        // Verifica se o domínio de alto nível está na lista de domínios válidos
        return validEmailDomains.some(validDomain => 
            topLevelDomain.toLowerCase() === validDomain.toLowerCase(),
        );
    };

    const validateForm = async() => {
        const newErrors: FormErrors = {};
        
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }
        
        if (formData.phone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf.trim())) || !validarCPF(formData.cpf.trim())) {
            newErrors.cpf = 'CPF inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        // Verifica duplicidade apenas se não houver outros erros
        if (Object.keys(newErrors).length === 0) {
            try {
                const fieldsToCheck: { [key: string]: string } = {
                    email: formData.email,
                    cpf: formData.cpf,
                };

                if (formData.phone) {
                    fieldsToCheck.phone = formData.phone;
                }

                const duplicateCheck = await checkDuplicateFields('usuarios', fieldsToCheck);
                
                if (duplicateCheck.isDuplicate && duplicateCheck.field) {
                    const fieldMessages: { [key: string]: string } = {
                        email: 'Este e-mail já está cadastrado',
                        cpf: 'Este CPF já está cadastrado',
                        phone: 'Este telefone já está cadastrado',
                    };
                    
                    newErrors[duplicateCheck.field as keyof FormErrors] = 
                        fieldMessages[duplicateCheck.field];
                }
            } catch (error) {
                console.error('Erro ao verificar duplicidade:', error);
                setLocalError('Erro ao verificar dados. Por favor, tente novamente.');
                return false;
            }
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
    
        if (name === 'phone') {
            formattedValue = formatPhoneNumber(value);
        } else if (name === 'cpf') {
            formattedValue = formatCPF(value);
        }
    
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        
        // Limpa o erro do campo que está sendo editado
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Reseta os estados de erro quando o usuário começa a digitar
        setLocalError(null);
    };
    
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (isLoading) {
            return;
        }

        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        setLocalError(null);
        
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...dataObj } = formData;
            
            const result = await signup(dataObj);

            if (result.success) {
                setSignedEmail(result.email ? result.email : undefined);
                result.uid && setUid(result.uid);
            }

            // Aguarda um momento para garantir que o estado de erro foi atualizado
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Erro no cadastro:', error);
            if (error instanceof Error) {
                setLocalError(error.message);
            } else {
                setLocalError('Ocorreu um erro desconhecido.');
            }
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="w-full max-w-lg mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 rounded-xl bg-white shadow-sm">
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

            
            { /* Nome Field */ }
            <InputField
                label="Nome"
                name="nome"
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={ formData.nome }
                onChange={ handleChange }
                error={ errors.nome }
            />

            { /* Email Field */ }
            <InputField
                label="E-mail"
                name="email"
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={ formData.email }
                onChange={ handleChange }
                error={ errors.email }
            />

            { /* CPF Field */ }
            <InputField
                label="CPF"
                name="cpf"
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={ formData.cpf }
                onChange={ handleChange }
                error={ errors.cpf }
            />

            { /* Phone Field */ }
            <InputField
                label="Telefone (opcional)"
                name="phone"
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={ formData.phone }
                onChange={ handleChange }
                error={ errors.phone }
            />

            { /* Password Field with Show/Hide */ }
            <div className="space-y-3 sm:space-y-4 w-full">
                <Label 
                    htmlFor="password" 
                    className="block text-sm sm:text-base font-medium text-[#333333] transition-all duration-200"
                >
                    Senha
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={ showPassword ? 'text' : 'password' }
                        placeholder="••••••••"
                        value={ formData.password }
                        onChange={ handleChange }
                        className={ `
                            w-full 
                            px-4 
                            py-2.5 
                            sm:py-3 
                            text-base 
                            border 
                            rounded-lg 
                            text-[#333333] 
                            pr-12
                            placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-[#D4AF37] 
                            focus:border-transparent 
                            transition-all 
                            duration-200
                            ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
                        ` }
                    />
                    <button
                        type="button"
                        onClick={ () => setShowPassword(!showPassword) }
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        { showPassword ? <EyeOff size={ 24 } /> : <Eye size={ 24 } /> }
                    </button>
                </div>
                { errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1.5 transition-all duration-200">
                        { errors.password }
                    </p>
                ) }
            </div>

            { /* Confirm Password Field */ }
            <InputField
                label="Confirmar Senha"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={ formData.confirmPassword }
                onChange={ handleChange }
                error={ errors.confirmPassword }
            />

            { /* Submit Button */ }
            <div className="pt-2 sm:pt-4">
                <Button 
                    className={ `
                        w-full 
                        bg-[#D4AF37] 
                        hover:bg-[#C48B9F] 
                        text-white 
                        font-semibold 
                        text-base 
                        sm:text-lg 
                        py-3 
                        sm:py-4 
                        px-6 
                        rounded-lg 
                        transition-all 
                        duration-300
                        disabled:opacity-50 
                        disabled:cursor-not-allowed
                        shadow-sm 
                        hover:shadow-md
                        ` }
                    type="submit" 
                    onClick={ setIsCartLoading }
                    disabled={ isLoading }
                >
                    { isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                            <span className="animate-pulse">Cadastrando...</span>
                        </span>
                    ) : (
                        'Cadastrar'
                    ) }
                </Button>
            </div>

            { /* Error Message */ }
            { (signupError || localError) && (
                <div className="rounded-lg bg-red-50 p-3 sm:p-4 mt-4">
                    <p className="text-red-600 text-sm sm:text-base text-center font-medium" aria-live="assertive">
                        { signupError || localError }
                    </p>
                </div>
            ) }

            { googleError && (
                <p className="text-red-500 text-sm text-center mt-2">{ googleError }</p>
            ) }
        </form>
    );
}
