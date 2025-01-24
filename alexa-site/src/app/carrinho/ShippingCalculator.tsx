import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatPrice } from '../utils/formatPrice';
import fetchAddressFromCEP from '../utils/fetchAddressFromCEP';
import { ShippingOptionType } from '../utils/types';
import getShippingOptions from '../utils/getShippingOptions';
import InputField from '../checkout/AddressSection/InputField';
import { formatCep } from '../utils/formatCep';

interface ShippingCalculatorProps {
    onSelectShipping: (optionId: string) => void;
    selectedShipping: number | null;
}

export default function ShippingCalculator({ onSelectShipping, selectedShipping }: ShippingCalculatorProps) {
    const [cep, setCep] = useState('');
    const [shippingOptions, setShippingOptions] = useState<ShippingOptionType[] | []>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [tempSelectedShipping, setTempSelectedShipping] = useState<string | null>(selectedShipping ? selectedShipping.toString() : null);
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
            const selectedOption = shippingOptions.find(option => option.price.toString() === tempSelectedShipping);
            if (selectedOption) {
                onSelectShipping(selectedOption.price.toString()); // Passando o preço como string
            }
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
            <DialogTrigger asChild>
                { selectedShipping ? (
                    <Button variant="link" className="p-0 h-auto text-[#C48B9F] hover:text-[#D4AF37] underline text-sm md:text-base lg:text-lg">
                        { formatPrice(shippingOptions.find(option => option.price === selectedShipping)?.price || 0) }
                    </Button>
                ) : (
                    <Button variant="link" className="p-0 h-auto text-[#C48B9F] hover:text-[#D4AF37] text-sm md:text-base lg:text-lg">
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
                        <Label htmlFor="cep" className="text-sm md:text-base lg:text-lg">CEP:</Label>
                        <InputField
                            id="cep"
                            value={ cep }
                            onChange={ handleCepChange }
                            maxLength={ 9 }
                            label="CEP"
                            readOnly={ false }
                        />
                        <Button 
                            type="submit" 
                            className="text-sm md:text-base lg:text-lg"
                            disabled={ isLoading }
                        >
                            { isLoading ? 'Calculando...' : 'Calcular' }
                        </Button>
                    </div>
                </form>
                { error && (
                    <div className="mt-4 text-red-500 text-sm md:text-base">
                        { error }
                    </div>
                ) }
                { !error && showOptions && (
                    <RadioGroup
                        value={ tempSelectedShipping ? tempSelectedShipping : undefined }
                        onValueChange={ setTempSelectedShipping }
                        className="mt-4 md:mt-6 space-y-2 md:space-y-3"
                    >
                        { shippingOptions.map((option) => (
                            <div
                                key={ option.id }
                                className="flex items-center justify-between space-x-2 md:space-x-4 border p-2 md:p-3 lg:p-4 rounded cursor-pointer hover:bg-gray-100"
                                onClick={ () => setTempSelectedShipping(option.price.toString()) }
                            >
                                <div className="flex items-center flex-1">
                                    <RadioGroupItem value={ option.price.toString() } id={ option.id } />
                                    <Label htmlFor={ option.id } className="ml-2 md:ml-3 flex-1 cursor-pointer text-sm md:text-base lg:text-lg">{ option.name }</Label>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm md:text-base lg:text-lg">{ formatPrice(option.price) }</p>
                                    <p className="text-xs md:text-sm lg:text-base text-gray-500">Entrega em até { option.days } dias úteis</p>
                                </div>
                            </div>
                        )) }
                    </RadioGroup>
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
