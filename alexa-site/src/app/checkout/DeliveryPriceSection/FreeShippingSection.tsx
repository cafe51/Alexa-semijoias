// app/checkout/DeliveryPriceSection/FreeShippingSection.tsx

export default function FreeShippingSection({ precoFaltanteEmPorcentagem, precoFaltanteParaFreteGratis }: { precoFaltanteEmPorcentagem: string, precoFaltanteParaFreteGratis: number }) {
    return (
        <div className="p-4 border-dashed border-2 border-green-500 bg-green-50 rounded-md mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={ { width: precoFaltanteEmPorcentagem } }></div>
            </div>
            <p className="text-green-600 text-sm mb-2">
          Quase lá, adicione mais <span className="font-bold">{ 'R$ ' + precoFaltanteParaFreteGratis.toFixed(2) }</span> em produtos para ganhar <span className="font-bold">FRETE GRÁTIS</span>.
            </p>
            <button className="bg-green-100 text-green-700 border border-green-500 px-4 py-2 rounded-md text-sm">
          Adicionar mais produtos
            </button>
        </div>
    );
}
  