import React from 'react';
import CategoriesSection from './CategoriesSection';
import TestimonialsSection from './TestimonialsSection';
import ServiceCategories from './ServiceCategories';

const HomePage = () => {
  return (
    <div className="bg-[#e6f0e4] text-gray-800">
      {/* Hero Section */}
      <section className="relative text-center min-h-[90vh] px-4 bg-[#d3e4cd] overflow-hidden flex items-center justify-center">
  <video
    src="/img/hero-video.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover opacity-40"
  />
  <div className="relative z-10 max-w-3xl">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-green-900 font-poppins leading-tight">
      Mirësevini në K-Gigs
    </h1>
    <p className="text-lg md:text-xl text-green-800 font-nunito leading-relaxed">
      Platforma më e mirë në Kosovë për punë të përkohshme dhe gig-e. Ndihmojmë individë dhe biznese të gjejnë talente dhe mundësi bashkëpunimi të shpejtë dhe efektiv.
    </p>
    <div className="mt-8 flex justify-center gap-6">
      <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-medium font-nunito transition ease-in-out duration-300 transform hover:scale-105">
        Posto një punë
      </button>
      <button className="bg-white text-green-800 border border-green-700 hover:bg-green-100 px-8 py-4 rounded-full font-medium font-nunito transition ease-in-out duration-300 transform hover:scale-105">
        Gjej punë
      </button>
    </div>
  </div>
</section>


      {/* Service Categories Section (after Hero) */}
      <ServiceCategories />

      {/* Categories Section with Animations */}
      <CategoriesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-[#e6f0e4]">
  <h2 className="text-3xl font-bold text-center text-green-900 mb-12 font-poppins relative">
    Pse të zgjedhësh <span className="text-green-700">K-Gigs?</span>
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <div className="text-4xl mb-4 text-green-600">⚡</div>
      <h3 className="text-xl font-semibold text-green-800 mb-2">Shpejtësi dhe thjeshtësi</h3>
      <p className="text-gray-700">Krijo, gjej ose ofro punë me vetëm disa klikime. Pa komplikime.</p>
    </div>
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <div className="text-4xl mb-4 text-green-600">🌱</div>
      <h3 className="text-xl font-semibold text-green-800 mb-2">Mbështetje për komunitetin</h3>
      <p className="text-gray-700">Ne ndihmojmë punëtorët lokalë dhe bizneset të lidhen e rriten së bashku.</p>
    </div>
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <div className="text-4xl mb-4 text-green-600">🔒</div>
      <h3 className="text-xl font-semibold text-green-800 mb-2">Siguri & Transparencë</h3>
      <p className="text-gray-700">Çdo përdorues është i verifikuar. Platforma jonë mbron të dhënat dhe pagesat tuaja.</p>
    </div>
  </div>
</section>


      {/* Call to Action */}
      <section className="relative py-24 px-6 bg-gradient-to-r from-[#e3f5d9] to-[#d3e4cd] text-center overflow-hidden">
  {/* Element zbukurues në sfond */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-green-200 rounded-full opacity-30 blur-3xl -z-10" />
  <div className="absolute bottom-0 right-0 w-52 h-52 bg-green-100 rounded-full opacity-40 blur-2xl -z-10" />

  <h2 className="text-4xl font-extrabold text-green-800 mb-4 font-poppins">
    Bashkohu me komunitetin tonë 🌿
  </h2>
  <p className="text-lg md:text-xl text-green-900 max-w-2xl mx-auto font-nunito mb-10">
    Çdo ditë, përdorues si ti po krijojnë mundësi të reja, ndihmojnë njëri-tjetrin dhe ndërtojnë karriera në K-Gigs.
  </p>

  <div className="flex justify-center gap-6 flex-wrap">
    <button className="bg-white text-green-800 border border-green-700 hover:bg-green-100 px-8 py-4 rounded-full font-medium font-nunito transition ease-in-out duration-300 transform hover:scale-105">
      Shfleto mundësitë
    </button>
  </div>
</section>

    </div>
  );
};

export default HomePage;
