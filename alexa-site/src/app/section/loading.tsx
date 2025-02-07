// src/app/section/loading.tsx
import LoadingIndicator from '@/app/components/LoadingIndicator';

export default function SectionLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingIndicator />
        </div>
    );
}
