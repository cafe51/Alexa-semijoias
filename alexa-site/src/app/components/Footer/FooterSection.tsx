interface FooterItem {
    name: string;
    link: string;
    children?: FooterItem[];
  }
  
  interface FooterSectionProps {
    title: string;
    items: FooterItem[];
  }
  
export function FooterSection({ title, items }: FooterSectionProps) {
    return (
        <div className="mb-8 lg:mb-0">
            <h3 className="text-[#D4AF37] sm:text-blue-400 text-lg lg:text-xl font-semibold mb-4 lg:mb-6">{ title }</h3>
            <ul className="space-y-3 lg:space-y-4">
                { items.map((item, index) => (
                    <li key={ index }>
                        <a
                            href={ item.link }
                            className="text-[#333333] hover:text-[#C48B9F] transition-colors duration-300 text-sm"
                        >
                            { item.name }
                        </a>
                        { item.children && item.children.length > 0 && (
                            <ul className="ml-2 md:ml-4 mt-0">
                                { item.children.map((child, childIndex) => (
                                    <li key={ childIndex }>
                                        <a
                                            href={ child.link }
                                            className="text-[#555555] hover:text-[#C48B9F] transition-colors duration-300 text-xs"
                                        >
                                            { child.name }
                                        </a>
                                    </li>
                                )) }
                            </ul>
                        ) }
                    </li>
                )) }
            </ul>
        </div>
    );
}
  