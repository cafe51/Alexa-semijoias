// src/app/components/LoadingBar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Opcional: você pode configurar o NProgress (velocidade, spinner, etc.)
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function LoadingBar() {
    const pathname = usePathname();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        if (previousPathname.current !== pathname) {
            // Ao detectar mudança de rota, inicia a barra de progresso
            NProgress.start();
        }
        previousPathname.current = pathname;
    }, [pathname]);

    useEffect(() => {
    // Quando a rota mudar (ou seja, a página carregar), encerra o NProgress
        NProgress.done();
    }, [pathname]);

    return null;
}
