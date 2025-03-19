import Image from 'next/image';
import Link from 'next/link';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';

interface SectionCardProps {
  product: {
    urlImage: string;
    sectionName: string;
  };
  containerClassName?: string;
}

export function SectionCard({ product, containerClassName = 'bg-skeleton' }: SectionCardProps) {
    const titleOfBanner = product.sectionName || 'Alexa Semijoias';
    const linkToSection = product.sectionName ? `/section/${product.sectionName}` : '/section';

    return (
        <div className={ `${containerClassName} relative overflow-hidden` }>
            <Image
                src={ product.urlImage }
                alt={ `Banner Principal ${titleOfBanner}` }
                title={ `Banner Principal ${titleOfBanner}` }
                fill
                className="object-cover"
                priority
                sizes="1000px"
                quality={ 80 }
                placeholder="blur"
                blurDataURL={ heroBannerLarge.blurDataURL }
            />
            <div className="absolute inset-0 flex items-end justify-center text-center">
                <div className="relative pb-6 md:pb-10 md:px-10">
                    <p className="font-semibold text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl pb-4 md:pb-6 tracking-wider">
                        { titleOfBanner }
                    </p>
                    <Link href={ linkToSection }>
                        <button className="text-base md:text-xl text-white underline">
              Explorar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Sections({
    products,
}: {
  products: { urlImage: string; sectionName: string }[];
}) {
    return (
        <section className='py-10'>
            <h1 className="text-2xl sm:text-3xl text-center mb-6 sm:mb-8 md:mb-12">Nossas Coleções</h1>
            <div className="w-full grid grid-cols-2 gap-4 ">
                { /* Coluna Esquerda: container com aspect ratio de 16/17 */ }
                <div className="relative aspect-[8/6]">
                    <SectionCard
                        product={ products[0] }
                        containerClassName="w-full h-full"
                    />
                </div>

                { /* Coluna Direita: container com o mesmo aspect ratio, subdividido em 2 linhas */ }
                <div className="relative aspect-[8/6] grid grid-rows-[9fr,8fr] gap-4">
                    { /* Linha superior: banner horizontal */ }
                    <div className="relative">
                        <SectionCard
                            product={ products[1] }
                            containerClassName="w-full h-full"
                        />
                    </div>
                    { /* Linha inferior: grid com duas colunas para imagens quadradas */ }
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <SectionCard
                                product={ products[2] }
                                containerClassName="w-full h-full"
                            />
                        </div>
                        <div className="relative">
                            <SectionCard
                                product={ products[3] }
                                containerClassName="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
