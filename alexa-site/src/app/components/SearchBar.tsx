'use client';
import { IoSearchSharp } from 'react-icons/io5';

export default function SearchBar() {


    return (
        <div className=" bg-white flex justify-between py-0">
            <input className='p-4 focus:outline-none ' type='text' placeholder="O que você está procurando?" />
            <button type='submit' className='p-4'>
                <IoSearchSharp size={ 30 } />
            </button>

        </div>
    );
}
