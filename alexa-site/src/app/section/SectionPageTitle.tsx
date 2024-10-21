import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SectionPageTitle({ section, subsection }: { section: string, subsection?: string | undefined }) {
    return (
        <div className="mb-6 sm:mb-8 uppercase">
            { /* Renderiza o título principal da seção */ }
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#333333]">
                { subsection ? subsection : section }
            </h1>
            { /* Navegação por links */ }
            <div className="flex justify-center items-center space-x-2 mt-4">
                { /* Link para a página inicial */ }
                <Link href="/" passHref>
                    <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-500 cursor-pointer hover:text-[#C48B9F]">
                        Início
                    </span>
                </Link>
                <ChevronRight className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-500"/>
                { /* Condicional para exibir section como link ou não */ }
                { subsection ? (
                    // Se houver uma subsection, section será um link
                    <Link href={ `/section/${section.toLowerCase()}` } passHref>
                        <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-500 cursor-pointer hover:text-[#C48B9F]">
                            { section }
                        </span>
                    </Link>
                ) : (
                    // Se não houver subsection, section não será um link e terá cor destacada
                    <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-[#C48B9F]">
                        { section }
                    </span>
                ) }

                { /* Renderiza subsection apenas se existir */ }
                { subsection && (
                    <>
                        <ChevronRight/>
                        <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-[#C48B9F]">
                            { subsection }
                        </span>
                    </>
                ) }
            </div>
        </div>
    );
}
