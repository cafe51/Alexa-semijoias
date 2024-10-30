import React from 'react';
import {
    Droplet,
    Sun,
    Wind,
    Sparkles,
    AlertTriangle,
    Heart,
    Phone,
    Mail,
    Instagram,
    Facebook,
    LucideProps,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const TipCard = ({ Icon, title, content }: { Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>, title: string, content: string }) => (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center text-center">
        <CardHeader className="flex flex-col items-center py-6">
            <Icon className="w-12 h-12 md:w-14 md:h-14 text-[#D4AF37] mb-4" />
            <CardTitle className="text-lg md:text-xl font-semibold text-[#333333]">{ title }</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <p className="text-base text-[#333333] leading-relaxed">{ content }</p>
        </CardContent>
    </Card>
);

const CareSection = () => {
    const tips = [
        { Icon: Droplet, title: 'Evite Contato com Água', content: 'Remova suas joias antes de nadar, tomar banho ou lavar as mãos para preservar o folheado.' },
        { Icon: Sun, title: 'Proteja do Sol', content: 'Evite exposição prolongada ao sol, pois pode afetar o brilho e a cor das suas peças.' },
        { Icon: Wind, title: 'Guarde Adequadamente', content: 'Armazene suas joias separadamente em locais secos para evitar arranhões e oxidação.' },
        { Icon: Sparkles, title: 'Limpeza Suave', content: 'Use um pano macio e seco para limpar suas joias. Evite produtos químicos agressivos.' },
        { Icon: AlertTriangle, title: 'Cuidado com Produtos', content: 'Aplique perfumes e cremes antes de colocar suas joias para evitar danos ao folheado.' },
        { Icon: Heart, title: 'Uso Consciente', content: 'Alterne suas peças favoritas para prolongar a vida útil de todas as suas joias.' },
    ];

    return (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Cuidados Essenciais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                { tips.map((tip, index) => (
                    <div key={ index }>
                        <TipCard { ...tip } />
                    </div>
                )) }
            </div>
        </section>
    );
};

const FAQSection = () => {
    const faqs = [
        { question: 'Com que frequência devo limpar minhas semijoias?', answer: 'Recomenda-se limpar suas semijoias suavemente após cada uso com um pano macio e seco. Uma limpeza mais profunda pode ser feita mensalmente ou quando necessário.' },
        { question: 'Posso usar minhas semijoias na praia ou piscina?', answer: 'Não é recomendado. O cloro, sal e areia podem danificar o folheado. Retire suas joias antes de entrar na água ou praticar atividades na praia.' },
        { question: 'Como guardar minhas semijoias corretamente?', answer: 'Guarde cada peça separadamente em saquinhos de tecido ou em uma caixa de joias com compartimentos. Mantenha em local seco e longe da luz direta do sol.' },
        { question: 'É normal que semijoias escureçam com o tempo?', answer: 'Sim, é normal que ocorra uma leve oxidação. Uma limpeza regular e armazenamento adequado podem retardar esse processo.' },
        { question: 'Posso dormir com minhas semijoias?', answer: 'Não é recomendado. Dormir com joias pode causar desgaste prematuro, além de riscos de enroscar em roupas ou lençóis.' },
    ];

    return (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-[#F8C3D3] bg-opacity-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
                { faqs.map((faq, index) => (
                    <AccordionItem key={ index } value={ `item-${index}` } className="bg-white rounded-lg px-6">
                        <AccordionTrigger className="text-lg md:text-xl text-[#333333] hover:text-[#D4AF37] font-medium py-4">
                            { faq.question }
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-[#333333] pb-4 leading-relaxed">
                            { faq.answer }
                        </AccordionContent>
                    </AccordionItem>
                )) }
            </Accordion>
        </section>
    );
};

const AdditionalTipsSection = () => {
    const additionalTips = [
        'Evite usar suas semijoias durante atividades físicas intensas ou trabalhos domésticos.',
        'Aplique maquiagem e perfume antes de colocar suas joias para evitar contato direto com produtos químicos.',
        'Guarde suas semijoias em ambientes com baixa umidade para prevenir oxidação.',
        'Use suas joias regularmente, pois o contato com o ar pode ajudar a preservar o folheado.',
        'Evite o contato das suas semijoias com produtos de limpeza, cloro e outros químicos agressivos.',
    ];

    return (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-[#FAF9F6]">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Dicas Adicionais</h2>
            <ul className="list-disc max-w-3xl mx-auto space-y-6 px-8">
                { additionalTips.map((tip, index) => (
                    <li key={ index } className="text-lg text-[#333333] leading-relaxed">{ tip }</li>
                )) }
            </ul>
        </section>
    );
};

const ContactSection = () => {
    const contactMethods = [
        { icon: Phone, method: 'WhatsApp', contact: '(11) 98765-4321', link: 'https://wa.me/5511987654321' },
        { icon: Phone, method: 'Telefone', contact: '(11) 3456-7890', link: 'tel:+551134567890' },
        { icon: Mail, method: 'E-mail', contact: 'contato@suajoalheria.com', link: 'mailto:contato@suajoalheria.com' },
        { icon: Instagram, method: 'Instagram', contact: '@suajoalheria', link: 'https://www.instagram.com/suajoalheria' },
        { icon: Facebook, method: 'Facebook', contact: '/suajoalheria', link: 'https://www.facebook.com/suajoalheria' },
    ];

    return (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-[#C48B9F] text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Entre em Contato</h2>
            <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto leading-relaxed text-white">
                Tem mais dúvidas sobre como cuidar das suas joias ou precisa de assistência personalizada? Nossa equipe está pronta para ajudar!
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
                { contactMethods.map((method, index) => (
                    <a
                        key={ index }
                        href={ method.link }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-white text-[#333333] rounded-full px-6 py-3 hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 text-base md:text-lg"
                    >
                        <method.icon className="w-6 h-6 md:w-7 md:h-7 mr-3" />
                        <span>{ `${method.method}: ${method.contact}` }</span>
                    </a>
                )) }
            </div>
        </section>
    );
};

const TipsAndCarePage = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6]" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <header className="py-16 md:py-24 px-4 md:px-8 bg-[#D4AF37] text-white text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Dicas e Cuidados</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                    Aprenda a cuidar das suas semijoias folheadas a ouro para mantê-las brilhantes e duradouras.
                </p>
            </header>

            <CareSection />
            <FAQSection />
            <AdditionalTipsSection />
            <ContactSection />

            <footer className="py-8 px-4 bg-[#333333] text-white text-center">
                <p className="text-sm md:text-base">© 2024 Alexa Semijoias. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default TipsAndCarePage;