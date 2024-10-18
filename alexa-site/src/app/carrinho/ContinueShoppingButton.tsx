import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function ContinueShoppingButton({ className, router }: { className?: string, router: AppRouterInstance }) {
    return (
        <div className={ className }>
            <Button
                variant="outline"
                className="w-full text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white text-base"
                onClick={ () => {
                    router.push('/');
                } }
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
        </div>
    );
}