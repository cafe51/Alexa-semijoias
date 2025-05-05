import { IconType } from 'react-icons';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import SocialIcon from './SocialIcon';

const badges: {
    icon: IconType;
    link: string;
    linkName: string;
}[] = [
    {
        icon: FaFacebook,
        link: 'https://facebook.com/alexasemijoias',
        linkName: 'Link para o Facebook da ALEXA SEMIJOIAS',
    },
    {
        icon: FaInstagram,
        link: 'https://instagram.com/alexa.semijoias',
        linkName: 'Link para o Instagram da ALEXA SEMIJOIAS',
    },
    {
        icon: FaTiktok,
        link: 'https://www.tiktok.com/@alexa.semijoias',
        linkName: 'Link para o TikTok da ALEXA SEMIJOIAS',
    },
    {
        icon: FaYoutube,
        link: 'https://www.youtube.com/@alexa.semijoias',
        linkName: 'Link para o Youtube da ALEXA SEMIJOIAS',
    },
    

];

export default function SocialMediaBadges() {
    return (
        <section className="py-8 max-w-4xl px-4">
            <div className="flex justify-center items-center gap-6">
                { badges.map(({ icon, link, linkName }) => (
                    <SocialIcon key={ linkName } Icon={ icon } link={ link } linkName={ linkName }/>
                )) }
            </div>
        </section>
    );
}
