// src/app/cadastro/complementar/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/hooks/useAuthContext';
import GoogleAdditionalInfo from '@/app/components/register/GoogleAdditionalInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingIndicator from '@/app/components/LoadingIndicator';

function ComplementarCadastroInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuthContext();
    const uid = searchParams.get('uid');

    useEffect(() => {
        if (!uid || (user && user.uid !== uid)) {
            router.push('/');
        }
    }, [uid, user, router]);

    if (!uid) {
        return <LoadingIndicator />;
    }

    return (
        <div className="bg-[#FAF9F6] flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333]">
                        Complete seu cadastro
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <GoogleAdditionalInfo userId={ uid } />
                </CardContent>
            </Card>
        </div>
    );
}

export default function ComplementarCadastro() {
    return (
        <Suspense fallback={ <LoadingIndicator /> }>
            <ComplementarCadastroInner />
        </Suspense>
    );
}
