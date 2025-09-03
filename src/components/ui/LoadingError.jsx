export const LoadingError = ({ error, onRetry }) => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="bg-white rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)] p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-[#263238] mb-2">Error de Conexión</h3>
                <p className="text-[#546E7A] mb-6">{error}</p>
                <button
                    onClick={onRetry}
                    className="bg-[#00A4EF] hover:bg-[#0D47A1] text-white px-6 py-2 rounded-md transition-colors"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
};