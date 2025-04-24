import toTitleCase from '@/app/utils/toTitleCase';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import VideoPlayer from '../VideoPlayer';

const TEXTO_DA_QUALIDADE_DA_SEMIJOIA = '\nNossas peças são de alto padrão, pois são cuidadosamente expostas ao banho de ouro 18k que garante um brilho intenso e resistência superior.';
const TEXTO_DA_QUALIDADE_DA_JOIA_EM_ACO = '\nO aço inox de alta qualidade garante uma durabilidade superior, evitando manchas, oxidação e desbotamento, mesmo com o uso diário. São peças feitas para brilhar tanto quanto você, sem perder seu charme ao longo do tempo. Para toda a vida. ';
const TEXTO_DA_GARANTIA = '\n\n Quem conhece nossas semijoias desfruta de confiança e tranquilidade, pois nossos acessórios possuem 1 ano de garantia para defeito de fabricação no banho de ouro 18k.\n';

export default function ProductDescription({ product }: {product: ProductBundleType & FireBaseDocument}) {
    return (
        <section>
            <p className="text-gray-600 md:text-base mb-6 whitespace-pre-line ">
                { product.description }

            </p>

            {
                product.videoUrl && <VideoPlayer
                    src={ product.videoUrl }
                    className="rounded-2xl shadow-md"
                />
            }

            <p className="text-gray-600 md:text-base mb-6 whitespace-pre-line ">
                {
                    '\n\n' + toTitleCase(product.name) + ' ' + 'é uma verdadeira semijoia, uma peça com a garantia de qualidade Alexa Semijoias.' +
                    (product.sections.includes('joias em aço inox')
                        ? TEXTO_DA_QUALIDADE_DA_JOIA_EM_ACO
                        : TEXTO_DA_QUALIDADE_DA_SEMIJOIA) +
                      (!product.sections.includes('joias em aço inox') ? TEXTO_DA_GARANTIA : '')
                }
            </p>
        </section>
    );
}