import HomeProductCard from './HomeProductCard';

export default function FeaturedProducts(){
    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 bg-[#F8C3D3] bg-opacity-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Destaques da Coleção</h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                { [1, 2, 3].map((product) => (
                    <div key={ product } className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] max-w-xs">
                        <HomeProductCard product={ product } />
                    </div>
                )) }
            </div>
        </section>
    );
}