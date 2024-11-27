import { Package } from 'lucide-react';

function addBusinessDays(startDate: Date, days: number): Date {
    const result = new Date(startDate);
    let addedDays = 0;

    while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay(); // 0 (Domingo) - 6 (Sábado)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Ignora finais de semana
            addedDays++;
        }
    }

    return result;
}

function calculateRemainingBusinessDays(startDate: Date, deliveryDays: number): number {
    const currentDate = new Date();
    const estimatedDeliveryDate = addBusinessDays(startDate, deliveryDays);

    // Contador de dias úteis restantes
    let remainingDays = 0;
    const tempDate = new Date(currentDate);

    while (tempDate < estimatedDeliveryDate) {
        tempDate.setDate(tempDate.getDate() + 1);
        const dayOfWeek = tempDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Ignora finais de semana
            remainingDays++;
        }
    }

    return Math.max(remainingDays, 0); // Garante que não haverá valores negativos
}

export default function DeliveryTimeSection({ deliveryDays, orderCreationDate }: { deliveryDays: number; orderCreationDate: Date }) {
    const remainingDays = calculateRemainingBusinessDays(orderCreationDate, deliveryDays);

    const estimatedDeliveryDate = addBusinessDays(orderCreationDate, deliveryDays);
    const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <div className="flex items-center text-sm mb-2">
                <Package className="mr-2 h-4 w-4" />
                { remainingDays > 0 ? (
                    <p className="text-gray-500">
                        Faltam <strong className="text-black">{ remainingDays } dias úteis</strong> para a entrega, estimada para <strong className="text-black">{ formattedDeliveryDate }</strong>.
                    </p>
                ) : (
                    <p className="text-gray-500">
                        Entrega estimada para <strong className="text-black">{ formattedDeliveryDate }</strong>.
                    </p>
                ) }
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-[#D4AF37] h-2.5 rounded-full"
                    style={ {
                        width: `${((deliveryDays - remainingDays) / deliveryDays) * 100}%`,
                    } }
                ></div>
            </div>
        </>
    );
}
