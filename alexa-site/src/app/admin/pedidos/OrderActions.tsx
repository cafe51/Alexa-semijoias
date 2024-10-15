// src/components/OrderActions.tsx
import React, { SetStateAction } from 'react';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FireBaseDocument, OrderType, StatusType, UserType } from '@/app/utils/types';

interface OrderActionsProps {
  userInfo: (UserType & FireBaseDocument) | null;
  status: StatusType;
  pedido: OrderType & FireBaseDocument;
  setShowModalConfirmationRetryOrder: (value: SetStateAction<boolean>) => void;
}

export default function OrderActions({ userInfo, status, pedido, setShowModalConfirmationRetryOrder }: OrderActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-white text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white flex-1">
                <XCircle className="mr-2 h-4 w-4" />
        Cancelar Pedido
            </Button>
            {
                (status === 'aguardando pagamento')
                && userInfo?.userId === pedido.userId 
                && <Button className="bg-[#D4AF37] text-white hover:bg-[#C48B9F] flex-1" onClick={ () => setShowModalConfirmationRetryOrder(true) }>
                    <RefreshCw className="mr-2 h-4 w-4" />
        Refazer Pedido
                </Button>
            }

        </div>
    );
}
