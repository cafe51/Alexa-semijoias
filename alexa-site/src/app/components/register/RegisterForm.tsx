// app/components/RegisterForm.tsx
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSignUp } from '../../hooks/useSignUp';
import LargeButton from '../LargeButton';
import InputField from '../../checkout/AddressSection/InputField';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
    loadingButton: boolean
    setLoadingButton: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterForm({ loadingButton, setLoadingButton }: RegisterFormProps) {
    const { signup, error } = useSignUp();
    const router = useRouter();

    const [loadingComponent, setLoadingComponent] = useState(true);
    const [registerErrorMessage, setRegisterErrorMessage] = useState('');
    const [registerValues, setRegisterValues] = useState({
        nome: '',
        email: '',
        tel: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        setLoadingButton(false);
        setLoadingComponent(false);
    }, []);

    const validateForm = () => {
        const { nome, email, tel, password, confirmPassword } = registerValues;
        const errors = {} as any;

        if (!nome) errors.nome = 'Nome completo é obrigatório';
        if (!email) errors.email = 'Email é obrigatório';
        if (!password) errors.password = 'Senha é obrigatória';
        if (password && password.length < 6) errors.password = 'A senha deve ter no mínimo 6 caracteres';
        if (password !== confirmPassword) errors.confirmPassword = 'As senhas devem ser iguais';
        if (tel && !/^\d+$/.test(tel)) errors.tel = 'Telefone deve conter apenas números';

        return errors;
    };

    const isButtonDisabled = () => {
        const errors = validateForm();
        return Object.keys(errors).length > 0;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingButton(true);
        setRegisterErrorMessage('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setRegisterErrorMessage('Preencha todos os campos corretamente.');
            setLoadingButton(false);
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...dataObj } = registerValues;
            await signup(dataObj);

        } catch (error) {
            if (error instanceof Error) {
                setRegisterErrorMessage(error.message);
            } else {
                setRegisterErrorMessage('Erro desconhecido ao cadastrar');
            }
        } finally {
            setLoadingButton(false);
            router.push('/');
        }
    };


    return (
        <form 
            className='flex flex-col gap-4 items-center' 
            method="post" 
            onSubmit={ handleSubmit }
        >
            <InputField
                id='nome'
                label={ loadingComponent ? '' : 'Nome Completo' }
                disabled={ loadingComponent }
                minLength={ 8 }
                maxLength={ 32 }
                value={ registerValues.nome }
                onChange={ handleChange }
                required={ true }
            />
            <InputField
                id='email'
                type="email"
                label={ loadingComponent ? '' : 'Email' }
                disabled={ loadingComponent }
                minLength={ 8 }
                maxLength={ 32 }
                value={ registerValues.email }
                onChange={ handleChange }
                required={ true }
            />
            <InputField
                id='tel'
                type='tel'
                label={ loadingComponent ? '' : 'Telefone' }
                disabled={ loadingComponent }
                minLength={ 8 }
                maxLength={ 16 }
                value={ registerValues.tel }
                onChange={ handleChange }
            />
            <InputField
                id='password'
                type="password"
                label={ loadingComponent ? '' : 'Senha' }
                disabled={ loadingComponent }
                minLength={ 6 }
                maxLength={ 16 }
                value={ registerValues.password }
                onChange={ handleChange }
                required={ true }
            />
            <InputField
                id='confirmPassword'
                type="password"
                label={ loadingComponent ? '' : 'Confirme a senha' }
                disabled={ loadingComponent }
                minLength={ 6 }
                maxLength={ 16 }
                value={ registerValues.confirmPassword }
                onChange={ handleChange }
                required={ true }
            />
            { registerErrorMessage && (
                <p className="text-red-600" aria-live="assertive">
                    { registerErrorMessage }
                </p>
            ) }
            <LargeButton color='green' disabled={ isButtonDisabled() } loadingButton={ loadingButton } type='submit'>
                Cadastre-se
            </LargeButton>
            { error && <p className='text-red-500'>{ error }</p> }
        </form>
    );
}