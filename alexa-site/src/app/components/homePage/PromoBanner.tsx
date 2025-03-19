// src/app/components/homePage/PromoBanner.tsx
import Image from 'next/image';
// import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import Link from 'next/link';

export default function PromoBanner() {

    const slogan = 'Semijoias para momentos inesquecíveis';
    const title = 'Banho de ouro 18k reforçado para máxima proteção.'; 


    return (
        <section className="w-full grid md:grid-cols-[65%_auto] overflow-hidden">

            <div className="relative aspect-video md:aspect-auto bg-skeleton">
                <Image
                    className="object-cover"
                    src={ 'https://mirage-theme.myshopify.com/cdn/shop/files/bannermirage-min.jpg?v=1739185181&width=1440' }
                    title="Banner Principal Alexa Semijoias"
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    sizes="1000px"
                    quality={ 80 }
                    fill
                    // placeholder="blur"
                    // blurDataURL={ heroBannerLarge.blurDataURL }
                />
                        


            </div>
            <div className="relative aspect-auto bg-[#C48B9F] flex flex-col items-start md:items-center xl:justify-end justify-evenly p-8 xl:pb-14 gap-4"> 
                <h3 className='text-white font-bold text-center text-sm xl:text-lg uppercase tracking-widest'>{ slogan.toUpperCase() }</h3>
                <div className='justify-between flex flex-col md:items-center gap-4'>
                    <div className='text-start md:text-center text-4xl md:text-5xl '>
                        <p className='text-white font-bold'>{ title }</p>
                    </div>
                    <Link href={ '/section' }>
                        <button
                            className='bg-white font-bold text-[#C48B9F] p-4 px-8 md:px-14 rounded-full text-lg lg:text-xl  hover:bg-[#D4AF37] hover:text-white transition-colors duration-300'
                        > 
                            Explore
                        </button>
                    </Link>

                </div>
            </div>
            
        </section>
    );
}
