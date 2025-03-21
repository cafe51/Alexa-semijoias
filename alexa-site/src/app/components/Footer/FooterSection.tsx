import { FooterSectionType } from '@/app/utils/types';

interface FooterSectionProps {
    title: string;
    items: FooterSectionType[];
}

export function FooterSection({ title, items }: FooterSectionProps) {
    return (
        <div className="mb-8 lg:mb-0">
            <h3 className="text-[#D4AF37] text-lg lg:text-xl font-semibold mb-4 lg:mb-6">{ title }</h3>
            <ul className="space-y-3 lg:space-y-4">
                { items.map((item, index) => (
                    <li key={ index }>
                        <a href={ item.link } className="text-[#333333] hover:text-[#C48B9F] transition-colors duration-300 text-base lg:text-lg">
                            { item.name }
                        </a>
                    </li>
                )) }
            </ul>
        </div>
    );
}