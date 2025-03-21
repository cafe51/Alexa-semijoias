import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FAQSection({ faqs }: {faqs: {question: string, answer: string}[]}) {
    return (
        <section className="py-16 md:py-24 px-6 md:px-8 bg-white">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-[#333333] mb-4 md:my-12">Perguntas Frequentes</h1>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                { faqs.map((faq, index) => (
                    <AccordionItem key={ index } value={ `faq-${index}` }>
                        <AccordionTrigger className="text-lg md:text-xl text-[#333333] hover:text-[#D4AF37] p-6">
                            <div className="flex items-center">
                                <HelpCircle className="w-6 h-6 md:w-7 md:h-7 mr-3 text-[#D4AF37] flex-shrink-0" />
                                { faq.question }
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4">
                            <p className="text-base md:text-lg text-[#333333]">{ faq.answer }</p>
                        </AccordionContent>
                    </AccordionItem>
                )) }
            </Accordion>
        </section>
    );
}