// Data blog posts terpusat — digunakan di Blog section, /blog page, dan /blog/[slug]
export const posts = [
    {
        title: "Getting Started with Large Language Models",
        excerpt: "A comprehensive guide to understanding and working with LLMs for production applications.",
        date: "2024-01-15",
        slug: "getting-started-with-llms",
        tags: ["NLP", "LLM", "Tutorial"],
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
        content: `
## Introduction

Large Language Models (LLMs) have revolutionized the field of natural language processing. In this tutorial, we'll explore how to work with these powerful models.

## What are LLMs?

Large Language Models are deep learning models trained on vast amounts of text data. They can understand and generate human-like text, making them incredibly versatile for a wide range of applications.

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
    },
    {
        title: "Building a Neural Network from Scratch",
        excerpt: "Learn the fundamentals of neural networks by building one from scratch using Python.",
        date: "2024-01-10",
        slug: "building-neural-network-from-scratch",
        tags: ["Deep Learning", "Python", "Tutorial"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
        content: `
## Introduction

Understanding how neural networks work at a fundamental level is crucial for any machine learning engineer. In this post, we'll build one from scratch.

## The Building Blocks

A neural network consists of layers of interconnected nodes (neurons). Each connection has a weight that gets updated during training.

## Implementation

\`\`\`python
import numpy as np

class NeuralNetwork:
    def __init__(self, layers):
        self.weights = []
        for i in range(len(layers) - 1):
            w = np.random.randn(layers[i], layers[i+1]) * 0.01
            self.weights.append(w)

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def forward(self, X):
        self.activations = [X]
        for w in self.weights:
            X = self.sigmoid(X @ w)
            self.activations.append(X)
        return X
\`\`\`

## Training

1. Forward pass to compute predictions
2. Calculate loss using cross-entropy or MSE
3. Backward pass to compute gradients
4. Update weights using gradient descent

## Conclusion

Building from scratch gives you intuition that frameworks can't provide. Always understand the fundamentals before reaching for PyTorch or TensorFlow.
    `,
    },
    {
        title: "Deploying ML Models with Docker",
        excerpt: "Step-by-step guide to containerizing and deploying machine learning models.",
        date: "2024-01-05",
        slug: "deploying-ml-models-docker",
        tags: ["MLOps", "Docker", "Deployment"],
        image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop",
        content: `
## Introduction

Deploying machine learning models into production is one of the most critical—and often underestimated—steps in the ML lifecycle. Docker makes this process reproducible and scalable.

## Why Docker for ML?

Docker containers package your model, code, dependencies, and runtime into a single unit that runs identically everywhere — your laptop, a cloud server, or a Kubernetes cluster.

## Dockerfile for a FastAPI ML Service

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## Best Practices

1. Use slim base images to keep size small
2. Separate model loading from request handling
3. Add health check endpoints
4. Use multi-stage builds for production

## Conclusion

Docker + FastAPI is a powerful combination for serving ML models. Once containerized, scaling to Kubernetes or cloud run becomes straightforward.
    `,
    },
];

export function getPostBySlug(slug: string) {
    return posts.find((p) => p.slug === slug) ?? null;
}
