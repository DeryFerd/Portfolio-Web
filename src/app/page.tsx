import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <div className={styles.storyStack}>
        <AboutTeaser />
        <Skills />
        <Experience />
        <Projects />
        <Blog />
        <Contact />
      </div>
    </div>
  );
}
