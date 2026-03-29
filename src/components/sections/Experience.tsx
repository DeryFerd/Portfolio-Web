import styles from "./Experience.module.css";

const experiences = [
  {
    company: "Tech Company",
    role: "AI Engineer",
    period: "2024 - Present",
    description:
      "Building and deploying ML models for production, with emphasis on NLP workflows and computer vision systems."
  },
  {
    company: "Cloud Corp",
    role: "LLM DevOps",
    period: "2024 - Present",
    description:
      "Managing deployment pipelines, model operations, and the infrastructure needed to serve large language models reliably."
  },
  {
    company: "Startup Inc",
    role: "Machine Learning Intern",
    period: "2023 - 2024",
    description:
      "Developed recommendation systems, supported data pipelines, and explored practical LLM applications."
  },
  {
    company: "Data Solutions",
    role: "Data Engineer",
    period: "2023",
    description:
      "Designed ETL pipelines and warehousing workflows for streaming and analytics-heavy products."
  }
];

export default function Experience() {
  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Experience</p>
            <h2 className={styles.title}>Where technical work became delivery.</h2>
            <p className={styles.text}>
              I care about the part between &ldquo;it works&rdquo; and
              &ldquo;it ships.&rdquo; These roles shaped how I think about
              product clarity, implementation quality, and the real constraints
              around building with AI.
            </p>
          </div>

          <div className={styles.timeline}>
            {experiences.map((experience, index) => (
              <article key={`${experience.company}-${experience.period}`} className={styles.item}>
                <div className={styles.itemMeta}>
                  <span className={styles.itemNumber}>
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className={styles.period}>{experience.period}</span>
                </div>
                <div className={styles.itemBody}>
                  <h3 className={styles.role}>{experience.role}</h3>
                  <p className={styles.company}>{experience.company}</p>
                  <p className={styles.description}>{experience.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
