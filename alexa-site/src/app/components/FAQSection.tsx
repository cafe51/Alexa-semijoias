import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';


export default function FAQSection({ faqs }: {faqs: {question: string, answer: string}[]}) {
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
}