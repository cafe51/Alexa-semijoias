import React from 'react';
import { Shield, AlertCircle, CheckCircle, XCircle, Clock, RefreshCcw, CreditCard, HelpCircle, LucideProps } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const WarrantyHeader = () => (
    <header className="py-16 md:py-24 px-6 md:px-8 bg-[#D4AF37] text-white text-center">
        <Shield className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Política de Garantia</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Entenda nossa política de garantia e como protegemos suas joias preciosas.
        </p>
    </header>
);

interface WarrantyCoverageProps {
    title: string;
    items: string[];
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
    bgColor: string;
}

const WarrantyCoverage = ({ title, items, Icon: Icon, bgColor }: WarrantyCoverageProps) => (
    <Card className={ `${bgColor} shadow-lg hover:shadow-xl transition-shadow duration-300` }>
        <CardHeader className="flex flex-col items-center p-8">
            <Icon className="w-16 h-16 text-white mb-4" />
            <CardTitle className="text-2xl font-bold text-center text-white">{ title }</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
            <ul className="list-disc pl-6 text-white space-y-3">
                { items.map((item, index) => (
                    <li key={ index } className="text-lg">{ item }</li>
                )) }
            </ul>
        </CardContent>
    </Card>
);

const WarrantyCoverageSection = () => {
    const coverageData = {
        covered: [
            'Peças com defeitos que ocorreram no processo de fabricação',
            'Casos em que o banho da peça apresentou descascamento, total ou parcial',
            'Fechos que se quebraram ou racharam',
        ],
        notCovered: [
            'Escurecimento devido à sujeira acumulada',
            'Quebras por impacto',
            'Peças que estejam faltando partes',
            'Arranhões causados por uso inadequado',
            'Danos por rompimento',
            'Amassados',
            'Alteração de cor, como tom avermelhado',
            'Pedras que ficaram opacas ou perderam o brilho',
            'Desgaste excessivo pelo uso contínuo',
            'Descolamento ou escurecimento da resina',
        ],
    };

    return (
        <section className="py-16 md:py-24 px-6 md:px-8 bg-[#FAF9F6]">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Cobertura da Garantia</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-7xl mx-auto">
                <div className="w-full lg:w-5/12">
                    <WarrantyCoverage 
                        title="O que nossa garantia cobre" 
                        items={ coverageData.covered } 
                        Icon={ CheckCircle } 
                        bgColor="bg-[#C48B9F]"
                    />
                </div>
                <div className="w-full lg:w-5/12">
                    <WarrantyCoverage 
                        title="O que não está coberto pela garantia" 
                        items={ coverageData.notCovered } 
                        Icon={ XCircle } 
                        bgColor="bg-[#F8C3D3]"
                    />
                </div>
            </div>
        </section>
    );
};

const WarrantyPolicySection = () => {
    const policyItems = [
        { 
            title: 'Prazo da Garantia', 
            content: 'O prazo da garantia é de 12 (doze) meses, contando a partir da data indicada no certificado de garantia, que deve ser apresentado junto com a peça.',
            icon: Clock,
        },
        { 
            title: 'Cobertura', 
            content: 'A cobertura será aplicada apenas para defeitos que sejam claramente de fabricação. Danos causados por mau uso não estão cobertos pela garantia.',
            icon: Shield,
        },
        { 
            title: 'Prazo de Avaliação', 
            content: 'Nosso prazo para avaliação e resposta ao cliente é de até 30 (trinta) dias, conforme previsto no Código de Defesa do Consumidor.',
            icon: AlertCircle,
        },
        { 
            title: 'Reparação ou Substituição', 
            content: 'Em caso de defeito de fabricação confirmado, a peça poderá ser reparada ou substituída por outra semelhante, se o modelo já não estiver mais em linha.',
            icon: RefreshCcw,
        },
        { 
            title: 'Vale Compras', 
            content: 'Se não for possível a reposição dentro do prazo, devolveremos o valor da peça.',
            icon: CreditCard,
        },
        { 
            title: 'Recusa de Troca', 
            content: 'Trocas não serão autorizadas se o problema for decorrente de mau uso ou desgaste natural.',
            icon: XCircle,
        },
    ];

    return (
        <section className="py-16 md:py-24 px-6 md:px-8 bg-[#F8C3D3] bg-opacity-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Detalhes da Política de Garantia</h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                { policyItems.map((item, index) => (
                    <AccordionItem key={ index } value={ `item-${index}` }>
                        <AccordionTrigger className="text-lg md:text-xl text-[#333333] hover:text-[#D4AF37] p-6">
                            <div className="flex items-center">
                                <item.icon className="w-6 h-6 md:w-7 md:h-7 mr-3 text-[#D4AF37]" />
                                { item.title }
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-[#333333] px-6 py-4">
                            { item.content }
                        </AccordionContent>
                    </AccordionItem>
                )) }
            </Accordion>
        </section>
    );
};

const WarrantyNote = () => (
    <div className="bg-[#D4AF37] text-white p-8 md:p-10 rounded-lg max-w-3xl mx-auto my-16">
        <div className="flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mr-3" />
            <h3 className="text-2xl md:text-3xl font-semibold">Atenção</h3>
        </div>
        <p className="text-lg md:text-xl text-center leading-relaxed">
            Lembramos que peças adquiridas em promoção não são elegíveis para trocas ou garantia.
        </p>
    </div>
);

const FAQSection = () => {
    const faqs = [
        { 
            question: 'Como faço para acionar a garantia?', 
            answer: 'Para acionar a garantia, entre em contato com nosso atendimento ao cliente através do e-mail ou telefone fornecidos em nossa página de contato. Tenha em mãos o certificado de garantia e a nota fiscal da compra.', 
        },
        { 
            question: 'Posso estender o prazo da garantia?', 
            answer: 'Atualmente, não oferecemos extensão do prazo de garantia além dos 12 meses padrão. Recomendamos seguir nossas dicas de cuidados para prolongar a vida útil de suas joias.', 
        },
        { 
            question: 'A garantia cobre envio para reparo?', 
            answer: 'Sim, os custos de envio para reparo de itens cobertos pela garantia são de nossa responsabilidade. Forneceremos instruções detalhadas sobre como proceder com o envio após a aprovação do acionamento da garantia.', 
        },
    ];

    return (
        <section className="py-16 md:py-24 px-6 md:px-8 bg-[#FAF9F6]">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#333333] mb-12">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                { faqs.map((faq, index) => (
                    <AccordionItem key={ index } value={ `faq-${index}` }>
                        <AccordionTrigger className="text-lg md:text-xl text-[#333333] hover:text-[#D4AF37] p-6">
                            <div className="flex items-center">
                                <HelpCircle className="w-6 h-6 md:w-7 md:h-7 mr-3 text-[#D4AF37]" />
                                { faq.question }
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-[#333333] px-6 py-4">
                            { faq.answer }
                        </AccordionContent>
                    </AccordionItem>
                )) }
            </Accordion>
        </section>
    );
};

const ContactSection = () => (
    <section className="py-16 md:py-20 px-6 md:px-8 bg-[#C48B9F] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ainda tem dúvidas?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você com qualquer questão sobre nossa garantia.
        </p>
        <Button className="bg-white text-[#C48B9F] hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 px-8 py-6 text-lg font-semibold">
            Entre em Contato
        </Button>
    </section>
);

const WarrantyPage = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6]" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <WarrantyHeader />
            <WarrantyCoverageSection />
            <WarrantyPolicySection />
            <WarrantyNote />
            <FAQSection />
            <ContactSection />
      
        </div>
    );
};

export default WarrantyPage;