const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-2">Carregando...</p>
    </div>
);

export default LoadingIndicator;
