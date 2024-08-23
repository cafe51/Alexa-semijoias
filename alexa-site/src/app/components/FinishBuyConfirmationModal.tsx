import LargeButton from './LargeButton';
import ModalMaker from './ModalMakers/ModalMaker';
import Link from 'next/link';


interface FinishBuyConfirmationProps {
    closeModelClick: () => void;
}

export default function FinishBuyConfirmationModal({ closeModelClick }: FinishBuyConfirmationProps) {
    return (
        <ModalMaker closeModelClick={ closeModelClick } title='Produto Adicionado ao carrinho'>
            <section className='flex flex-col gap-4 p-4'>
                <h3>O que você deseja fazer agora?</h3>
                <Link href={ '/carrinho' }>
                    <LargeButton color='green'>
                        Ir para o carrinho
                    </LargeButton>
                </Link>
                <LargeButton color='green' onClick={ closeModelClick }>
                        Continuar comprando
                </LargeButton>
            </section>
        </ModalMaker>
    );
}