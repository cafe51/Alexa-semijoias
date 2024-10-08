import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PixPaymentProps {
  qrCodeBase64: string;
  pixKey: string;
  startDate: Date;
}

const PixPayment: React.FC<PixPaymentProps> = ({
    qrCodeBase64,
    pixKey,
    startDate,
}) => {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes in seconds
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = 35 * 60 - Math.floor((now.getTime() - startDate.getTime()) / 1000);
      
            if (diff <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
                setProgress(0);
            } else {
                setTimeLeft(diff);
                setProgress((diff / (35 * 60)) * 100);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate]);

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

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md max-w-xs mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Pagamento via PIX</h2>
      
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <img 
                    src={ `data:image/png;base64,${qrCodeBase64}` } 
                    alt="QR Code para pagamento" 
                    className="w-64 h-64 object-contain"
                />
            </div>
      
            <div className="w-full mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tempo restante</span>
                    <span className={ `font-bold ${timeLeft <= 300 ? 'text-red-500' : 'text-green-500'}` }>
                        { formatTime(timeLeft) }
                    </span>
                </div>
                <Progress value={ progress } className="w-full" />
            </div>

            <p className="text-gray-600 mt-2">Chave PIX para pagamento:</p>
            <div className="flex items-center bg-gray-200 rounded-md p-2 mt-2 text-gray-800 font-mono w-full justify-between">
                <div className="overflow-hidden overflow-ellipsis">{ pixKey }</div>
                <button 
                    onClick={ copyToClipboard } 
                    className="ml-2 flex items-center bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition"
                >
                    <ClipboardIcon className="h-5 w-5" />
                </button>
            </div>

            { copied && <p className="text-green-600 mt-2">Chave PIX copiada!</p> }

            { timeLeft === 0 && (
                <p className="text-red-500 font-bold mt-4">
          Tempo expirado! Por favor, gere um novo PIX.
                </p>
            ) }
        </div>
    );
};

export default PixPayment;