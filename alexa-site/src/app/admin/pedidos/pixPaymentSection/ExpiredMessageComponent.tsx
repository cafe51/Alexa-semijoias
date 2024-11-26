// src/app/admin/pedidos/pixPaymentSection/ExpiredMessageComponent.tsx

import { XCircleIcon } from 'lucide-react';

export default function ExpiredMessageComponent() {
    return (
        <div className="flex flex-col items-center text-center mt-4">
            <XCircleIcon className="w-16 h-16 text-red-500 mb-2" />
            <h3 className="text-lg font-bold text-red-500">O QR Code expirou!</h3>
            <p className="text-gray-600 mt-2">
                O tempo para realizar o pagamento foi excedido. Por favor, refaça o pedido.
            </p>
        </div>
    );
}
