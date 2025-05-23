// src/app/components/Breadcrumbs.tsx
import Link from 'next/link';
import { BreadcrumbItem } from '@/app/utils/breadcrumbUtils';
import { ChevronRight } from 'lucide-react';

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  textColorAllWhite?: boolean;
};

export default function Breadcrumbs({ items, textColorAllWhite }: BreadcrumbsProps) {
    // Dados estruturados para SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    const textColorWhite = textColorAllWhite ? 'text-white hover:text-white' : ''; 

    return (
        <nav aria-label="Breadcrumb" className="p-4">
            <ol className="flex flex-wrap items-center space-x-2">
                { items.map((item, index) => (
                    <li key={ index } className="flex items-center">
                        { index < items.length - 1 ? (
                            <>
                                <Link
                                    href={ item.url }
                                    className={ `md:text-lg lg:text-xl text-gray-500 hover:text-[#C48B9F] ${textColorWhite}` }
                                >
                                    { item.name }
                                </Link>
                                <ChevronRight className={ `md:text-lg lg:text-xl text-gray-500 ${textColorWhite}` } />
                            </>
                        ) : (
                            <span className={ `md:text-lg lg:text-xl text-[#C48B9F] ${textColorWhite}` }>
                                { item.name }
                            </span>
                        ) }
                    </li>
                )) }
            </ol>
            { /* Injeção do JSON‑LD para SEO */ }
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={ { __html: JSON.stringify(structuredData) } }
            />
        </nav>
    );
}
