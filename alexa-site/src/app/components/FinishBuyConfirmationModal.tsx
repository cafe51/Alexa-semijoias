import { Button } from '@/components/ui/button';
import ModalMaker from './ModalMakers/ModalMaker';
import { useRouter } from 'next/navigation';

interface FinishBuyConfirmationProps {
    closeModelClick: () => void;
}

export default function FinishBuyConfirmationModal({ closeModelClick }: FinishBuyConfirmationProps) {
    const router = useRouter();
    return (
        <ModalMaker closeModelClick={ closeModelClick } title='Produto Adicionado ao Carrinho'>
            <section className='flex flex-col gap-4 p-4 text-center'>
                <h3 className='p-4 md:text-xl'>O que você deseja fazer agora?</h3>
                <Button
                    className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white py-2 sm:py-3 md:py-4 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl"
                    onClick={ () => router.push('/carrinho') }
                >
                Ir para o carrinho
                </Button>
                <Button
                    className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white py-2 sm:py-3 md:py-4 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl"
                    onClick={ closeModelClick }
                >
                Continuar comprando
                </Button>
            </section>
        </ModalMaker>
    );
}