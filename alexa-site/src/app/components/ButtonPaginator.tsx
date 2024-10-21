import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Componente de spinner de carregamento

interface PaginatorProps {
    isLoading: boolean;
    loadMore: () => void;
    children: React.ReactNode;
}

export default function ButtonPaginator({ isLoading, loadMore, children }: PaginatorProps) {
    return (
        <div className="mt-6 text-center">
            <Button
                variant='ghost'
                className="bg-[#F8C3D3] text-[#333333] hover:bg-[#C48B9F] hover:text-white
                px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
                onClick={ loadMore }
                disabled={ isLoading }
            >
                { isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 animate-spin" />
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl">Carregando...</span>
                    </>
                ) : (
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl">{ children }</span>
                ) }
            </Button>
        </div>
    );
}
