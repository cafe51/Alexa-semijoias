const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-64 md:h-4/6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#F8C3D3]"></div>
        <p className="ml-2">Carregando...</p>
    </div>
);

export default LoadingIndicator;
