import styles from "./Experience.module.css";

const experiences = [
  {
    company: "Tech Company",
    role: "AI Engineer",
    period: "2024 - Present",
    description: "Building and deploying ML models for production. Working on NLP and computer vision projects.",
  },
  {
    company: "Startup Inc",
    role: "Machine Learning Intern",
    period: "2023 - 2024",
    description: "Developed recommendation systems and data pipelines. Research on LLM applications.",
  },
];

export default function Experience() {
  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className="text-accent">#</span> Experience
        </h2>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.period}>{exp.period}</div>
              <div className={styles.content}>
                <h3 className={styles.role}>{exp.role}</h3>
                <div className={styles.company}>{exp.company}</div>
                <p className={styles.description}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
