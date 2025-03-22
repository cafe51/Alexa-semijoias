'use client';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import Logo from '../header/Logo';
import { useEffect, useState } from 'react';
import toTitleCase from '../../utils/toTitleCase';
import { createSlugName } from '../../utils/createSlugName';
import { FireBaseDocument, FooterSectionType, SectionType } from '../../utils/types';
import { FooterSection } from './FooterSection';
import SocialIcon from './SocialIcon';

interface FooterProps {
  sections: (SectionType & FireBaseDocument)[];
}

export default function Footer({ sections }: FooterProps) {
    const [isMobile, setIsMobile] = useState(true);

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
        // { name: 'Sobre a ALEXA SEMIJOIAS', link: '/sobre' },
        { name: 'Garantia', link: '/garantia' },
    ];

    const customerService: FooterSectionType[] = [
        // { name: 'Contato', link: '/contato' },
        // { name: 'FAQ', link: '/faq' },
        // { name: 'Trocas e Devoluções', link: '/trocas-e-devolucoes' },
        // { name: 'Rastreamento de Pedidos', link: '/rastreamento' },
    ]; // ainda vão ser implementadas essas opções

    // Transforma as seções para incluir as subseções como itens-filho (children)
    const transformedSections = sections.map(({ sectionName, subsections }) => ({
        name: toTitleCase(sectionName),
        link: `/section/${createSlugName(sectionName)}`,
        children:
      subsections && subsections.length > 0
          ? subsections.map((sub) => ({
              name: toTitleCase(sub),
              link: `/section/${createSlugName(sectionName)}/${createSlugName(sub)}`,
          }))
          : [],
    }));

    return (
        <footer className="bg-white border-t border-[#F8C3D3] shadow-[0_-4px_8px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-start">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full lg:w-1/2 flex flex-wrap mb-8 lg:mb-0">
                        <div className="w-1/2 px-4 lg:pr-8">
                            <FooterSection title="Seções" items={ transformedSections } />
                        </div>
                        <div className="w-1/2 px-4 lg:pl-8">
                            <FooterSection title="Informações" items={ informations } />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-wrap">
                        { customerService && customerService.length > 0 && (
                            <div className="w-full sm:w-1/2 px-4 mb-8 sm:mb-0">
                                <FooterSection title="Atendimento ao Cliente" items={ customerService } />
                            </div>
                        ) }
                    </div>
                </div>

                <div className="border-t border-[#F8C3D3] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
                    <div className="mb-4 sm:mb-0">
                        <Logo isMobile={ isMobile } />
                    </div>
                    <div className="flex space-x-6 mb-4 sm:mb-0">
                        <SocialIcon
                            Icon={ Facebook }
                            link="https://facebook.com/alexasemijoias"
                            linkName="Link para o Facebook da ALEXA SEMIJOIAS"
                        />
                        <SocialIcon
                            Icon={ Instagram }
                            link="https://instagram.com/alexa.semijoias"
                            linkName="Link para o Instagram da ALEXA SEMIJOIAS"
                        />
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
