import useEmblaCarousel from 'embla-carousel-react';

export default function DiscoverOurProductsButtonsCarousel({ sections }: {sections: string[] }) {
    const [
        emblaRef,
    ] = useEmblaCarousel({ align: 'center', dragFree: true, loop: true });
    
    return (
        <div className="emblaSectionButtons gap-2 py-2 px-8 pb-6">
            <div className="embla__viewport" ref={ emblaRef }>
                <div
                    className="embla__container gap-2"
                    // style={ { touchAction: 'pan-y pinch-zoom' } }
                >
                    {
                        sections.map((section) => {
                            return (
                                <button key={ section } className='p-1 px-2 ml-2 rounded-lg bg-[#F1F1F1] tracking-widest text-sm'> 
                                    { section.toUpperCase() }
                                </button>
                            );
                        })
                    }
                </div>
            </div>
        </div>

    );
}