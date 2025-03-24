import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import SearchBar from './components/header/SearchBar';

export default function NotFound() {


    return (
        <div
            className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8"
            style={ { fontFamily: 'Montserrat, sans-serif' } }
        >
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center">
                { /* Título principal */ }
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#C48B9F] mb-6">
                    404
                </h1>
                { /* Subtítulo */ }
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#333333] mb-6">
                    Página não encontrada
                </h2>
                { /* Descrição */ }
                <p className="text-base sm:text-lg md:text-xl text-[#333333] mb-8">
                    Ops! Parece que o que você está procurando não está aqui. Que tal explorar nossas <Link href={ '/section' } className='bold text-[#C48B9F]'>peças</Link>? 
                </p>

                { /* Formulário de busca */ }
                <div className="mb-8">
                    <SearchBar />
                </div>

                { /* Botões de navegação */ }
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto border-[#C48B9F] text-[#C48B9F] hover:bg-[#C48B9F] hover:text-white px-4 py-2 sm:px-6"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button
                            className="w-full sm:w-auto bg-[#C48B9F] hover:bg-[#D4AF37] text-white px-4 py-2 sm:px-6"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Página Inicial
                        </Button>
                    </Link>
                </div>

                { /* Texto de rodapé */ }
                <div className="mt-12">
                    <p className="text-sm sm:text-base text-[#333333]">
                        Não encontrou o que procurava?
                        <Link href="https://wa.me/551781650632" className="text-[#C48B9F] hover:text-[#D4AF37] ml-1">
                            Entre em contato conosco
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
