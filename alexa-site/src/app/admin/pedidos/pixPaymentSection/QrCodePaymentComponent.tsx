// src/app/admin/pedidos/pixPaymentSection/QrCodePaymentComponent.tsx

import { Progress } from '@/components/ui/progress';
import { ClipboardIcon } from 'lucide-react';
import Image from 'next/image';

interface QrCodePaymentComponentProps {
    qrCodeBase64: string;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    progress: number;
    pixKey: string;
    copyToClipboard: () => void;
    copied: boolean;
  }
  
export default function QrCodePaymentComponent({
    qrCodeBase64,
    timeLeft,
    formatTime,
    progress,
    pixKey,
    copyToClipboard,
    copied,
}: QrCodePaymentComponentProps) {
    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className='rounded-lg relative w-64 h-64'>
                    <Image
                        className='rounded-lg object-cover scale-100'
                        src={ `data:image/png;base64,${qrCodeBase64}` }
                        alt="QR Code para pagamento"
                        sizes="2000px"
                        fill
                    />
                </div>
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
        </>
    );
}