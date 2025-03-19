// src/app/components/homePage/DiscoverOurProducts/DiscoverOurProductsButtonsCarousel.tsx
'use client';
import useEmblaCarousel from 'embla-carousel-react';

interface ButtonsProps {
  sections: string[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function DiscoverOurProductsButtonsCarousel({ sections, activeSection, setActiveSection }: ButtonsProps) {
    const [emblaRef] = useEmblaCarousel({ align: 'center', dragFree: true, loop: true });
  
    return (
        <div className="overflow-hidden gap-2 py-2 px-8 pb-6">
            <div className="overflow-hidden" ref={ emblaRef }>
                <div
                    className="flex ml-[calc(var(--slide-spacing)*-1)] min-[750px]:ml-[calc(var(--slide-spacing-sm)*-1)] min-[1200px]:ml-[calc(var(--slide-spacing-lg)*-1)] gap-2"
                    style={ { touchAction: 'pan-y pinch-zoom', backfaceVisibility: 'hidden' } }
                >
                    { sections.map((section) => (
                        <button
                            key={ section }
                            onClick={ () => setActiveSection(section) }
                            className={ `p-1 px-4 ml-2 text-sm md:text-base  text-nowrap rounded-lg md:rounded-full hover:bg-[#D4Af37] hover:text-white transition-colors duration-300 ${
                                activeSection === section ? 'bg-[#D4Af37] text-white' : 'bg-[#F1F1F1]'
                            }` }
                        >
                            { section.toUpperCase() }
                        </button>
                    )) }
                </div>
            </div>
        </div>
    );
}
