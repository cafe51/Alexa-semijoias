// src/app/components/register/RegisterForm2.tsx
import { useState } from 'react';
import { useSignUp } from '@/app/hooks/useSignUp';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RegisterFormInputType } from '@/app/utils/types';

interface FormData extends RegisterFormInputType {
    confirmPassword: string;
}

interface FormErrors {
    nome?: string;
    email?: string;
    phone?: string;
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

export default function RegisterForm2() {
    const { signup, error: signupError } = useSignUp();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        phone: '',
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

    const validateForm = () => {
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
        
        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
    
        if (name === 'phone') {
            formattedValue = formatPhoneNumber(value);
        }
    
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        
        // Limpa o erro do campo que está sendo editado
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Reseta os estados de erro e redirecionamento quando o usuário começa a digitar
        setLocalError(null);
        setShouldRedirect(false);
    };
    
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setLocalError(null);
        setShouldRedirect(false);
        
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...dataObj } = formData;
            
            await signup(dataObj).catch(error => {
                throw error;
            });

            // Aguarda um momento para garantir que o estado de erro foi atualizado
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!signupError && !localError) {
                setShouldRedirect(true);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            if (error instanceof Error) {
                setLocalError(error.message);
            } else {
                setLocalError('Ocorreu um erro desconhecido.');
            }
            setShouldRedirect(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Efeito para redirecionar apenas quando shouldRedirect for true
    if (shouldRedirect && !isSubmitting && !signupError && !localError) {
        router.push('/');
    }

    return (
        <form onSubmit={ handleSubmit } className="space-y-4">
            <InputField
                label="Nome"
                name='nome'
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={ formData.nome }
                onChange={ handleChange }
                error={ errors.nome }
            />
            <InputField
                label="E-mail"
                name='email'
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={ formData.email }
                onChange={ handleChange }
                error={ errors.email }
            />
            <InputField
                label="Telefone (opcional)"
                name='phone'
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={ formData.phone }
                onChange={ handleChange }
                error={ errors.phone }
            />
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#333333]">
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
                        className={ `w-full px-3 py-2 border rounded-md text-[#333333] pr-10 ${errors.password ? 'border-red-500' : ''}` }
                    />
                    <button
                        type="button"
                        onClick={ () => setShowPassword(!showPassword) }
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    >
                        { showPassword ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                    </button>
                </div>
                { errors.password && <p className="text-red-500 text-xs mt-1">{ errors.password }</p> }
            </div>
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
            <Button 
                type="submit" 
                className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white font-bold py-2 px-4 rounded-md transition duration-300"
                disabled={ isSubmitting }
            >
                { isSubmitting ? 'Cadastrando...' : 'Cadastrar' }
            </Button>
            { (signupError || localError) && (
                <p className="text-red-600 text-sm text-center" aria-live="assertive">
                    { signupError || localError }
                </p>
            ) }
        </form>
    );
}
