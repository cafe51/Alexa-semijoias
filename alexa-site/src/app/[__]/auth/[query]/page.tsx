'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ConfirmEmail from '@/app/components/ConfirmEmail';
import ResetPassword from '@/app/components/ResetPassword';
import { useEffect } from 'react';

interface AuthActionPageProps {
    params: {
        __: string;
        query: string;
    }
}

export default function AuthActionPage({ params }: AuthActionPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtendo os parâmetros da query string
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        console.log('Path parameter __:', params.__);
        console.log('Route parameter query:', params.query); // Será 'action'
        console.log('Query string mode:', mode);
        console.log('Query string oobCode:', oobCode);
        
        // Se quiser ver todos os parâmetros da query string
        console.log('All search params:', Object.fromEntries(searchParams.entries()));
    }, [params, searchParams, mode, oobCode]);

    if (!mode || !oobCode) {
        router.push('/');
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md p-6 bg-white border border-gray-300 shadow-lg rounded-lg text-center">
                { mode === 'verifyEmail' && <ConfirmEmail oobCode={ oobCode } /> }
                { mode === 'resetPassword' && <ResetPassword oobCode={ oobCode } /> }
            </div>
        </div>
    );
}