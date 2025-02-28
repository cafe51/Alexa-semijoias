export default function StockWarning({ stock }: { stock: number }) {
    return (
        <div className="p-2 border border-[#F8C3D3] rounded-lg w-full text-center">
            <p className="text-gray-500 text-sm md:text-base">
          Apenas <span className="font-bold">{ stock }</span>{ ' ' }
                <span>{ stock > 1 ? 'peças' : 'peça' }</span> em estoque!
            </p>
        </div>
    );
}
  