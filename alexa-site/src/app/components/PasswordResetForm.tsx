// app/components/PasswordResetForm.tsx
'use client';
import { useState } from 'react';
import { usePasswordReset } from '../hooks/usePasswordReset';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const { resetPassword, error, success } = usePasswordReset();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        await resetPassword(email);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Recuperação de Senha</h2>
            <form onSubmit={ handleSubmit } className="flex flex-col">
                <label htmlFor="email" className="mb-2 font-medium">E-mail</label>
                <input
                    type="email"
                    id="email"
                    value={ email }
                    onChange={ (e) => setEmail(e.target.value) }
                    required
                    className="p-2 border border-gray-400 rounded mb-4"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Enviar e-mail de recuperação
                </button>
            </form>

            { success && <p className="mt-4 text-green-600">{ success }</p> }
            { error && <p className="mt-4 text-red-600">{ error }</p> }
        </div>
    );
};

export default PasswordResetForm;
