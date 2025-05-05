import Image from 'next/image';
import Link from 'next/link';

const siteUrl = 'https://www.alexasemijoias.com.br';

const badges = [
    {
        href: `https://www.sslshopper.com/ssl-checker.html#hostname=${siteUrl}`,
        imgSrc: 'https://www.sslshopper.com/assets/templates/sslshopper2016/img/ssl-shopper-logo.svg',
        alt: 'SSL Checker',
    },

    {
        href: `https://transparencyreport.google.com/safe-browsing/search?url=${siteUrl}&hl=pt_BR`,
        imgSrc: 'https://i.imgur.com/Jnct9y7.png',
        alt: 'Google Safe Browsing 2',
    },
];

export default function SecurityBadges() {
    return (
        <section className="py-8 max-w-4xl px-4">
            <h2 className="text-xl font-light mb-4">Loja Segura</h2>
            <div className="flex justify-center items-center gap-4">
                { badges.map((badge, index) => (
                    <Link
                        key={ index }
                        href={ badge.href }
                        target="_blank"
                        rel="noopener"
                        aria-describedby="a11y-new-window-message"
                    >
                        <Image
                            src={ badge.imgSrc }
                            alt={ badge.alt }
                            width={ 83 }
                            height={ 30 }
                            className="inline-block"
                            loading="lazy"
                        />
                    </Link>
                )) }
            </div>
        </section>
    );
}
