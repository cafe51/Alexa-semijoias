'use client';

import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  /** URL público do vídeo (Firebase Storage, CDN, etc.) */
  src: string;
  /** URL da imagem de poster a ser exibida antes de iniciar o vídeo */
  poster?: string;
  /** Classes adicionais de Tailwind */
  className?: string;
}

export default function VideoPlayer({ src, poster, className = '' }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Para autoplay em mobile é necessário muted + playsInline
        video.muted = true;
        video.playsInline = true;

        video.play().catch((err) => {
            console.warn('Falha ao reproduzir vídeo automaticamente:', err);
        });
    }, []);

    return (
        <video
            ref={ videoRef }
            src={ src }
            poster={ poster }
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className={ `w-full h-auto object-cover ${className}` }
        />
    );
}
