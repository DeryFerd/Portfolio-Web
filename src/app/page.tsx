import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import FadeIn from "@/components/ui/FadeIn";
import NeuralBackground from "@/components/ui/NeuralBackground";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      <NeuralBackground />
      <Hero />
      <FadeIn>
        <AboutTeaser />
      </FadeIn>
      <FadeIn delay={100}>
        <Skills />
      </FadeIn>
      <Experience />
      <FadeIn delay={300}>
        <Projects />
      </FadeIn>
      <FadeIn delay={350}>
        <Blog />
      </FadeIn>
      <FadeIn delay={400}>
        <Contact />
      </FadeIn>
    </div>
  );
}
