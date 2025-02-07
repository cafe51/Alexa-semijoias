// src/app/components/LoadingBar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configuração do NProgress (spinner desabilitado e velocidade definida)
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function LoadingBar() {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
        };
    }, [pathname]);

    return null;
}
