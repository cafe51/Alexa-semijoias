// src/app/carrinho/ShippingCalculator.tsx
import { useState, useMemo } from 'react';
import { ShippingOptionType } from '../utils/types';
import { formatPrice } from '../utils/formatPrice';
import fetchAddressFromCEP from '../utils/fetchAddressFromCEP';
import getShippingOptions from '../utils/getShippingOptions';
import { formatCep } from '../utils/formatCep';
import InputField from '../checkout/AddressSection/InputField';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import FreeShippingSection from '../checkout/DeliveryPriceSection/FreeShippingSection';
import FreeShippingWarning from '../components/FreeShippingWarning';

interface ShippingCalculatorProps {
  onSelectShipping: (optionPrice: string) => void;
  selectedShipping: number | null;
  cartPrice: number;
  couponDiscount: number | 'freteGratis';
  showFreeShippingSection?: boolean;
}

export default function ShippingCalculator({
    onSelectShipping,
    selectedShipping,
    cartPrice,
    couponDiscount,
    showFreeShippingSection = true,
}: ShippingCalculatorProps) {
    const [cep, setCep] = useState('');
    const [shippingOptions, setShippingOptions] = useState<ShippingOptionType[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    // Armazena o valor selecionado de forma única: "id||price"
    const [tempSelectedShipping, setTempSelectedShipping] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = formatCep(e.target.value);
        setCep(newCep);
    };

    const handleCalculate = async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setShowOptions(false);

        try {
            const fetchedAddress = await fetchAddressFromCEP(cep);

            if (fetchedAddress.erro) {
                setError('CEP não encontrado. Por favor, verifique o CEP informado.');
                return;
            }

            const options = getShippingOptions(fetchedAddress.localidade, fetchedAddress.uf);
            setShippingOptions(options);
            setShowOptions(true);
        } catch (error) {
            setError('Ocorreu um erro ao calcular o frete. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (tempSelectedShipping) {
            const [selectedId] = tempSelectedShipping.split('||');
            let selectedOption = shippingOptions.find(option => option.id === selectedId);
            if (selectedOption) {
                // Determina a opção mais barata e a meta para frete grátis
                const cheapestOption = shippingOptions.reduce(
                    (prev, current) => (prev.price < current.price ? prev : current),
                    shippingOptions[0],
                );
                let valorMinimoParaFreteGratis: number;
                if (cheapestOption.price <= 40) {
                    valorMinimoParaFreteGratis = 200;
                } else if (cheapestOption.price > 40 && cheapestOption.price <= 70) {
                    valorMinimoParaFreteGratis = 300;
                } else if (cheapestOption.price > 70) {
                    valorMinimoParaFreteGratis = 350;
                } else {
                    throw new Error('Preço inválido');
                }
                const discountValue = typeof couponDiscount === 'number' ? couponDiscount : 0;
                const precoFaltanteParaFreteGratis =
          couponDiscount === 'freteGratis'
              ? 0
              : valorMinimoParaFreteGratis - cartPrice + discountValue;
                // Se a opção selecionada for a mais barata e a meta estiver atingida, define o frete como gratuito
                if (selectedOption.name === cheapestOption.name && precoFaltanteParaFreteGratis <= 0) {
                    selectedOption = { ...selectedOption, price: 0 };
                }
                onSelectShipping(selectedOption.price.toString());
            }
        }
        setIsOpen(false);
        // Limpa a seleção temporária para próximas aberturas
        setTempSelectedShipping(null);
    };

    // Calcula os dados para exibição da barra de frete grátis e identifica a opção mais barata
    const freeShippingData = useMemo(() => {
        if (shippingOptions.length === 0) {
            return { precoFaltanteParaFreteGratis: 0, precoFaltanteEmPorcentagem: '0%', cheapestOption: null };
        }
        const cheapestOption = shippingOptions.reduce(
            (prev, current) => (prev.price < current.price ? prev : current),
            shippingOptions[0],
        );
        let valorMinimoParaFreteGratis: number;
        if (cheapestOption.price <= 40) {
            valorMinimoParaFreteGratis = 200;
        } else if (cheapestOption.price > 40 && cheapestOption.price <= 70) {
            valorMinimoParaFreteGratis = 300;
        } else if (cheapestOption.price > 70) {
            valorMinimoParaFreteGratis = 350;
        } else {
            throw new Error('Preço inválido');
        }
        const discountValue = typeof couponDiscount === 'number' ? couponDiscount : 0;
        const precoFaltanteParaFreteGratis =
      couponDiscount === 'freteGratis'
          ? 0
          : valorMinimoParaFreteGratis - cartPrice + discountValue;
        const percentage = Math.min(100, (cartPrice / valorMinimoParaFreteGratis) * 100);
        const precoFaltanteEmPorcentagem = percentage + '%';
        return { precoFaltanteParaFreteGratis, precoFaltanteEmPorcentagem, cheapestOption };
    }, [shippingOptions, cartPrice, couponDiscount]);

    // Flag para indicar se o frete selecionado é gratuito
    const isFreeShipping = selectedShipping === 0 && freeShippingData.cheapestOption;

    return (
        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
            <DialogTrigger asChild>
                { selectedShipping !== null ? (
                    <Button variant="link" className="p-0 h-auto">
                        { isFreeShipping ? (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center">
                                    <span className="line-through text-sm text-gray-400">
                                        { formatPrice(freeShippingData.cheapestOption!.price) }
                                    </span>
                                    { !showFreeShippingSection && <span className="text-[#D4AF37] text-base font-bold ml-2"> FRETE GRÁTIS</span> }
                                    { !!showFreeShippingSection && <span className="text-[#D4AF37] text-base font-bold ml-2"> GRÁTIS</span> }
                                </div>

                            </div>
                        ) : 
                            showFreeShippingSection
                                ? (
                                    <span className="text-[#C48B9F] hover:text-[#D4AF37] underline text-sm md:text-base lg:text-lg">
                                        { formatPrice(selectedShipping) }
                                    </span>
                                )
                                : (
                                    <span className="text-[#C48B9F] hover:text-[#D4AF37] underline text-sm md:text-base lg:text-lg">
                                        { 'FRETE: ' + formatPrice(selectedShipping) }
                                    </span>
                                )
                        }
                    </Button>
                ) : (
                    <Button
                        variant="link"
                        className="p-0 h-auto text-[#C48B9F] hover:text-[#D4AF37] text-sm md:text-base lg:text-lg"
                    >
                        Calcular frete
                    </Button>
                ) }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl lg:text-2xl">Calcular Frete</DialogTitle>
                </DialogHeader>
                <form onSubmit={ handleCalculate } className="space-y-4 md:space-y-6">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Label htmlFor="cep" className="text-sm md:text-base lg:text-lg">
              CEP:
                        </Label>
                        <InputField
                            id="cep"
                            value={ cep }
                            onChange={ handleCepChange }
                            maxLength={ 9 }
                            label="CEP"
                            readOnly={ false }
                        />
                        <Button type="submit" className="text-sm md:text-base lg:text-lg" disabled={ isLoading }>
                            { isLoading ? 'Calculando...' : 'Calcular' }
                        </Button>
                    </div>
                </form>
                { error && (
                    <div className="mt-4 text-red-500 text-sm md:text-base">{ error }</div>
                ) }
                { (!error && showOptions) && (
                    <>
                        {
                            !showFreeShippingSection && <FreeShippingWarning precoDoProduto={ cartPrice } precoParaFreteGratis={ freeShippingData.precoFaltanteParaFreteGratis + cartPrice } />
                        }
                        { shippingOptions.length > 0 && showFreeShippingSection && (
                            <FreeShippingSection
                                precoFaltanteEmPorcentagem={ freeShippingData.precoFaltanteEmPorcentagem }
                                precoFaltanteParaFreteGratis={ freeShippingData.precoFaltanteParaFreteGratis }
                            />
                        ) }
                        <RadioGroup
                            value={ tempSelectedShipping ?? undefined }
                            onValueChange={ setTempSelectedShipping }
                            className="mt-4 md:mt-6 space-y-2 md:space-y-3"
                        >
                            { shippingOptions.map((option) => {
                                const uniqueValue = `${option.id}||${option.price}`;
                                const isCheapestAndFree =
                  freeShippingData.cheapestOption &&
                  option.id === freeShippingData.cheapestOption.id &&
                  freeShippingData.precoFaltanteParaFreteGratis <= 0;
                                return (
                                    <div
                                        key={ option.id }
                                        className="flex items-center justify-between space-x-2 md:space-x-4 border p-2 md:p-3 lg:p-4 rounded cursor-pointer hover:bg-gray-100"
                                        onClick={ () => setTempSelectedShipping(uniqueValue) }
                                    >
                                        <div className="flex items-center flex-1">
                                            <RadioGroupItem value={ uniqueValue } id={ option.id } />
                                            <Label
                                                htmlFor={ option.id }
                                                className="ml-2 md:ml-3 flex-1 cursor-pointer text-sm md:text-base lg:text-lg"
                                            >
                                                { option.name }
                                            </Label>
                                        </div>
                                        <div className="text-right">
                                            { isCheapestAndFree ? (
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center">
                                                        <span className="line-through text-sm text-gray-400">
                                                            { formatPrice(option.price) }
                                                        </span>
                                                        <span className="text-[#D4AF37] text-base font-bold ml-2">GRÁTIS</span>
                                                    </div>
                                                    <p className="text-xs md:text-sm lg:text-base text-gray-500">
                            Entrega em até { option.days } dias úteis
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <p className="text-sm md:text-base lg:text-lg">{ formatPrice(option.price) }</p>
                                                    <p className="text-xs md:text-sm lg:text-base text-gray-500">
                            Entrega em até { option.days } dias úteis
                                                    </p>
                                                </div>
                                            ) }
                                        </div>
                                    </div>
                                );
                            }) }
                        </RadioGroup>
                    </>
                ) }
                <DialogFooter>
                    <Button
                        onClick={ handleConfirm }
                        disabled={ !tempSelectedShipping }
                        aria-disabled={ !tempSelectedShipping }
                        className="text-sm md:text-base lg:text-lg"
                    >
            Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
