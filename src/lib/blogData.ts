// Data blog posts terpusat — digunakan di Blog section, /blog page, dan /blog/[slug]
export const posts = [
    {
        title: "Claude Code Advisor",
        excerpt: "Advisor Strategy membantu dapat intelligence mendekati Opus dengan biaya sekelas Sonnet, cocok buat yang kuotanya cepat habis di Claude Code.",
        date: "2026-04-14",
        slug: "claude-code-advisor-strategy",
        tags: ["Claude Code", "Advisor Strategy", "Anthropic", "Agentic AI"],
        image: "/images/blog/claude-code-advisor.png",
        content: `
## Context

Lagi ngerjain projects dengan Claude Code akhir-akhir ini? Satu masalah yang paling sering muncul adalah limit yang habis lebih cepat dari yang diharapkan, bahkan di Max Plan sekalipun. Penyebab utamanya sederhana: terlalu banyak task langsung dilempar ke Opus 4.6 dengan full thinking. Beberapa prompt saja sudah cukup untuk menguras kuota.

## Advisor Strategy, Singkatnya

Anthropic punya solusi untuk ini: Advisor Strategy. Tujuannya mendapatkan intelligence mendekati Opus tapi dengan cost selevel Sonnet.

Konsepnya cukup elegan:
1. Biarkan Haiku atau Sonnet menangani eksekusi end-to-end.
2. Panggil Opus hanya ketika executor benar-benar stuck.
3. Opus hanya memberi guidance singkat ke shared context.
4. Executor (Haiku/Sonnet) lanjut implementasi sampai selesai.

Di pola ini, Opus tidak memanggil tools dan tidak memberi output langsung ke user. Opus murni sebagai advisor.

## Kenapa Pendekatan Ini Menarik

Ini kebalikan dari pola sub-agent umum, di mana model besar jadi orchestrator lalu mendelegasikan task ke model kecil. Pada Advisor Strategy, model kecil yang mengemudikan flow, lalu hanya eskalasi ke Opus saat benar-benar perlu.

## Benchmark Snapshot

Beberapa hasil yang paling relevan:
1. SWE-bench Multilingual: Sonnet 4.6 sendiri 72.1%, naik ke 74.8% saat pakai Opus Advisor.
2. Cost per agentic task di setup Sonnet + Opus Advisor turun sekitar 11.9%.
3. BrowseComp: Haiku naik dari 19.7% ke 41.2% saat dipasangkan dengan Opus Advisor.
4. Terminal-Bench 2.0 juga menunjukkan peningkatan signifikan.

## Implementasi di API

Implementasinya cukup one-line change di request Messages API: deklarasikan advisor_20260301.

Handoff model terjadi dalam satu request /v1/messages, tanpa extra round-trips dan tanpa context management manual dari sisi developer. Executor yang memutuskan kapan konsultasi ke Opus.

## Closing Note

Fitur ini sudah bisa dicoba dalam fase beta. Buat yang lagi ngos-ngosan sama kuota Claude Code, ini termasuk opsi yang worth trying.
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
