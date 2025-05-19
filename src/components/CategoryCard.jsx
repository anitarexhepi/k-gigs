import React from 'react';
import Lottie from 'lottie-react';

const CategoryCard = ({ title, animationData }) => (
  <div className="bg-[#6b8f71] p-4 rounded-xl shadow hover:shadow-lg transition text-center"> {/* Reduced p-6 to p-4 */}
    {/* Title Section with Green Background */}
    <div className="bg-[#6b8f71] text-white text-lg font-semibold py-2 rounded-t-xl">
      <h3>{title}</h3>
    </div>

    {/* Lottie Animation */}
    <div className="bg-white p-4 rounded-b-xl"> {/* Reduced p-6 to p-4 */}
      <Lottie animationData={animationData} loop={true} className="w-32 h-32 mx-auto mb-4" />
    </div>
  </div>
);

export default CategoryCard;
