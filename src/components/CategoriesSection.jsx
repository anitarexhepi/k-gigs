import React from 'react';
import CategoryCard from './CategoryCard';
import graphicDesignAnimation from '../animations/graphic-design.json';
import webDevAnimation from '../animations/web-development.json';
import writingTranslationAnimation from '../animations/writing_translation.json';
import digitalMarketingAnimation from '../animations/digital-marketing.json';

const categories = [
  { title: 'Dizajn Grafik', animation: graphicDesignAnimation },
  { title: 'Zhvillim Web', animation: webDevAnimation },
  { title: 'Shkrim & Përkthim', animation: writingTranslationAnimation },
  { title: 'Marketing Digjital', animation: digitalMarketingAnimation },
];

const CategoriesSection = () => (
  <section className="py-16 px-6 bg-[#f0f6ed]"> {/* Light green background */}
    <div className="text-center mb-10"> {/* Centering the title */}
      <h2 className="text-4xl font-semibold text-green-900"> {/* Title color adjusted */}
        Kategoritë Popullore
      </h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {categories.map(({ title, animation }) => (
        <CategoryCard key={title} title={title} animationData={animation} />
      ))}
    </div>
  </section>
);

export default CategoriesSection;
