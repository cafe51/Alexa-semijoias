// src/app/components/PixPayment.tsx
import { ClipboardIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';

interface PixPaymentProps {
  qrCodeBase64: string;
  pixKey: string;
  ticketUrl: string;
}

const PixPayment: React.FC<PixPaymentProps> = ({
    qrCodeBase64,
    pixKey,
    // ticketUrl
}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async() => {
        try {
            await navigator.clipboard.writeText(pixKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reseta a mensagem de cópia após 2 segundos
        } catch (error) {
            console.error('Falha ao copiar a chave PIX: ', error);
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md max-w-xs mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Pagamento via PIX</h2>
      
            <div className="bg-white p-4 rounded-lg shadow-md">
                <img 
                    src={ `data:image/png;base64,${qrCodeBase64}` } 
                    alt="QR Code para pagamento" 
                    className="w-64 h-64 object-contain"
                />
            </div>
      
            <p className="text-gray-600 mt-4">Chave PIX para pagamento:</p>
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

            {
                //         <a 
                //             href={ ticketUrl }
                //             target="_blank"
                //             rel="noopener noreferrer"
                //             className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                //         >
                // Ver Comprovante
                //         </a>
            }
        </div>
    );
};

export default PixPayment;
