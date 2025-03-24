// app/components/Header.tsx
'use client';
import { usePathname } from 'next/navigation';
import SimpleHeader from './SimpleHeader';
import { CollectionType, FireBaseDocument, SectionType } from '@/app/utils/types';
import FullHeader from './FullHeader';

interface HeaderProps {
  initialMenuSections?: (SectionType & FireBaseDocument)[];
  initialCollections?: (CollectionType & FireBaseDocument)[];
}

export default function Header({ initialMenuSections = [], initialCollections = [] }: HeaderProps) {
    const pathname = usePathname();
    const pathSegment = pathname.split('/')[1];

    if (['login', 'cadastro', 'checkout'].includes(pathSegment)) return <SimpleHeader />;
    if (pathSegment === 'admin') return <></>;

    return <FullHeader initialMenuSections={ initialMenuSections } initialCollections={ initialCollections } />;
}
