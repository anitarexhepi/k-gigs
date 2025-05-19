import React from 'react';

const testimonials = [
  {
    name: 'Arta, Prishtinë',
    text: 'Gjeta një dizajner grafik brenda ditës. Platforma më e lehtë për të gjetur ndihmë të shpejtë!',
    image: '/img/testimonial1.jpg',
  },
  {
    name: 'Luan, Gjakovë',
    text: 'Si freelancer kam gjetur shumë klientë të rinj në K Gigs. E rekomandoj shumë!',
    image: '/img/testimonial2.jpg',
  },
  {
    name: 'Erion, Ferizaj',
    text: 'Kjo platformë më ndihmoi të filloj karrierën si zhvillues web.',
    image: '/img/testimonial3.jpg',
  },
  {
    name: 'Elira, Mitrovicë',
    text: 'Përvojë fantastike! Gjeta një përkthyese për një projekt urgjent shumë lehtë.',
    image: '/img/testimonial4.jpg',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-12 relative">
      {/* Decorative faded green line */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-green-200 rounded-full opacity-60"></div>

      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-16 font-poppins">
        Çfarë thonë përdoruesit tanë?
      </h2>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {testimonials.map(({ name, text, image }, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={image}
              alt={name}
              className="w-40 h-40 object-cover rounded-xl shadow-lg"
            />
            <div className="relative bg-[#f3f8f2] p-6 rounded-2xl shadow-md text-left">
              {/* Left-pointing triangle bubble */}
              <div className="absolute left-[-12px] top-6 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-[#f3f8f2]" />
              <p className="text-base italic text-gray-800 mb-4 leading-relaxed font-nunito">
                "{text}"
              </p>
              <p className="text-green-700 font-semibold text-base font-nunito">{name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
