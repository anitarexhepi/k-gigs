import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#6b8f71] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">K-Gigs</h2>
          <p className="text-sm">
            Lidhim studentët, punëtorët dhe profesionistët e Kosovës me punë të shpejta dhe fleksibile.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Lidhje të Shpejta</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Ballina</a></li>
            <li><a href="/about" className="hover:underline">Rreth Nesh</a></li>
            <li><a href="/gigs" className="hover:underline">Shfleto Punët</a></li>
            <li><a href="/signup" className="hover:underline">Regjistrohu</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Kontakto</h3>
          <ul className="text-sm space-y-2">
            <li>Email: <a href="mailto:support@k-gigs.com" className="hover:underline">support@k-gigs.com</a></li>
            <li>Nr.Tel: 044 123 456</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Na Ndiq</h3>
          <div className="flex space-x-4 text-lg">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e6f0e4]"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e6f0e4]"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e6f0e4]"><FaLinkedinIn /></a>
            <a href="mailto:support@k-gigs.com" className="hover:text-[#e6f0e4]"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3a6b46] pt-6 text-center text-xs text-[#e6f0e4]">
        &copy; {new Date().getFullYear()} K-Gigs. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
};

export default Footer;


