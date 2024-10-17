import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import { ChevronRight, CreditCard, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '../utils/formatPrice';
import { statusColors } from '../utils/statusColors';
import { FireBaseDocument, OrderType } from '../utils/types';
import { formatDate } from '../utils/formatDate';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function CardImages({ pedido }: { pedido: OrderType & FireBaseDocument }) {
    return(
        <div className='relative h-24 flex self-start'>
            { pedido.cartSnapShot.map((item, index) => {
                return (
                    <div
                        key={ index }
                        className={ 'absolute rounded-lg w-24 h-24 overflow-hidden' }
                        style={ { left: index * (80 - (index ** 2.4 <= 70 ? index ** 2.4 : 80)), zIndex: pedido.cartSnapShot.length - index } }
                    >
                        <Image
                            src={ item.image }
                            alt={ `Image ${index + 1}` }
                            fill
                            sizes='96px'
                            className=" object-cover border-2 border-white rounded-2xl "
                        />
                    </div>
                );

            },
            ) }
        </div>
    );
}

export default function PurchaseCard({ pedido, isLargeScreen }: { pedido: OrderType & FireBaseDocument, isLargeScreen: boolean }){
    const router = useRouter();

    return (
        <Card className="mb-6 border-[#F8C3D3] shadow-md rounded w-full ">
            <CardHeader className="bg-[#F8C3D3] text-[#333333] sm:px-4 sm:py-4 w-full ">
                <div className="flex flex-wrap gap-3 w-full md:flex-nowrap md:justify-around md:*:text-lg">
                    <CardTitle className=" font-semibold mb-2 sm:mb-0">Nº { pedido.id }</CardTitle>
                    {
                        <p className="text-sm ">{  formatDate(pedido.updatedAt.toDate(), isLargeScreen) }</p>
                    }
                    <Badge className={ `${statusColors[pedido.status]} text-white w-fit h-fit` }>
                        { pedido.status }
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4 ">
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0 md:text-lg md:h-6 md:w-6" />
                        <p className="text-sm md:text-lg">{ pedido.endereco.logradouro }, { pedido.endereco.numero } - { pedido.endereco.bairro }, { pedido.endereco.localidade } - { pedido.endereco.uf }</p>
                    </div>
                    <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 flex-shrink-0 md:text-lg md:h-6 md:w-6" />
                        <p className="text-sm md:text-lg">{ pedido.paymentOption }</p>
                    </div>
                    <CardImages pedido={ pedido }/>
                    <Separator />
                    <div className="flex flex-wrap gap-4 lg:flex-nowrap justify-between items-center">
                        <p className="font-semibold text-lg md:text-xl">{ formatPrice(pedido.valor.total) }</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white md:text-lg"
                            onClick={ () => router.push(`/pedido/${pedido.id}`) }
                        >
              Ver Pedido Completo
                            <ChevronRight className="ml-2 h-4 w-4 md:h-6 md:w-6" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
