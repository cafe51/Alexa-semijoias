import React from 'react';
import HeroSection from './components/homePage/HeroSection';
import CategoriesCarousel from './components/homePage/CategoriesCarousel';
import FeaturedProducts from './components/homePage/FeaturedProducts';
import Newsletter from './components/homePage/Newsletter';

const categories = ['Anéis', 'Colares', 'Brincos', 'Pulseiras', 'Pingentes', 'Conjuntos'];

const HomePage = () => {
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen">
            <HeroSection />
            <CategoriesCarousel categories={ categories } />
            <FeaturedProducts />
            <Newsletter />
        </div>
    );
};

export default HomePage;