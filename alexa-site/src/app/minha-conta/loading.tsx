// src/app/section/[sectionSlugName]/loading.tsx
import LoadingIndicator from '@/app/components/LoadingIndicator';

export default function SectionSlugLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingIndicator />
        </div>
    );
}
