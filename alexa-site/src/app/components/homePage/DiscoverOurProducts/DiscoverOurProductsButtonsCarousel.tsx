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
                            className={ `p-1 px-2 ml-2 rounded-lg tracking-widest text-sm ${
                                activeSection === section ? 'bg-yellow-500' : 'bg-[#F1F1F1]'
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
