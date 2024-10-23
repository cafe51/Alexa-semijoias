import heroBannerLarge from '@/../public/heroBannerLarge.png';

export default function HeroSection() {
    return (
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
            <img
                src={ heroBannerLarge.src }
                alt="Elegant jewelry display"
                className="absolute inset-0 w-full h-full object-cover"
            />
            { /* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */ }
        </section>
    );
}
