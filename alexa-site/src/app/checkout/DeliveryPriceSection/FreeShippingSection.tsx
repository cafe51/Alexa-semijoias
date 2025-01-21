// app/checkout/DeliveryPriceSection/FreeShippingSection.tsx

import Link from 'next/link';

export default function FreeShippingSection({ precoFaltanteEmPorcentagem, precoFaltanteParaFreteGratis }: { precoFaltanteEmPorcentagem: string, precoFaltanteParaFreteGratis: number }) {
    return (
        precoFaltanteParaFreteGratis > 0 ?
            (
                <div className="p-4 border-dashed border-2 border-[#D4AF37]/50 bg-[#D4AF37]/2 rounded-md mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div className="bg-[#D4AF37]/80 h-2.5 rounded-full" style={ { width: precoFaltanteEmPorcentagem } }></div>
                    </div>
                    <p className="text-[#D4AF37] text-base mb-2">
          Quase lá, adicione mais <span className="font-bold">{ 'R$ ' + precoFaltanteParaFreteGratis.toFixed(2) }</span> em produtos para ganhar <span className="font-bold text-lg">FRETE GRÁTIS</span>.
                    </p>
                    <Link href={ '/section' }>
                        <h3 className="bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/50 px-4 py-2 rounded-md text-sm text-center">
                    Adicionar mais produtos
                        </h3>
                    </Link>
                </div>
            )
            :
            (
                <div className="p-4 border-dashed border-2 border-[#D4AF37]/50 bg-[#D4AF37]/5 rounded-md mb-4">
                    <p className="text-[#D4AF37] text-xl mb-2">Parabéns!</p>
                    <p className="text-[#D4AF37] text-sm mb-2">Você ganhou uma opção de <span className="font-bold">FRETE GRÁTIS</span> para esta compra.</p>
                </div>
            )
        
    );
}
