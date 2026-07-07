import React, { FC } from 'react';
import { QuoteBox } from './QuoteBox';
import heroImage from '../src/assets/images/organic_farming_hero_1783453083776.jpg';

export const FeaturedOrganicInsight: FC = () => {
  return (
    <div className="container mx-auto px-6 my-24">
      <div className="rounded-[3rem] overflow-hidden shadow-2xl relative">
        <img 
          src={heroImage}
          alt="Organic Farming" 
          className="w-full h-96 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center p-8">
           <div className="max-w-xl text-center text-white space-y-4">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">Healthy Soil, Healthy People 🥕</h2>
             <p className="text-base md:text-xl font-medium opacity-90">Embracing the natural rhythm of life through sustainable organic practices.</p>
           </div>
        </div>
      </div>
      <QuoteBox 
        quote="The care of the Earth is our most ancient and most worthy, and after all, our most pleasing responsibility." 
        author="Wendell Berry" 
        source="https://www.goodreads.com/quotes/57270-the-care-of-the-earth-is-our-most-ancient-and" 
      />
    </div>
  );
};
