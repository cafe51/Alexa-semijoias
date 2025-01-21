'use client';
import { Facebook, Instagram, Twitter, Mail, Phone, LucideProps } from 'lucide-react';
import Logo from './header/Logo';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import { useCollection } from '../hooks/useCollection';
import { SectionType } from '../utils/types';
import { useEffect, useState } from 'react';
import toTitleCase from '../utils/toTitleCase';

type FooterSectionType = { name: string, link: string };

const FooterSection = ({ title, items }: { title: string, items: FooterSectionType[] }) => (
    <div className="mb-8 lg:mb-0">
        <h3 className="text-[#D4AF37] text-lg lg:text-xl font-semibold mb-4 lg:mb-6">{ title }</h3>
        <ul className="space-y-3 lg:space-y-4">
            { items.map((item, index) => (
                <li key={ index }>
                    <a href={ item.link } className="text-[#333333] hover:text-[#C48B9F] transition-colors duration-300 text-base lg:text-lg">
                        { item.name }
                    </a>
                </li>
            )) }
        </ul>
    </div>
);

const SocialIcon = ({ Icon, link }: { Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>, link: string }) => (
    <a href={ link } target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-[#D4AF37] transition-colors duration-300 p-2">
        <Icon size={ 24 } className="hover:scale-110 transition-transform duration-300" />
    </a>
);

export default function Footer() {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');
    const [sections, setSections] = useState<SectionType[]>([]);
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        async function fetchSectionsAndProducts() {
            try {
                // Obter as seções do Firebase
                const sectionsData = await getAllSections();
                setSections(sectionsData);
                
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
            }
        }

        fetchSectionsAndProducts();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const informations = [
        { name: 'Dicas e Cuidados', link: '/dicas-e-cuidados' },
        { name: 'Política de Privacidade', link: '/politica-de-privacidade' },
        { name: 'Sobre a ALEXA SEMIJOIAS', link: '/sobre' },
        { name: 'Garantia', link: '/garantia' },
    ];

    const customerService: FooterSectionType[] = [
        // { name: 'Contato', link: '/contato' },
        // { name: 'FAQ', link: '/faq' },
        // { name: 'Trocas e Devoluções', link: '/trocas-e-devolucoes' },
        // { name: 'Rastreamento de Pedidos', link: '/rastreamento' },
    ];

    return (
        <footer className="bg-white border-t border-[#F8C3D3] shadow-[0_-4px_8px_rgba(0,0,0,0.2)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-start">
                <div className="flex flex-wrap -mx-4">
                    { /* Container para as duas primeiras seções em mobile */ }
                    <div className="w-full lg:w-1/2 flex flex-wrap mb-8 lg:mb-0">
                        { /* Primeira coluna - sempre ocupa metade em mobile */ }
                        {
                            sections && sections.length > 0 &&
                            <div className="w-1/2 px-4 lg:pr-8">
                                <FooterSection
                                    title="Sessões"
                                    items={ sections.map(({ sectionName }) => ({ name: toTitleCase(sectionName), link: `/section/${sectionName.toLowerCase()}` })) }
                                />
                            </div>
                        }
                        { /* Segunda coluna - sempre ocupa metade em mobile */ }
                        {
                            informations && informations.length > 0 &&
                            <div className="w-1/2 px-4 lg:pl-8">
                                <FooterSection title="Informações" items={ informations } />
                            </div>
                        }
                    </div>

                    { /* Container para a terceira seção e newsletter */ }
                    <div className="w-full lg:w-1/2 flex flex-wrap">
                        { /* Terceira seção - ocupa largura total em mobile */ }
                        {
                            customerService && customerService.length > 0 &&
                            <div className="w-full sm:w-1/2 px-4 mb-8 sm:mb-0">
                                <FooterSection title="Atendimento ao Cliente" items={ customerService } />
                            </div>
                        }
                        { /* Newsletter */ }
                        {
                            // <div className="w-full sm:w-1/2 px-4">
                            //     <div className="mb-8 lg:mb-0">

                            //         <h3 className="text-[#D4AF37] text-lg lg:text-xl font-semibold mb-4">Newsletter</h3>
                            //         <p className="text-[#333333] mb-4 text-base lg:text-lg">Receba nossas novidades e ofertas exclusivas.</p>
                            //         <form onSubmit={ (e) => e.preventDefault() } className="flex flex-col space-y-3">
                            //             <Input 
                            //                 type="email" 
                            //                 placeholder="Seu e-mail" 
                            //                 className="border-[#F8C3D3] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-base p-4 h-12"
                            //             />
                            //             <Button 
                            //                 type="submit" 
                            //                 className="bg-[#F8C3D3] hover:bg-[#C48B9F] text-white text-base h-12 px-6"
                            //             >
                            //             Inscrever-se
                            //             </Button>
                            //         </form>
                            //     </div>
                            // </div>
                        }
                    </div>
                </div>

                <div className="border-t border-[#F8C3D3] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
                    <div className="mb-4 sm:mb-0">
                        <Logo isMobile={ isMobile } />
                    </div>
                    <div className="flex space-x-6 mb-4 sm:mb-0">
                        <SocialIcon Icon={ Facebook } link="https://facebook.com/alexasemijoias" />
                        <SocialIcon Icon={ Instagram } link="https://instagram.com/alexa.semijoias" />
                        <SocialIcon Icon={ Twitter } link="https://twitter.com/alexasemijoias" />
                    </div>
                    <div className="text-[#333333] text-base lg:text-lg">
                        <p className="mb-2 flex items-center justify-center sm:justify-start">
                            <Mail className="mr-2" size={ 18 } />
                            alexasemijoias@alexasemijoias.com.br
                        </p>
                        <p className="flex items-center justify-center sm:justify-start">
                            <Phone className="mr-2" size={ 18 } />
                            (17) 98165-0632
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[#333333] text-sm lg:text-base">
                    <p>&copy; 2024 ALEXA SEMIJOIAS. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}