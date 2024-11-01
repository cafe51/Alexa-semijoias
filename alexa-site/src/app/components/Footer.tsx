'use client';
import { Facebook, Instagram, Twitter, Mail, Phone, LucideProps } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FooterSection = ({ title, items }: { title: string, items: { name: string, link: string }[] }) => (
    <div className="w-full sm:w-1/2 lg:w-1/4 mb-6 lg:mb-0 px-2">
        <h3 className="text-[#D4AF37] font-semibold mb-3">{ title }</h3>
        <ul className="space-y-2">
            { items.map((item, index) => (
                <li key={ index }>
                    <a href={ item.link } className="text-[#333333] hover:text-[#C48B9F] transition-colors duration-300 text-sm">
                        { item.name }
                    </a>
                </li>
            )) }
        </ul>
    </div>
);

const SocialIcon = ({ Icon, link }: { Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>, link: string }) => (
    <a href={ link } target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-[#D4AF37] transition-colors duration-300">
        <Icon size={ 20 } />
    </a>
);

const Footer = () => {
    const categories = [
        { name: 'Anéis', link: '/categoria/aneis' },
        { name: 'Brincos', link: '/categoria/brincos' },
        { name: 'Colares', link: '/categoria/colares' },
        { name: 'Pulseiras', link: '/categoria/pulseiras' },
        { name: 'Conjuntos', link: '/categoria/conjuntos' },
    ];

    const informations = [
        { name: 'Dicas e Cuidados', link: '/dicas-e-cuidados' },
        { name: 'Política de Privacidade', link: '/politica-de-privacidade' },
        { name: 'Sobre a ALEXA SEMIJOIAS', link: '/sobre-nos' },
        { name: 'Garantia', link: '/garantia' },
    ];

    const customerService = [
        { name: 'Contato', link: '/contato' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Trocas e Devoluções', link: '/trocas-e-devolucoes' },
        { name: 'Rastreamento de Pedidos', link: '/rastreamento' },
    ];

    return (
        <footer className="bg-[#FAF9F6] border-t border-[#F8C3D3]">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 lg:w-1/2 px-2 mb-6 lg:mb-0">
                        <div className="flex flex-wrap">
                            <FooterSection title="Categorias" items={ categories } />
                            <FooterSection title="Informações" items={ informations } />
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/2 px-2 mb-6 lg:mb-0">
                        <div className="flex flex-wrap">
                            <FooterSection title="Atendimento ao Cliente" items={ customerService } />
                            <div className="w-full lg:w-1/2 mb-6 lg:mb-0 px-2">
                                <h3 className="text-[#D4AF37] font-semibold mb-3">Newsletter</h3>
                                <p className="text-[#333333] mb-3 text-sm">Receba nossas novidades e ofertas exclusivas.</p>
                                <form onSubmit={ (e) => e.preventDefault() } className="flex flex-col space-y-2">
                                    <Input 
                                        type="email" 
                                        placeholder="Seu e-mail" 
                                        className="border-[#F8C3D3] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
                                    />
                                    <Button type="submit" className="bg-[#F8C3D3] hover:bg-[#C48B9F] text-white text-sm">
                    Inscrever-se
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#F8C3D3] mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                        <img src="/logo.svg" alt="ALEXA SEMIJOIAS Logo" className="h-6 sm:h-8" />
                    </div>
                    <div className="flex space-x-4 mb-4 sm:mb-0">
                        <SocialIcon Icon={ Facebook } link="https://facebook.com/alexasemijoias" />
                        <SocialIcon Icon={ Instagram } link="https://instagram.com/alexasemijoias" />
                        <SocialIcon Icon={ Twitter } link="https://twitter.com/alexasemijoias" />
                    </div>
                    <div className="text-[#333333] text-xs sm:text-sm">
                        <p className="mb-1 sm:mb-2">
                            <Mail className="inline-block mr-1" size={ 14 } />
              contato@alexasemijoias.com
                        </p>
                        <p>
                            <Phone className="inline-block mr-1" size={ 14 } />
              (11) 1234-5678
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center text-[#333333] text-xs">
                    <p>&copy; 2024 ALEXA SEMIJOIAS. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;