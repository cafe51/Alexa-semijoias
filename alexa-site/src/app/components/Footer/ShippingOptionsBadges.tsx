import Image from 'next/image';
import correiosIcon from '../../../../public/assets/correiosIcon/correios.svg';
import pacIcon from '../../../../public/assets/correiosIcon/pacIcon.png';
import sedexIcon from '../../../../public/assets/correiosIcon/sedexicon.png';



const badges = [
    {
        imgSrc: correiosIcon,
        alt: 'correios icon',
    },

    {
        imgSrc: pacIcon,
        alt: 'pac icon',
    },
    {
        imgSrc: sedexIcon,
        alt: 'sedex icon',
    },

];

export default function ShippingOptionsBadges() {
    return (
        <section className="py-8 max-w-4xl px-4">
            <h2 className="text-xl font-light mb-4 ">Formas de Envio</h2>
            <div className="flex justify-center items-center gap-4">
                { badges.map((badge) => (
                    <Image
                        key={ badge.alt }
                        src={ badge.imgSrc }
                        alt={ badge.alt }
                        width={ 83 }
                        height={ 30 }
                        className="inline-block"
                        loading="lazy"
                    />
                )) }
            </div>
        </section>
    );
}
