import Image from 'next/image';

const badges = [
    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-mastercard-2.svg',
        alt: 'fc-mastercard',
    },

    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-american-express.svg',
        alt: 'fc-american-express',
    },
    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-elo.svg',
        alt: 'fc-elo',
    },

    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-diners.svg',
        alt: 'fc-diners',
    },
    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-visa.svg',
        alt: 'fc-visa',
    },

    {
        imgSrc: 'https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc/fc-pix2.svg',
        alt: 'fc-pix',
    },

];

export default function PaymentOptionsBadges() {
    return (
        <section className="py-8 max-w-4xl px-4">
            <h2 className="text-xl font-light mb-4 ">Formas de Pagamento</h2>
            <div className="flex justify-center items-center gap-4">
                { badges.map((badge) => (
                    <Image
                        key={ badge.alt }
                        src={ badge.imgSrc }
                        alt={ badge.alt }
                        width={ 40 }
                        height={ 15 }
                        className="inline-block"
                        loading="lazy"
                    />
                )) }
            </div>
        </section>
    );
}
