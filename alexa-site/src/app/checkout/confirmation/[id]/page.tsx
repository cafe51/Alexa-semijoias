//app/checkout/confirmation/[id]/page.tsx

export default function Confirmation({ params }: { params: { id: string } }) {
    return (
        'olá' + params
    );
}