'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import { ChevronRight, Diamond, Heart, Star } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const SectionTitle = ({ children }: { children: React.ReactNode }) => (
//     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-4 sm:mb-6 text-center">
//         { children }
//     </h2>
// );

// const ValueCardContainer = ({ children }: { children: React.ReactNode }) => {
//     const [maxHeight, setMaxHeight] = useState(0);
//     const [maxWidth, setMaxWidth] = useState(0);
//     const containerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (containerRef.current) {
//             // Reset dimensions to allow natural sizing
//             const cards = containerRef.current.children;
//             Array.from(cards).forEach(card => {
//                 (card as HTMLElement).style.height = 'auto';
//                 (card as HTMLElement).style.width = 'auto';
//             });

//             // Calculate maximum dimensions
//             let maxH = 0;
//             let maxW = 0;
//             Array.from(cards).forEach(card => {
//                 maxH = Math.max(maxH, (card as HTMLElement).offsetHeight);
//                 maxW = Math.max(maxW, (card as HTMLElement).offsetWidth);
//             });

//             setMaxHeight(maxH);
//             setMaxWidth(maxW);
//         }
//     }, [children]);

//     return (
//         <div 
//             ref={ containerRef } 
//             className="flex flex-wrap justify-center gap-6"
//         >
//             { React.Children.map(children, child =>
//                 React.cloneElement(child as React.ReactElement, {
//                     style: {
//                         height: maxHeight > 0 ? `${maxHeight}px` : 'auto',
//                         width: maxWidth > 0 ? `${maxWidth}px` : 'auto',
//                     },
//                 }),
//             ) }
//         </div>
//     );
// };

// interface ValueCardProps {
//     icon: React.ReactNode;
//     title: string;
//     description: string;
//     style?: React.CSSProperties;
// }

// const ValueCard = ({ icon, title, description, style }: ValueCardProps) => (
//     <div 
//         className="flex flex-col items-center p-6 sm:p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-md space-y-2 md:space-y-4 text-center"
//         style={ style }
//     >
//         <div className="text-[#D4AF37]">{ icon }</div>
//         <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#333333]">{ title }</h3>
//         <p className="text-sm sm:text-base md:text-lg text-[#333333]">{ description }</p>
//     </div>
// );

// interface TimelineItemProps {
//     year: string;
//     event: string;
// }

// const TimelineItem = ({ year, event }: TimelineItemProps) => (
//     <div className="flex items-start mb-4">
//         <div className="flex-shrink-0 w-24 text-right mr-4">
//             <span className="text-sm sm:text-base md:text-lg font-bold text-[#C48B9F]">{ year }</span>
//         </div>
//         <div className="flex-grow">
//             <div className="w-3 h-3 bg-[#D4AF37] rounded-full mt-1.5 -ml-1.5"></div>
//             <p className="text-sm sm:text-base md:text-lg ml-4 text-[#333333]">{ event }</p>
//         </div>
//     </div>
// );

const AboutAlexa = () => {
    return (<p>Em construção...</p>
    //     <div className="min-h-screen bg-[#FAF9F6] text-[#333333]" style={ { fontFamily: 'Montserrat, sans-serif' } }>
    //         { /* Hero Section */ }
    //         <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
    //             <img
    //                 src="/placeholder.svg?height=1080&width=1920&text=Alexa+Jewelry"
    //                 alt="Alexa Jewelry Showcase"
    //                 className="absolute inset-0 w-full h-full object-cover"
    //             />
    //             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    //             <div className="relative z-10 text-center text-white px-4">
    //                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Sobre a Alexa</h1>
    //                 <p className="text-lg sm:text-xl md:text-2xl mb-8">Criando beleza atemporal desde 1995</p>
    //             </div>
    //         </section>

    //         { /* Our Story Section */ }
    //         <section className="py-12 sm:py-16 px-4">
    //             <div className="max-w-4xl mx-auto">
    //                 <SectionTitle>Nossa História</SectionTitle>
    //                 <p className="text-center text-sm sm:text-base md:text-lg mb-8">
    //                     A Alexa nasceu do sonho de criar joias que não apenas adornam, mas contam histórias. Desde 1995,
    //                     temos nos dedicado a criar peças que capturam a essência da elegância feminina, combinando
    //                     tradição artesanal com design contemporâneo.
    //                 </p>
    //                 <div className="space-y-4">
    //                     <TimelineItem year="1995" event="Fundação da Alexa por Alexandra Soares em uma pequena oficina em São Paulo." />
    //                     <TimelineItem year="2000" event="Abertura da primeira loja física no Shopping Iguatemi." />
    //                     <TimelineItem year="2005" event="Lançamento da primeira coleção de joias sustentáveis." />
    //                     <TimelineItem year="2010" event="Expansão para o mercado internacional, com presença em Paris e Nova York." />
    //                     <TimelineItem year="2015" event="Celebração de 20 anos com o lançamento da coleção 'Essência'." />
    //                     <TimelineItem year="2020" event="Inauguração do e-commerce e expansão da presença digital." />
    //                     <TimelineItem year="Hoje" event="Continuamos a inovar e inspirar, criando joias que são verdadeiras obras de arte." />
    //                 </div>
    //             </div>
    //         </section>

    //         { /* Our Values Section */ }
    //         <section className="py-12 sm:py-16 px-4 bg-[#F8C3D3] bg-opacity-20">
    //             <div className="max-w-6xl mx-auto">
    //                 <SectionTitle>Nossos Valores</SectionTitle>
    //                 <ValueCardContainer>
    //                     <ValueCard
    //                         icon={ <Diamond size={ 32 } /> }
    //                         title="Qualidade Excepcional"
    //                         description="Comprometimento com a excelência em cada detalhe de nossas joias."
    //                     />
    //                     <ValueCard
    //                         icon={ <Heart size={ 32 } /> }
    //                         title="Paixão pelo Artesanato"
    //                         description="Cada peça é criada com amor e dedicação por nossos artesãos especializados."
    //                     />
    //                     <ValueCard
    //                         icon={ <Star size={ 32 } /> }
    //                         title="Inovação Constante"
    //                         description="Buscamos sempre novas técnicas e designs para surpreender nossos clientes."
    //                     />
    //                 </ValueCardContainer>
    //             </div>
    //         </section>

    //         { /* Our Commitment Section */ }
    //         <section className="py-12 sm:py-16 px-4">
    //             <div className="max-w-4xl mx-auto text-center">
    //                 <SectionTitle>Nosso Compromisso</SectionTitle>
    //                 <p className="text-sm sm:text-base md:text-lg mb-8">
    //                     Na Alexa, acreditamos que a beleza deve ser sustentável. Nosso compromisso com o meio ambiente e
    //                     práticas éticas é tão importante quanto nossa dedicação à qualidade. Utilizamos materiais
    //                     responsáveis e processos sustentáveis em toda nossa produção.
    //                 </p>
    //                 <Button className="bg-[#D4AF37] hover:bg-[#C48B9F] text-white py-2 px-4 rounded-md text-sm sm:text-base md:text-lg transition duration-300">
    //                     Conheça Nossas Coleções <ChevronRight className="ml-2 h-4 w-4" />
    //                 </Button>
    //             </div>
    //         </section>
    //     </div>
    );
};

export default AboutAlexa;