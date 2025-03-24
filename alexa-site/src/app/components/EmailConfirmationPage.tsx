'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import { CheckCircle, ArrowRight, LogIn, Gift, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConfirmationHeader = ({ isError }: { isError: boolean }) => (
    <div className="text-center mb-8">
        { isError ? (
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        ) : (
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]" />
        ) }
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-2">
            { isError ? 'Erro na Verificação' : 'E-mail Verificado com Sucesso!' }
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#C48B9F]">
            { isError ? 'Ocorreu um problema ao verificar seu e-mail' : 'Sua conta na ALEXA SEMIJOIAS está quase pronta' }
        </p>
    </div>
);

const VerificationMessage = ({ isError, errorMessage }: { isError: boolean, errorMessage: string | null }) => (
    <Card className="bg-[#FAF9F6] border-[#C48B9F] mb-8">
        <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#333333]">
                { isError ? 'Ops! Algo deu errado' : 'Parabéns!' }
            </CardTitle>
        </CardHeader>
        <CardContent>
            { isError ? (
                <p className="text-red-500 text-sm sm:text-base md:text-lg mb-4">{ errorMessage }</p>
            ) : (
                <>
                    <p className="text-[#333333] text-sm sm:text-base md:text-lg mb-4">
            Seu e-mail foi verificado com sucesso. Agora você está a um passo de desfrutar todos os benefícios de ser uma cliente ALEXA SEMIJOIAS.
                    </p>
                    <p className="text-[#333333] text-sm sm:text-base md:text-lg font-semibold">
            Para completar o processo, por favor, faça login na sua conta.
                    </p>
                </>
            ) }
        </CardContent>
    </Card>
);

interface NextStepCardProps {
    title: string;
    description: string;
    buttonText: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
}

const NextStepCard = ({ title, description, buttonText, icon: Icon, href }: NextStepCardProps) => (
    <Card className="bg-white border-[#F8C3D3] hover:border-[#D4AF37] transition-colors duration-300">
        <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333333] flex items-center">
                <Icon className="w-6 h-6 mr-2 text-[#D4AF37]" />
                { title }
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-[#333333] text-sm sm:text-base md:text-lg mb-4">{ description }</p>
            <Link href={ href }>
                <Button className="bg-[#C48B9F] hover:bg-[#D4AF37] text-white text-sm sm:text-base">
                    { buttonText } <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </Link>
        </CardContent>
    </Card>
);

const EmailConfirmationPage = ({ oobCode }: { oobCode: string }) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const confirmEmail = async() => {
            try {
                await applyActionCode(auth, oobCode);
            } catch (err) {
                setError('O link de confirmação é inválido ou expirou.');
            }
        };
        confirmEmail();
    }, [oobCode]);

    return (
        <div className="bg-[#FAF9F6] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 self-start justify-self-start">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                <ConfirmationHeader isError={ !!error } />
                <VerificationMessage isError={ !!error } errorMessage={ error } />
        
                { !error && (
                    <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#333333] mb-6 text-center">Próximos Passos</h2>
                        <div className="space-y-6 md:space-y-8">
                            <NextStepCard 
                                title="Faça Login"
                                description="Entre na sua conta para começar a explorar nossas semijoias exclusivas."
                                buttonText="Ir para Login"
                                icon={ LogIn }
                                href="/login"
                            />
                            <NextStepCard 
                                title="Explore Nossas semijoias exclusivas"
                                description="Descubra nossas últimas peças e encontre a joia perfeita para você."
                                buttonText="Ver Produtos"
                                icon={ Gift }
                                href="/produtos"
                            />
                        </div>
                    </>
                ) }
            </div>
        </div>
    );
};

export default EmailConfirmationPage;