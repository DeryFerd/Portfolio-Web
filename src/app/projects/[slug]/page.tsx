import Link from "next/link";
import styles from "./page.module.css";

const projectData: Record<string, {
  title: string;
  description: string;
  tags: string[];
  content: string;
  github?: string;
  demo?: string;
}> = {
  "ai-chatbot": {
    title: "AI Chatbot",
    description: "A conversational AI built with GPT models for customer support automation.",
    tags: ["NLP", "GPT", "FastAPI", "React"],
    content: `
## Overview
Built a conversational AI chatbot using GPT-3.5 API for customer support automation. The system handles common queries and escalates complex issues to human agents.

## Tech Stack
- **Backend**: FastAPI, Python
- **AI**: OpenAI GPT-3.5
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL

## Features
- Natural language understanding
- Context-aware conversations
- Multi-language support
- Analytics dashboard
- Easy integration with existing systems

## Results
- 70% reduction in customer support workload
- Average response time under 2 seconds
- 95% customer satisfaction rate
    `,
    github: "https://github.com",
    demo: "https://demo.com",
  },
  "image-classifier": {
    title: "Image Classifier",
    description: "Deep learning model for image classification using CNN architecture.",
    tags: ["Computer Vision", "PyTorch", "ResNet", "Python"],
    content: `
## Overview
Developed a CNN-based image classifier capable of distinguishing between 100 different object categories with 95% accuracy.

## Tech Stack
- **Framework**: PyTorch
- **Architecture**: ResNet-50
- **Data**: ImageNet dataset

## Results
- 95% accuracy on test set
- Real-time inference at 30 FPS
    `,
    github: "https://github.com",
  },
};

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = "ai-chatbot";
  const project = projectData[slug] || projectData["ai-chatbot"];

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/projects" className={styles.backLink}>
          &larr; Back to Projects
        </Link>
        
        <h1 className={styles.title}>{project.title}</h1>
        
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.content}>
          {project.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className={styles.heading2}>{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className={styles.bold}>{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.trim()) {
              return <p key={i} className={styles.paragraph}>{line}</p>;
            }
            return null;
          })}
        </div>

        <div className={styles.links}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
              GitHub &rarr;
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Live Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
