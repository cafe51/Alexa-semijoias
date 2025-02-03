import { useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import { UserType } from '@/app/utils/types';
import { useAuthContext } from '@/app/hooks/useAuthContext';
import { auth } from '@/app/firebase/config';
import { checkDuplicateFields } from '@/app/utils/checkDuplicateFields';
import { useSyncCart } from '@/app/hooks/useSyncCart';
import validarCPF from '@/app/utils/validarCPF';

interface GoogleAdditionalInfoProps {
    userId: string;
    onComplete?: () => void;
}

interface FormData {
    phone: string;
    cpf: string;
}

interface FormErrors {
    phone?: string;
    cpf?: string;
}

export default function GoogleAdditionalInfo({ userId, onComplete }: GoogleAdditionalInfoProps) {
    const { dispatch } = useAuthContext();
    const { syncLocalCartToFirebase } = useSyncCart();
    const { updateDocumentField } = useCollection<UserType>('usuarios');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        phone: '',
        cpf: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = async() => {
        const newErrors: FormErrors = {};
        
        if (formData.phone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }
        
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!validarCPF(formData.cpf.trim())) {
            newErrors.cpf = 'CPF inválido';
        }

        // Verifica duplicidade apenas se não houver outros erros
        if (Object.keys(newErrors).length === 0) {
            try {
                const fieldsToCheck: { [key: string]: string } = {
                    cpf: formData.cpf,
                };

                if (formData.phone) {
                    fieldsToCheck.phone = formData.phone;
                }

                const duplicateCheck = await checkDuplicateFields('usuarios', fieldsToCheck);
                
                if (duplicateCheck.isDuplicate && duplicateCheck.field) {
                    const fieldMessages: { [key: string]: string } = {
                        cpf: 'Este CPF já está cadastrado',
                        phone: 'Este telefone já está cadastrado',
                    };
                    
                    newErrors[duplicateCheck.field as keyof FormErrors] = 
                        fieldMessages[duplicateCheck.field];
                }
            } catch (error) {
                console.error('Erro ao verificar duplicidade:', error);
                setError('Erro ao verificar dados. Por favor, tente novamente.');
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
        
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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

        setIsLoading(true);
        setError(null);
        
        try {
            await Promise.all([
                updateDocumentField(userId, 'phone', formData.phone),
                updateDocumentField(userId, 'cpf', formData.cpf),
            ]);

            // Obtém o usuário atual do Firebase Auth
            const currentUser = auth.currentUser;
            if (currentUser) {
                dispatch({ type: 'LOGIN', payload: currentUser });
                try {
                    await syncLocalCartToFirebase(currentUser.uid);
                } catch (syncError) {
                    setError('Ocorreu um erro ao sincronizar o carrinho. Por favor, tente novamente.');
                    return;
                }
            }

            if (onComplete) {
                onComplete();
            }
            
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ocorreu um erro ao salvar as informações.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={ handleSubmit } className="w-full max-w-lg mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 rounded-xl bg-white shadow-sm">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#333333]">Complete seu cadastro</h2>
                <p className="text-gray-600 mt-2">Precisamos de algumas informações adicionais</p>
            </div>

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

            <div className="pt-2 sm:pt-4">
                <Button 
                    type="submit" 
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
                    disabled={ isLoading }
                >
                    { isLoading ? 'Salvando...' : 'Concluir Cadastro' }
                </Button>
            </div>

            { error && (
                <div className="rounded-lg bg-red-50 p-3 sm:p-4 mt-4">
                    <p className="text-red-600 text-sm sm:text-base text-center font-medium">
                        { error }
                    </p>
                </div>
            ) }
        </form>
    );
}
