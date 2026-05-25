import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import Skills from "@/components/Skills";



export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
    </main>
  );
}