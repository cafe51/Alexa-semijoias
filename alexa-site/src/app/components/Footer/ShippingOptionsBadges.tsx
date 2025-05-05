import Image from 'next/image';

const badges = [
    {
        imgSrc: 'https://www.correios.com.br/estrutura-da-pagina/precos-e-prazos/++theme++tema-do-portal-correios/static/imagens/correios.svg',
        alt: 'correios icon',
    },

    {
        imgSrc: 'https://www.correios.com.br/estrutura-da-pagina/precos-e-prazos/imagens/pac.png/@@images/41baaf23-58ba-47bb-ad19-39c36ad33e0f.png',
        alt: 'pac icon',
    },
    {
        imgSrc: 'https://www.correios.com.br/estrutura-da-pagina/precos-e-prazos/imagens/sedex.png/@@images/affe60e4-2c22-4551-afb5-81bbb67438e8.png',
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
