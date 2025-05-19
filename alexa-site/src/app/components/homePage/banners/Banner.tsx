// src/app/components/homePage/banners/Banner.tsx
import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import Link from 'next/link';


interface BannerProps {
    bannerName:string;
    bannerImageMobile: string;
    bannerImageDesktop: string;
    bannerTablet?: string;
    pagePath?: string;
}

export default function Banner({
    bannerName,
    bannerImageMobile,
    bannerImageDesktop,
    bannerTablet,
    pagePath,
}: BannerProps) {
    return (
        <Link href={ pagePath ? `/${pagePath}` : '/' } >
            <section className="w-full overflow-hidden">
                <div className="md:hidden relative
            aspect-[8/13] min-[440px]:aspect-[5/9] sm:aspect-[5/7] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]
            bg-skeleton">
                    <Image
                        className="object-cover"
                        src={ bannerImageMobile }
                        title={ bannerName }
                        alt={ bannerName }
                        priority
                        sizes="1000px"
                        quality={ 80 }
                        fill
                        placeholder="blur"
                        blurDataURL={ heroBannerLarge.blurDataURL }
                    />
                </div>
                <div className="hidden md:flex xl:hidden relative
            aspect-[8/13] min-[440px]:aspect-[5/9] sm:aspect-[5/7] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]
            bg-skeleton">
                    <Image
                        className="object-cover"
                        src={ bannerTablet ? bannerTablet : bannerImageMobile }
                        title={ bannerName }
                        alt={ bannerName }
                        priority
                        sizes="1000px"
                        quality={ 80 }
                        fill
                        placeholder="blur"
                        blurDataURL={ heroBannerLarge.blurDataURL }
                    />
                </div>
                <div className="hidden xl:flex relative
            aspect-[8/13] min-[440px]:aspect-[5/9] sm:aspect-[5/7] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]
            bg-skeleton">
                    <Image
                        className="object-cover"
                        src={ bannerImageDesktop }
                        title={ bannerName }
                        alt={ bannerName }
                        priority
                        sizes="1000px"
                        quality={ 80 }
                        fill
                        placeholder="blur"
                        blurDataURL={ heroBannerLarge.blurDataURL }
                    />
                </div>

            </section>
        </Link>

    );
}
