import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import FadeIn from "@/components/ui/FadeIn";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <div className={styles.storyStack}>
        <FadeIn delay={0}>
          <AboutTeaser />
        </FadeIn>
        <FadeIn delay={40}>
          <Skills />
        </FadeIn>
        <FadeIn delay={80}>
          <Experience />
        </FadeIn>
        <FadeIn delay={100}>
          <Projects />
        </FadeIn>
        <FadeIn delay={120}>
          <Blog />
        </FadeIn>
        <FadeIn delay={140}>
          <Contact />
        </FadeIn>
      </div>
    </div>
  );
}
