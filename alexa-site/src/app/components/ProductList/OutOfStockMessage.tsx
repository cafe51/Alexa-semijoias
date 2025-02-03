// app/checkout/AddressSection/OutOfStockMessage.tsx

interface OutOfStockMessageProps {
  message: React.JSX.Element;
}

export default function OutOfStockMessage({ message }: OutOfStockMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
            { message }
            <p className="text-xs text-center text-gray-600 mt-2">Mas estamos trabalhando para repor o estoque</p>
        </div>
    );
}