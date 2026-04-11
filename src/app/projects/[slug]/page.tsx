import Link from "next/link";
import Image from "next/image";
import { ArchiveIcon, HomeIcon } from "@/components/ui/BackLinkIcons";
import styles from "./page.module.css";

const projectData: Record<string, {
  title: string;
  description: string;
  tags: string[];
  content: string;
  image: string;
  github?: string;
  demo?: string;
}> = {
  "ai-chatbot": {
    title: "AI Chatbot",
    description: "A conversational AI built with GPT models for customer support automation.",
    tags: ["NLP", "GPT", "FastAPI", "React"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop",
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
  "recommender-system": {
    title: "Recommender System",
    description: "Collaborative filtering recommendation engine for e-commerce platforms.",
    tags: ["ML", "Recommendation", "Python"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
    content: `
## Overview
Built a hybrid recommendation system combining collaborative and content-based filtering for personalized product recommendations.

## Tech Stack
- **Python**: Scikit-learn, Pandas
- **Algorithm**: Matrix Factorization
- **Data**: User behavior logs
    `,
    github: "https://github.com",
  },
  "sentiment-analysis": {
    title: "Sentiment Analysis",
    description: "Real-time sentiment analysis for social media monitoring.",
    tags: ["NLP", "BERT", "Streamlit"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    content: `
## Overview
Developed a real-time sentiment analysis tool that monitors social media platforms and provides sentiment insights.

## Tech Stack
- **Model**: BERT-base
- **Framework**: Hugging Face Transformers
- **UI**: Streamlit
    `,
    github: "https://github.com",
  },
  "object-detection": {
    title: "Object Detection",
    description: "YOLO-based object detection for autonomous vehicles.",
    tags: ["Computer Vision", "YOLO", "OpenCV"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",
    content: `
## Overview
Implemented YOLOv8 for real-time object detection in autonomous vehicle scenarios.

## Tech Stack
- **Model**: YOLOv8
- **Framework**: Ultralytics
- **Tools**: OpenCV, NumPy
    `,
    github: "https://github.com",
  },
  "time-series": {
    title: "Time Series Forecasting",
    description: "LSTM model for stock price prediction and financial forecasting.",
    tags: ["Deep Learning", "LSTM", "Finance"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
    content: `
## Overview
Built an LSTM-based model for predicting stock prices and financial time series data.

## Tech Stack
- **Model**: LSTM
- **Framework**: TensorFlow, Keras
- **Data**: Historical stock data
    `,
    github: "https://github.com",
  },
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isIncomingSlug = slug !== "ai-chatbot";
  const project = isIncomingSlug
    ? {
        title: "More Incoming",
        description:
          "⚠ This project slot is still in progress. A complete technical breakdown will be published once the implementation and validation are ready.",
        tags: ["Incoming", "In Progress", "Roadmap"],
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
        content: `
## Status
This page is intentionally reserved for an upcoming case study.

## What will be added
- Problem framing and production constraints
- Architecture decisions and tradeoffs
- Implementation details with stack notes
- Outcome metrics and next iteration plan
    `,
      }
    : projectData["ai-chatbot"];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.backNav}>
          <Link href="/projects" className={styles.backLink}>
            <ArchiveIcon className={styles.backIcon} />
            <span>Back to My Projects</span>
          </Link>
          <Link href="/#projects" className={styles.backLinkSecondary}>
            <HomeIcon className={styles.backIcon} />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className={styles.imageWrapper}>
          <Image
            src={project.image}
            alt={project.title}
            width={1200}
            height={600}
            className={styles.image}
            unoptimized
          />
        </div>
        
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

        {isIncomingSlug ? (
          <div className={styles.links}>
            <span className={styles.linkMuted}>⚠ More incoming</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
