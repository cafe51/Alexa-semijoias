import db from '../../../public/db/db.json';
import { ProductType } from '../utils/types';
import CartItem from './CartItem';
import BodyWithHeaderAndFooter from '../components/BodyWithHeaderAndFooter';

const produtoMock1 = db.aneis[1];
const produtoMock2 = db.brincos[0];
const produtoMock3 = db.colares[2];

const mockProdutos = [produtoMock1, produtoMock2, produtoMock3];


export default function Carrinho() {
    return (
        <BodyWithHeaderAndFooter>
            <h2 className='text-center self-center'>FINALIZE SUA COMPRA</h2>
            <section className='flex flex-col gap-1'>
                {
                    mockProdutos.map((produto: ProductType) => <CartItem key={ produto.id } produto={ produto }/>)
                }
            </section>
            <section className='flex flex-col gap-4 w-full p-6 bg-white shadow-lg rounded-lg shadowColor'>
                <h2>Resumo</h2>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Subtotal</p>
                    <p>R$ { (100).toFixed(2) }</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Frete</p>
                    <p>Calcular</p>
                </div>
                <div className='flex gap-2 w-full justify-between'>
                    <p>Total</p>
                    <p>R$ { (120).toFixed(2) }</p>
                </div>
                <div className='flex flex-col text-end w-full'>
                    <p>à vista com 10% OFF</p>
                    <p>ou até 6x R$ { (50).toFixed(2) } sem juros</p>
                </div>
                <button className='rounded-full bg-green-500 p-4 px-6 font-bold text-white'>
                        Finalizar compra
                </button>
                <button className='rounded-full bg-blue-500 p-4 px-6 font-bold text-white'>
                        Continuar comprando
                </button>
            </section>
        </BodyWithHeaderAndFooter>
    );
}