import Link from 'next/link';

interface NavBarItemProps {
    sectionName: string;
}

export default function NavBarItem({ sectionName }: NavBarItemProps) {
    return(
        <Link href={ `/section/${sectionName}` }
            className={ 'hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300 p-2' }>
            { sectionName.charAt(0).toUpperCase() + sectionName.slice(1) }
        </Link>
    );
}