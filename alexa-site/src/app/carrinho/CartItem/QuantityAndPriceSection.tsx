import QuantitySelectionCartBox from '@/app/components/QuantitySelectionCartBox';
import CartCardPrice from '../CartCardPrice';
import { QuantityAndPriceSectionProps } from './cartCardInterfaces';

export default function QuantityAndPriceSection({ cartItem, removeOne, addOne, setIsLoadingButton, isLoadingButton }: QuantityAndPriceSectionProps) {
    return (
        <>
            <QuantitySelectionCartBox
                quantity={ cartItem.quantidade }
                removeOne={ () => {
                    setIsLoadingButton(true);
                    removeOne();
                    setTimeout(() => setIsLoadingButton(false), 400);
                } }
                addOne={ () => {
                    setIsLoadingButton(true);
                    addOne();
                    setTimeout(() => setIsLoadingButton(false), 400);
                } }
                stock={ cartItem.estoque }
                isLoadingButton={ isLoadingButton }
            />
            <div className="mt-1">
                <CartCardPrice value={ cartItem.value } quantidade={ cartItem.quantidade } />
            </div>
        </>
    );
}
