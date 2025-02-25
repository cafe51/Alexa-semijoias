'use client';
import { Button } from '@/components/ui/button';

export const ContactSection = () => {
    const handleWhatsAppClick = (whatsapp: string) => {
        window.location.href = `https://wa.me/${whatsapp}`;
    };
    return (  
        <section className="py-16 md:py-20 px-6 md:px-8 bg-[#C48B9F] text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ainda tem dúvidas?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você com qualquer questão sobre nossa garantia.
            </p>
            <Button
                className="bg-white text-[#C48B9F] hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 px-8 py-6 text-lg font-semibold"
                onClick={ () => handleWhatsAppClick('5517981650632') }
            >
            Entre em Contato
            </Button>
        </section>
    );
};

export default ContactSection;