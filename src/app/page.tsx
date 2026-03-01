import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import FadeIn from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <>
      <Hero />
      <FadeIn>
        <AboutTeaser />
      </FadeIn>
      <FadeIn delay={100}>
        <Skills />
      </FadeIn>
      <FadeIn delay={200}>
        <Experience />
      </FadeIn>
      <FadeIn delay={300}>
        <Projects />
      </FadeIn>
      <FadeIn delay={400}>
        <Contact />
      </FadeIn>
    </>
  );
}
