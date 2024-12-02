// app/components/PasswordResetForm.tsx
'use client';

import { useState } from 'react';
import { usePasswordReset } from '../hooks/usePasswordReset';
import { Button } from '@/components/ui/button'; // Botão estilizado do Shadcn
import { Input } from '@/components/ui/input'; // Campo de entrada estilizado do Shadcn
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Alerta estilizado

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const { resetPassword, error, success } = usePasswordReset();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        await resetPassword(email);
    };

    return (
        <div className="w-full max-w-md p-6 bg-white shadow-lg border border-[#F8C3D3] rounded-lg">
            <h2 className="text-2xl font-semibold text-center text-[#333333] mb-6">
                Recuperação de Senha
            </h2>

            { success ? (
                <Alert
                    variant="default"
                    className="mt-6 border-l-4 border-green-600 bg-[#DFF6DD] text-[#333333]"
                >
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>
                        Um e-mail de recuperação foi enviado para o endereço fornecido. Verifique sua caixa de entrada.
                    </AlertDescription>
                </Alert>
            ) : (
                <form onSubmit={ handleSubmit } className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block font-medium text-[#333333] mb-2"
                        >
                            E-mail
                        </label>
                        <Input
                            type="email"
                            id="email"
                            value={ email }
                            onChange={ (e) => setEmail(e.target.value) }
                            required
                            placeholder="Digite seu e-mail"
                            className="bg-[#FAF9F6] border-[#F8C3D3] text-[#333333] focus:ring-[#D4AF37]"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#D4AF37] text-white py-2 px-4 rounded hover:bg-opacity-90"
                    >
                        Enviar e-mail de recuperação
                    </Button>
                </form>
            ) }

            { error && (
                <Alert
                    variant="destructive"
                    className="mt-6 border-l-4 border-[#C48B9F] bg-[#F8C3D3] text-[#333333]"
                >
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{ error }</AlertDescription>
                </Alert>
            ) }
        </div>
    );
};

export default PasswordResetForm;
