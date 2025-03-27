// src/app/admin/pedidos/pixPaymentSection/PixPayment.tsx

import { useState, useEffect } from 'react';
import ExpiredMessageComponent from './ExpiredMessageComponent';
import QrCodePaymentComponent from './QrCodePaymentComponent';
import { OrderType } from '@/app/utils/types';

const TIME_TO_EXPIRE = 33;

interface PixPaymentProps {
    qrCodeBase64: string;
    pixKey: string;
    startDate: Date;
    orderStatus: OrderType['status'];
    cancelStatus: () => void;
}

export default function PixPayment({
    qrCodeBase64,
    pixKey,
    startDate,
    orderStatus,
    cancelStatus,
}: PixPaymentProps) {
    // Estado simplificado
    const [isActive, setIsActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(() => {
        const now = new Date();
        const diff = TIME_TO_EXPIRE * 60 - Math.floor((now.getTime() - startDate.getTime()) / 1000);
        const initialTime = Math.max(0, diff);
        
        // Se já começa expirado
        if (initialTime === 0) {
            setIsActive(false);
        }
        
        return initialTime;
    });
    const [copied, setCopied] = useState(false);

    // Debug
    useEffect(() => {
        if(!isActive) {
            cancelStatus();
        }
    }, [isActive]);

    // Efeito para gerenciar o tempo
    useEffect(() => {
        if (!isActive) {
            return;
        }

        if(orderStatus === 'cancelado') {
            setIsActive(false);
            setTimeLeft(0);
            return;
        }

        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = TIME_TO_EXPIRE * 60 - Math.floor((now.getTime() - startDate.getTime()) / 1000);
            const newTimeLeft = Math.max(0, diff);
            
            if (newTimeLeft === 0 && isActive) {
                clearInterval(intervalId);
                setIsActive(false);
                setTimeLeft(0);
                cancelStatus();
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isActive, startDate, cancelStatus, orderStatus]);

    const copyToClipboard = async() => {
        try {
            await navigator.clipboard.writeText(pixKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Falha ao copiar a chave PIX: ', error);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const progress = (timeLeft / (TIME_TO_EXPIRE * 60)) * 100;

    try {
        return (
            <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md max-w-xs mx-auto">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Pagamento via PIX</h2>
                { isActive ? (
                    <QrCodePaymentComponent
                        qrCodeBase64={ qrCodeBase64 }
                        timeLeft={ timeLeft }
                        formatTime={ formatTime }
                        progress={ progress }
                        pixKey={ pixKey }
                        copyToClipboard={ copyToClipboard }
                        copied={ copied }
                    />
                ) : (
                    <ExpiredMessageComponent />
                ) }
            </div>
        );
    } catch (error) {
        console.error('Erro na renderização:', error);
        return (
            <div className="text-red-500">
                Erro ao renderizar o componente de pagamento
            </div>
        );
    }
}
