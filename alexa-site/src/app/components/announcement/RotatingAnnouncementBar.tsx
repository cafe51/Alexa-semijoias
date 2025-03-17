'use client';
import React, { useState, useEffect } from 'react';

export interface Announcement {
  id: string | number;
  text: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  transitionTime?: number; // tempo de exibição em milissegundos para este anúncio
}

const announcements: Announcement[] = [
    {
        id: 1,
        text: <p><strong>Frete grátis</strong> acima de <strong>R$ 250,00</strong> para o sudeste</p>,
        backgroundColor: '#F8C3D3',
        textColor: '#923B58',
        transitionTime: 3000,
    },
    {
        id: 2,
        text: <p><strong> 10% de desconto </strong> com o cupom <strong>SEJALEXA10</strong></p>,
        backgroundColor: '#F8C3D3',
        textColor: '#923B58',
        transitionTime: 3000,
    },
];

interface RotatingAnnouncementBarProps {
  defaultTransitionTime?: number; // tempo padrão (ms) se o anúncio não definir
}

const RotatingAnnouncementBar: React.FC<RotatingAnnouncementBarProps> = ({
    defaultTransitionTime = 5000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBar, setShowBar] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detecta o tamanho da tela para definir se é mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Controla a exibição da barra de promoção com base na posição do scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset <= 40) {
                setShowBar(true);
            } else {
                setShowBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Verifica o estado inicial
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Alterna os anúncios com timeout (fazendo a transição para o próximo)
    useEffect(() => {
        const transitionTime =
      announcements[currentIndex]?.transitionTime || defaultTransitionTime;
        const timeout = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, transitionTime);

        return () => clearTimeout(timeout);
    }, [currentIndex, defaultTransitionTime]);

    const currentAnnouncement = announcements[currentIndex];
    // Define a altura de acordo com o tamanho da tela
    const barHeight = isMobile ? '30px' : '40px';
    return (
        <div
            className="relative top-0 left-0 right-0 z-50 transition-all duration-150 overflow-hidden text-sm md:text-base text-center h-10"
            style={ {
                height: showBar ? barHeight : '0px',
                opacity: showBar ? 1 : 0,
                backgroundColor: currentAnnouncement.backgroundColor || '#F8C3D3',
                color: currentAnnouncement.textColor || '#923B58',
            } }
        >
            <div className="p-2 py-0 pt-1 md:py-2">{ currentAnnouncement.text }</div>
        </div>
    );
};

export default RotatingAnnouncementBar;
