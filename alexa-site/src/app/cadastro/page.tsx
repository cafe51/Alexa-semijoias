'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ImSpinner9 } from 'react-icons/im';
// import { RegisterFormInputType } from '../utils/types';
import { registerRequestApi } from '../utils/api';


// Esquema de validação usando Yup
const schema = yup.object().shape({
    nome: yup.string().required('Nome completo é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    tel: yup.string().matches(/^\d+$/, 'Telefone deve conter apenas números').optional(),
    password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), undefined], 'As senhas devem ser iguais').required('Confirmação de senha é obrigatória'),
    recaptcha: yup.string().required('Por favor, verifique que você não é um robô'),
});

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter(); // Certifique-se de criar uma instância do useRouter

    const [loading, setLoading] = useState(false);
    const [registerErrorMessage, setRegisterErrorMessage] = useState('');

    const onSubmit = async(data: any) => {
        setLoading(true);
        setRegisterErrorMessage('');

        try {
            const dataObj = {
                password: data.password,
                email: data.email,
                nome: data.nome,
                tel: data.tel,
            };

            await registerRequestApi(dataObj);
            // Simulação da chamada à API de registro
            // await registerRequestApi(data);

            // Redirecionamento após sucesso
            router.push('/');
        } catch (error) {
            console.log('Erro no registro: ', error);
            setRegisterErrorMessage('Erro ao registrar. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='flex flex-col gap-10 items-center self-center justify-center w-full h-full secColor md:w-2/5'>
            <h1>Cadastre-se</h1>
            <form 
                className='flex flex-col gap-8' 
                onSubmit={ handleSubmit(onSubmit) }
            >
                <label className='flex flex-col gap-1' htmlFor="nome">
                    <span>NOME COMPLETO</span>
                    <input
                        type="text"
                        className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                        placeholder="ex: Maria Perez"
                        { ...register('nome') }
                    />
                    { errors.nome && <p className="text-red-600">{ errors.nome.message }</p> }
                </label>
                <label className='flex flex-col gap-1' htmlFor="email">
                    <span>E-MAIL</span>
                    <input
                        type="email"
                        className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                        placeholder="ex: seuemail@email.com.br"
                        { ...register('email') }
                    />
                    { errors.email && <p className="text-red-600">{ errors.email.message }</p> }
                </label>
                <label className='flex flex-col gap-1' htmlFor="tel">
                    <span>TELEFONE (OPCIONAL)</span>
                    <input
                        type="text"
                        className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                        placeholder="ex: 11971923030"
                        { ...register('tel') }
                    />
                    { errors.tel && <p className="text-red-600">{ errors.tel.message }</p> }
                </label>
                <label className='flex flex-col gap-1' htmlFor="password">
                    <span>SENHA</span>
                    <input
                        type="password"
                        className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                        placeholder="*******"
                        { ...register('password') }
                    />
                    { errors.password && <p className="text-red-600">{ errors.password.message }</p> }
                </label>
                <label className='flex flex-col gap-1' htmlFor="confirmPassword">
                    <span>CONFIRMAR SENHA</span>
                    <input
                        type="password"
                        className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                        placeholder="*******"
                        { ...register('confirmPassword') }
                    />
                    { errors.confirmPassword && <p className="text-red-600">{ errors.confirmPassword.message }</p> }
                </label>

                <div>
                    <input
                        type="checkbox"
                        { ...register('recaptcha', { required: true }) }
                    />
                    <label htmlFor="recaptcha">Não sou um robô</label>
                </div>

                { registerErrorMessage && (
                    <p className="text-red-600" aria-live="assertive">
                        { registerErrorMessage }
                    </p>
                ) }

                <button
                    className={ `${loading ? 'bg-gray-300' : 'bg-green-700'} p-3 text-white flex justify-center text-center rounded w-full shadow-sm` }
                    type="submit"
                    disabled={ loading }
                >
                    { loading ? (
                        <ImSpinner9 className="text-gray-500 animate-spin" />
                    ) : (
                        'CADASTRE-SE'
                    ) }
                </button>
            </form>
            <div>
                <p>Já possui uma conta? <a className='text-blue-500' href="/login">Iniciar sessão</a></p>
            </div>
        </section>
    );
}
