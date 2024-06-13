'use client';

import { useEffect, useState } from 'react';
import { ProductType } from '../utils/types';
import ResponsiveCarousel from './ResponsiveCarousel';
import Link from 'next/link';
import { useCollection } from '../hooks/useCollection';


export default function Product({ id, productType }: {id: string, productType: string}) {
    const { getDocumentById } = useCollection<ProductType>('produtos', null);
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const updateProductsState = async() => {
        const productData = await getDocumentById(id);
        if (productData.exist) {
            setProduct(productData);
            setIsLoading(false);

        } else {
            console.log('Produto Não encontrado', productData);
        }
    };



    useEffect(() => {
        updateProductsState();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        try {
            product && setIsLoading(false);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);  
            } else { console.log('erro desconhecido'); }
        }
    
    }, [product]);


    return (
        <main>
            { isLoading || !product ? 'carregando' : (
                <>  
                    <p>
                        <Link href={ '/' }>Início/</Link> <Link href={ `/${productType}` }>{ productType.charAt(0).toUpperCase() + productType.slice(1) }/ </Link> <span className='font-bold'>{ product.nome }</span>
                    </p>
                        
                    <ResponsiveCarousel productData={ product }/>
                        
                    <p className='text-sm'>{ product.descricao }</p>
                    <h2 className='font-normal'>{ product.nome.toUpperCase() }</h2>

                        
                    <div className='w-full p-2 border-solid border-2 border-x-0 borderColor'>
                        <h1 className='font-bold '>R$ { product.preco.toFixed(2) } </h1>
                        <p> em até 6x de { (product.preco/6).toFixed(2) } sem juros </p>
                        <p> Formas de pagamento </p>
                    </div>
                    <button className='rounded-full w-full bg-green-500 p-4 px-6 font-bold border-solid border-2 border-x-0 borderColor text-white'>
                            COMPRE JÁ
                    </button>
                    <div className='py-4 gap-4 border-solid border-2 border-x-0 borderColor'>
                        <p> Frete e prazo </p>
                        <div className='flex py-4 gap-4 '>
                            <input className='px-2 w-full' placeholder='Insira seu CEP'></input>
                            <button className='bg-black text-white p-4 rounded-full'>Calcular</button>
                        </div>
                    </div>
                            
                </>

            ) }
        </main>
    );
}
