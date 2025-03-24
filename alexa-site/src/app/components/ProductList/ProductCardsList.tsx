import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductCard from './ProductCard';
import LoadingIndicator from '../LoadingIndicator';
import ButtonPaginator from '../ButtonPaginator';
import { useEffect, useRef } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { ITEMS_PER_PAGE } from '@/app/utils/constants';

interface ProductCardsListProps {
    orderBy?: string | undefined;
    direction?: 'asc' | 'desc' | undefined;
    sectionName?: string;
    subsection?: string;
    collectionName?: string;
    searchTerm?: string;
    initialData?: {
        products: (ProductBundleType & FireBaseDocument)[];
        hasMore: boolean;
        lastVisible: string | null;
      };
    closeMobileMenu?: () => void;
    itemsPerPage?: number;
    isMobileLayout?: boolean;
    isHomePage?: boolean;
}

export default function ProductCardsList({
    orderBy,
    direction,
    sectionName,
    subsection,
    collectionName,
    searchTerm,
    initialData,
    closeMobileMenu,
    itemsPerPage= ITEMS_PER_PAGE,
    isMobileLayout = false,
    isHomePage = false,
}: ProductCardsListProps) {
    const paginatorRef = useRef<HTMLDivElement>(null);
    
    const { 
        products: productsToShow, 
        isLoading, 
        hasMore, 
        loadMore, 
    } = useProducts({
        sectionName,
        subsection,
        collectionName,
        initialData,
        orderBy,
        direction,
        searchTerm,
        limit: itemsPerPage,
    });

    useEffect(() => {
        if (!hasMore || isLoading || !paginatorRef.current) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                loadMore();
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1,
        });
        observer.observe(paginatorRef.current);
        return () => {
            if (paginatorRef.current) {
                observer.unobserve(paginatorRef.current);
            }
            observer.disconnect();
        };
    }, [hasMore, isLoading, loadMore, paginatorRef]);

    if (isLoading && productsToShow.length === 0) {
        return <LoadingIndicator />;
    }
    
    if (productsToShow.length === 0) {
        if (searchTerm) {
            return <h1 className="text-center mt-8">Nenhum produto encontrado para &ldquo;{ searchTerm }&rdquo;</h1>;
        }
        return <h1 className="text-center mt-8">Ainda não há produtos nessa seção</h1>;
    }

    return (
        <div
            className={
                isMobileLayout
                    ? 'grid grid-cols-2 gap-3'
                    : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
            }
        >
            { productsToShow.map((productData) => (
                <ProductCard key={ productData.id } product={ productData } homePage={ isHomePage } closeMobileMenu={ closeMobileMenu } />
            )) }
            { hasMore && !isMobileLayout &&(
                <div ref={ paginatorRef }>
                    <ButtonPaginator loadMore={ loadMore } isLoading={ isLoading }>
                                Mostrar mais
                    </ButtonPaginator>
                </div>
            ) }
        </div>
    );
}