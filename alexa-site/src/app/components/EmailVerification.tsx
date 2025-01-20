import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { sendEmailVerification } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, Inbox, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmailVerificationProps {
  email: string;
  onBackToLogin?: () => void;
}

const EmailVerification = ({ email, onBackToLogin }: EmailVerificationProps) => {
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        startCooldown();
    }, []);

    const startCooldown = () => {
        setCooldown(60);
        const timer = setInterval(() => {
            setCooldown((current) => {
                if (current <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
    };

    const handleResendVerification = async() => {
        if (cooldown > 0) return;
    
        try {
            setSending(true);
            setError(null);
            const currentUser = auth.currentUser;
      
            if (currentUser) {
                await sendEmailVerification(currentUser);
                setSuccessMessage('success');
                startCooldown();
            } else {
                setError('Usuário não encontrado. Por favor, faça login novamente.');
            }
        } catch (err) {
            setError('Erro ao enviar email de verificação. Por favor, tente novamente mais tarde.');
        } finally {
            setSending(false);
        }
    };

    const renderSuccessMessage = () => (
        <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800 flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Email de verificação enviado com sucesso!
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
                <p className="text-green-700">
                    Por favor, verifique sua caixa de entrada para confirmar seu email.
                </p>
                <div className="flex items-start gap-2 p-2 bg-green-100 rounded-md">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                        Não encontrou o email? Verifique suas pastas de{ ' ' }
                        <span className="font-semibold text-amber-600">spam</span> ou{ ' ' }
                        <span className="font-semibold text-amber-600">lixo eletrônico</span>
                    </p>
                </div>
            </AlertDescription>
        </Alert>
    );

    return (
        <div className="space-y-6">
            <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                <AlertTitle className="text-lg text-center font-semibold text-amber-800">
                    Verificação de Email Necessária
                </AlertTitle>
                <AlertDescription className="mt-2 text-amber-700">
                    <p>Para sua segurança, precisamos que você verifique seu email antes de fazer login.</p>
                    <p className="mt-2">Um link de confirmação foi enviado para: <strong>{ email }</strong></p>
                    <p className="mt-2">Por favor, verifique sua caixa de entrada e pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.</p>
                </AlertDescription>
            </Alert>

            { error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-700">
                        { error }
                    </AlertDescription>
                </Alert>
            ) }

            { successMessage && renderSuccessMessage() }

            <div className="flex flex-col gap-4 justify-center items-center">
                <Button
                    onClick={ handleResendVerification }
                    disabled={ sending || cooldown > 0 }
                    className="w-full sm:w-auto bg-[#C48B9F] hover:bg-[#D4AF37] text-white disabled:opacity-50"
                >
                    { cooldown > 0 ? (
                        <span className="flex items-center gap-2">
                            <Clock size={ 16 } />
                            Reenviar Email de Verificação { cooldown }s
                        </span>
                    ) : sending ? (
                        'Enviando...'
                    ) : (
                        'Reenviar Email de Verificação'
                    ) }
                </Button>
        
                <Button
                    onClick={ onBackToLogin ? onBackToLogin : () => { router.push('/login'); } }
                    variant="outline"
                    className="w-full sm:w-auto border-[#C48B9F] text-[#C48B9F] hover:bg-[#C48B9F] hover:text-white"
                >
                    { onBackToLogin ? 'Voltar para Login' : 'Ir para sua conta' }
                </Button>
            </div>

            <div className="text-sm text-gray-600 text-center mt-4">
                <p>Após confirmar seu email, volte para esta página e faça login normalmente.</p>
            </div>
        </div>
    );
};

export default EmailVerification;