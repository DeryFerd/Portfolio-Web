import Link from "next/link";
import styles from "./page.module.css";

const postData = {
  title: "Getting Started with Large Language Models",
  date: "2024-01-15",
  tags: ["NLP", "LLM", "Tutorial"],
  content: `
## Introduction

Large Language Models (LLMs) have revolutionized the field of natural language processing. In this tutorial, we'll explore how to work with these powerful models.

## What are LLMs?

Large Language Models are deep learning models trained on vast amounts of text data. They can understand and generate human-like text.

## Getting Started

Here's a basic example using the OpenAI API:

\`\`\`python
import openai

openai.api_key = "your-api-key"

response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)
\`\`\`

## Best Practices

1. Always validate outputs
2. Implement proper error handling
3. Monitor costs and usage
4. Consider privacy implications

## Conclusion

LLMs are powerful tools that can accelerate development significantly. Start small, experiment, and scale up as you learn.
  `,
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/blog" className={styles.backLink}>
          &larr; Back to Blog
        </Link>
        
        <header className={styles.header}>
          <div className={styles.meta}>
            <time className={styles.date}>{postData.date}</time>
            <div className={styles.tags}>
              {postData.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
          <h1 className={styles.title}>{postData.title}</h1>
        </header>

        <div className={styles.content}>
          {postData.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className={styles.heading2}>{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('```')) {
              return null;
            }
            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
              return <li key={i} className={styles.listItem}>{line.replace(/^\d+\. /, '')}</li>;
            }
            if (line.trim()) {
              return <p key={i} className={styles.paragraph}>{line}</p>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
