import { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect).on('select', onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton: React.FC<PropType> = ({ children, ...restProps }) => {
    return (
        <button
            type="button"
            className="
            absolute left-2 top-1/2 -translate-y-1/2
            bg-white bg-opacity-50 hover:bg-opacity-75
            cursor-pointer p-0 m-0 flex items-center justify-center
            w-[2rem] h-[2rem]
            sm:w-[2.5rem] sm:h-[2.5rem]
            md:w-[3rem] md:h-[3rem]
            lg:w-[3.5rem] lg:h-[3.5rem]
            rounded-full  text-gray-700 z-10 disabled:text-gray-500"
            { ...restProps }
        >
            <svg className="w-[25%] sm:h-[25%] md:w-[30%] md:h-[30%] lg:w-[35%] lg:h-[35%]" viewBox="0 0 532 532">
                <path
                    fill="currentColor"
                    d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                />
            </svg>
            { children }
        </button>
    );
};

export const NextButton: React.FC<PropType> = ({ children, ...restProps }) => {
    return (
        <button
            type="button"
            className="
            absolute right-2 top-1/2 -translate-y-1/2 
            bg-white bg-opacity-50  hover:bg-opacity-75
            cursor-pointer p-0 m-0 flex items-center justify-center
            w-[2rem] h-[2rem]
            sm:w-[2.5rem] sm:h-[2.5rem]
            md:w-[3rem] md:h-[3rem]
            lg:w-[3.5rem] lg:h-[3.5rem]
            rounded-full  text-gray-700 z-10 disabled:text-gray-500"
            { ...restProps }
        >
            <svg className="w-[25%] sm:h-[25%] md:w-[30%] md:h-[30%] lg:w-[35%] lg:h-[35%]" viewBox="0 0 532 532">
                <path
                    fill="currentColor"
                    d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
                />
            </svg>
            { children }
        </button>
    );
};
