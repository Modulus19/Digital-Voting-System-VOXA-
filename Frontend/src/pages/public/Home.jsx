import Hero from "../../components/home/Hero"
import Stats from "../../components/home/Stats";
import CTA from "../../components/home/CTA";


const Home = () => {
  return (
    <div className="min-h-screen bg-white text-[#111827]">


      <main>
        <Hero />
        <Stats />
        <CTA />
      </main>

    </div>
  );
};

export default Home;