import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import SectionCard from './SectionCard';

export default function Sections({
    products,
}: {
  products: (ProductBundleType & FireBaseDocument)[];
}) {

    const aspect = 'aspect-[10/11]';

    return (
        <section className="py-14 hidden md:flex md:flex-col md:items-center md:justify-center  "> 
            <div className="w-full grid grid-cols-2 gap-4 ">
                { /* Coluna Esquerda: container com aspect ratio de 16/17 */ }
                <div className={ `relative ${ aspect }` }>
                    <SectionCard
                        product={ products[0] }
                        containerClassName="w-full h-full"
                    />
                </div>

                { /* Coluna Direita: container com o mesmo aspect ratio, subdividido em 2 linhas */ }
                <div className={ `relative ${ aspect } grid grid-rows-[9fr,8fr] gap-4` }>
                    { /* Linha superior: banner horizontal */ }
                    <div className="relative">
                        <SectionCard
                            product={ products[1] }
                            containerClassName="w-full h-full"
                        />
                    </div>
                    { /* Linha inferior: grid com duas colunas para imagens quadradas */ }
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <SectionCard
                                product={ products[2] }
                                containerClassName="w-full h-full"
                            />
                        </div>
                        <div className="relative">
                            <SectionCard
                                product={ products[3] }
                                containerClassName="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
