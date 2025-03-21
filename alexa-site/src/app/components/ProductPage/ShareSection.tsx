'use client';

import { FaWhatsapp } from 'react-icons/fa';

interface ShareSectionProps {
    url: string;
    callToAction: string;
}

export default function ShareSection({ url, callToAction }: ShareSectionProps) {
    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="rounded">
            <button
                onClick={ handleWhatsAppShare }
                className=" hover:text-green-600 transition-colors flex items-center justify-center gap-2 md:gap-4 w-full"
                aria-label="Compartilhar no WhatsApp"
            >
                <span className="">{ callToAction }</span>

                <FaWhatsapp size={ 24 } />
            </button>

        </div>
    );
}
