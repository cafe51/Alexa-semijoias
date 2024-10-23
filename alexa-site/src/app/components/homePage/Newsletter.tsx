import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 bg-[#D4AF37] text-white">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Fique por Dentro das Novidades</h2>
                <p className="mb-6 sm:mb-8 text-sm sm:text-base">Inscreva-se para receber atualizações sobre nossas coleções e ofertas exclusivas.</p>
                <form className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="email"
                        placeholder="Seu endereço de e-mail"
                        className="flex-grow bg-white text-[#333333] text-sm sm:text-base"
                    />
                    <Button className="bg-[#C48B9F] hover:bg-[#F8C3D3] hover:text-[#333333] text-sm sm:text-base">
          Inscrever-se <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </div>
        </section>
    );
}

