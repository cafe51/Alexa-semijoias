interface NavBarItemProps {
    sectionName: string;
}

export default function NavBarItem({ sectionName }: NavBarItemProps) {
    return(
        <a href={ `${sectionName}` }
            className={ 'hover:text-gray-800 hover:bg-gray-200 transition-colors duration-300 p-2' }>
            { sectionName.charAt(0).toUpperCase() + sectionName.slice(1) }
        </a>
    );
}