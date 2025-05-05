import { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface SocialIconProps {
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> | IconType;
    link: string;
    linkName: string;
}

export default function SocialIcon({ Icon, link, linkName }: SocialIconProps) {
    return ( 
        <Link
            href={ link }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333333] hover:text-[#D4AF37] transition-colors duration-300 p-2"
            aria-label={ linkName }
            title={ linkName }
        >
    
            <Icon size={ 24 } className="hover:scale-110 transition-transform duration-300" />
            <span className="sr-only">{ linkName }</span>
        </Link>
    );
}