import styles from "./Skills.module.css";

const groups = [
  {
    label: "AI",
    items: ["LLMs", "RAG", "PyTorch", "TensorFlow", "Scikit-learn"]
  },
  {
    label: "Applications",
    items: ["Next.js", "FastAPI", "React", "Prompt flows", "Interfaces"]
  },
  {
    label: "Data & Infra",
    items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "Cloud"]
  },
  {
    label: "Workflow",
    items: ["Git", "GitHub Actions", "Jupyter", "Experimentation", "Delivery"]
  }
];

export default function Skills() {
  return (
    <section className={`section ${styles.skills}`}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Core stack</p>
            <h2 className={styles.title}>Tools organized around shipping.</h2>
            <p className={styles.text}>
              The stack changes project to project, but the through-line stays
              the same: model quality, product usability, and deployment
              reliability need to move together.
            </p>
          </div>

          <div className={styles.groups}>
            {groups.map((group) => (
              <div key={group.label} className={styles.group}>
                <p className={styles.groupLabel}>{group.label}</p>
                <div className={styles.tokens}>
                  {group.items.map((item) => (
                    <span key={item} className={styles.token}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
