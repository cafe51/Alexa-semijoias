import { StatusType } from './types';

export const statusButtonTextColorMap: Record<StatusType, string> = {
    'aguardando pagamento': 'text-yellow-600',
    'preparando para o envio': 'text-blue-500',
    'pedido enviado': 'text-blue-500',
    'cancelado': 'text-red-500',
    'entregue': 'text-green-500',
};