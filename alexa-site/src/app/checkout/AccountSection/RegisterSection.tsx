// app/checkout/AccountSection/AccountSection.tsx

import { useState } from 'react';
import InputField from '../AddressSection/InputField';

interface RegisterSectionProps {
  setShowRegister: (isLogin: boolean) => void;
}

export default function RegisterSection({ setShowRegister }: RegisterSectionProps) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <section className="border p-4 rounded-md shadow-md bg-white">


            <div className='flex justify-between w-full'>

                <p className="font-bold">Cadastro</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                    onClick={ () => setShowRegister(false) }
                >
                Fazer login
                </p>
            </div>


            <div className='flex flex-col w-full p-2'>
                <InputField
                    id="nome"
                    value={ nome }
                    onChange={ (e) => setNome(e.target.value) }
                    label="Nome"
                />
                <InputField
                    id="email"
                    value={ email }
                    onChange={ (e) => setEmail(e.target.value) }
                    label="Email"
                />
                <InputField
                    id="telefone"
                    value={ telefone }
                    onChange={ (e) => setTelefone(e.target.value) }
                    label="Telefone"
                />
                <InputField
                    id="password"
                    type='password'
                    value={ password }
                    onChange={ (e) => setPassword(e.target.value) }
                    label="Password"
                />
                <InputField
                    id="confirmPassword"
                    type='password'
                    value={ confirmPassword }
                    onChange={ (e) => setConfirmPassword(e.target.value) }
                    label="ConfirmPassword"
                />

                <button className="w-full bg-green-500 text-white p-2 rounded">
              Continuar
                </button>
            </div>
            

        </section>
    );
}