import {
  Users,
  Gift,
  Globe,
  ShieldCheck,
  TrendingUp,
  Heart,
  Briefcase,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function AboutUs() {
  return (
    <div className="bg-[#e6f0e4] min-h-screen py-8 px-4 relative font-sans text-gray-800">

      {/* Hero Section */}
      <header className="relative h-[32rem] w-full bg-[#d3e4cd] flex items-center justify-center px-4 rounded-3xl shadow-lg overflow-hidden mb-20">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/img/aboutus.jpg')" }}
        />
        <div className="absolute inset-0 bg-white/50 z-10" />
        <div className="relative z-20 text-center font-poppins">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 text-green-900 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Rreth K-Gigs
          </motion.h1>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto font-nunito text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Platforma që lidh profesionistët me mundësi afatshkurtra pune në Kosovë.
          </motion.p>
        </div>
      </header>

      {/* Rreth KGigs */}
      <div className="bg-[#d3e4d1cc] py-12 mb-20">
        <div className="max-w-4xl mx-auto text-center text-[#3a6b46] px-6">
          <h2 className="text-4xl font-bold mb-6">Më shumë rreth nesh</h2>
          <p className="mb-4 text-lg">
            Misioni ynë është të lidhim punëkërkuesit me mundësi të shpejta pune në Kosovë, duke siguruar transparencë dhe besueshmëri.
          </p>
          <p className="mb-4 text-lg">
            Jemi për të gjithë ata që kërkojnë punë të përkohshme apo shërbime të shpejta, dhe për biznese që duan staf të besueshëm.
          </p>
          <p className="text-lg">
            Ofrojmë një platformë të thjeshtë, të sigurt dhe efikase për punë të përkohshme dhe gig-e në Kosovë.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="grid gap-8 md:grid-cols-3 mb-20">
        {[
          {
            icon: <Users className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "Komunitet Aktiv",
            desc: "Mbi 10,000 përdorues të regjistruar.",
          },
          {
            icon: <Briefcase className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "Oferta të Shpejta",
            desc: "Gjej punë ose ofro shërbime në pak minuta.",
          },
          {
            icon: <Heart className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "E Sigurt & e Lehtë",
            desc: "Ndërveprim i sigurt mes klientëve dhe profesionistëve.",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition"
            whileHover={{ scale: 1.05 }}
          >
            {card.icon}
            <h3 className="text-xl font-semibold text-[#3a6b46]">{card.title}</h3>
            <p className="mt-3 text-[#2e4d29]">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Section 2 */}
      <div className="grid gap-8 md:grid-cols-3 mb-20">
        {[
          {
            icon: <Users className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "Bashkëpunim",
            desc: "Lidhu me profesionistë të tjerë dhe ndërto bashkëpunime të qëndrueshme.",
          },
          {
            icon: <Gift className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "Projekte të përshtatura",
            desc: "Gjej punë që përputhen me aftësitë dhe orarin tënd.",
          },
          {
            icon: <Globe className="w-12 h-12 text-[#4b7c53] mb-4" />,
            title: "Mbulesë Kombëtare",
            desc: "Në çdo qytet të Kosovës, K-Gigs është me ty.",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition"
            whileHover={{ scale: 1.05 }}
          >
            {card.icon}
            <h3 className="text-xl font-semibold text-[#3a6b46]">{card.title}</h3>
            <p className="mt-3 text-[#2e4d29]">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center text-[#2e4d29] mb-10">Si funksionon?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Regjistrohu", desc: "Krijo profilin në më pak se 2 minuta." },
            { step: "2", title: "Kërko projekte", desc: "Zgjedh projekte që të përshtaten." },
            { step: "3", title: "Apliko", desc: "Dërgo aplikimin dhe bisedo me klientin." },
            { step: "4", title: "Fito", desc: "Realizo punën dhe merr pagesën." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#4a6a4a] p-6 rounded-xl shadow-md text-center text-white hover:bg-[#3f5a3f] transition"
            >
              <div className="text-3xl font-extrabold mb-2">{item.step}</div>
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="mt-2 font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community CTA */}
      <motion.div
        className="relative mt-24 mb-24 max-w-3xl mx-auto bg-gradient-to-r from-[#e3f5d9] to-[#d3e4cd] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6"
        whileHover={{ scale: 1.01 }}
      >
        <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden shadow-md">
          <img
            src="/img/fillo.png"
            alt="Gati për hapin tjetër"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left px-4">
          <Rocket className="mx-auto md:mx-0 w-10 h-10 text-[#4b7c53] mb-4" />
          <h2 className="text-3xl font-semibold text-[#2e4d29]">Gati për hapin tjetër në karrierë?</h2>
         <p className="mt-4 text-lg text-[#2e4d29]">
            Zbulo projekte që përputhen me aftësitë dhe stilin tënd të punës.
        </p>
            <a
               href="/sign-in"
               className="mt-6 inline-block px-8 py-3 bg-[#4b7c53] text-white rounded-full hover:scale-105 transition text-center"
          >
  Filloni sot
</a>

        </div>
      </motion.div>

     {/* Statistikat me animim numrash */}
<div className="grid md:grid-cols-3 gap-6 text-center mb-24 w-full px-4 max-w-none mx-auto">
  {[
    { end: 1200, suffix: "+", label: "Freelancerë aktivë" },
    { end: 300, suffix: "+", label: "Projekte të postuara" },
    { end: 95, suffix: "%", label: "Shkalla e kënaqësisë" },
  ].map((stat, idx) => (
    <motion.div
      key={idx}
      className="bg-white rounded-xl p-8 shadow hover:shadow-lg w-full"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-4xl font-bold text-[#4b7c53]">
        <CountUp
          start={0}
          end={stat.end}
          duration={2.5}
          suffix={stat.suffix}
          separator=","
        />
      </h3>
      <p className="mt-2 text-[#2e4d29]">{stat.label}</p>
    </motion.div>
  ))}
</div>


      {/* Testimonial */}
      <motion.div
        className="bg-white max-w-3xl mx-auto p-8 rounded-xl shadow-lg text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg font-semibold italic text-[#4b7c53] mb-4">
          “K-Gigs më ndihmoi të gjej punë fleksibël që përshtatet me universitetin tim. Komuniteti është mbresëlënës!”
        </p>
        <p className="text-gray-600 font-semibold">- Ana M., Studente</p>
      </motion.div>

    </div>
  );
}
