import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import WorkGrid from "@/components/sections/WorkGrid";
import FadeTest from "@/components/sections/FadeTest";
import PhotosSection from "@/components/sections/PhotosSection";
import WonjyouSection from "@/components/sections/WonjyouSection";
import PortfolioClient from "./portfolio/PortfolioClient";


export default function HomePage() {
  return (
    <main>
      
      <Hero />

      <Marquee />
                  <PortfolioClient />

          <WonjyouSection pinIndex={6} useLenis={true} />

            <PhotosSection />

    </main>
  );
}