import Image from "next/image";
import styles from "./Skills.module.css";

const skills = [
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "TensorFlow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "FastAPI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
  { name: "GCP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
  { name: "OpenCV", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
  { name: "Scikit-learn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
  { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
];

export default function Skills() {
  return (
    <section className={`section ${styles.skills}`} id="skills">
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className="text-accent">#</span> Skills
        </h2>
        <p className={styles.subtitle}>
          Technologies and tools I work with
        </p>
        <div className={styles.grid}>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.skillCard}>
              <div className={styles.logoWrapper}>
                <Image
                  src={skill.logo}
                  alt={skill.name}
                  width={48}
                  height={48}
                  className={styles.logo}
                  unoptimized
                />
              </div>
              <span className={styles.skillName}>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
