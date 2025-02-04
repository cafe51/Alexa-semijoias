'use client';

import { FaWhatsapp } from 'react-icons/fa';

interface ShareSectionProps {
    url: string;
}

export default function ShareSection({ url }: ShareSectionProps) {
    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto my-8 px-4 bg-white p-4 rounded">
            <button
                onClick={ handleWhatsAppShare }
                className="text-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-4 w-full"
                aria-label="Compartilhar no WhatsApp"
            >
                <span className="text-gray-600">Compartilhe esta peça</span>

                <FaWhatsapp size={ 24 } />
            </button>

        </div>
    );
}
