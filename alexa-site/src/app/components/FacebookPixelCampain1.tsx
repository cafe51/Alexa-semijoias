// src/components/FacebookPixelCampain1.tsx
'use client';
import { useEffect } from 'react';

export default function FacebookPixelCampain1() {
    useEffect(() => {
    // Verifica se o script já existe no documento
        if (document.getElementById('fb-pixel-script')) return;

        // Cria e insere o script
        const script = document.createElement('script');
        script.id = 'fb-pixel-script';
        script.async = true;
        script.innerHTML = `
        window.fbqLoaded = true;
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;
          n = f.fbq = function(){ n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
          if(!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e); t.async = true;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '609318868723849');
        fbq('track', 'PageView');
    `;
        document.body.appendChild(script);
    }, []);

    return null;
}
