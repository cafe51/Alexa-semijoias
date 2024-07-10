// app/checkout/AddressSection/ErrorMessage.tsx

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return <p className="text-red-500 text-sm">{ message }</p>;
}