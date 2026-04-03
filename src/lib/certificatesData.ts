export interface CertificateEntry {
  slug: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image: string;
}

export const certificates: CertificateEntry[] = [
  {
    slug: "generative-ai-product-teams",
    title: "Generative AI for Product Teams",
    issuer: "DeepLearning.AI",
    issuedAt: "2025-11",
    image: "/images/certificates/generative-ai-product-teams.svg",
  },
  {
    slug: "applied-ml-engineering",
    title: "Applied ML Engineering",
    issuer: "Coursera",
    issuedAt: "2025-08",
    image: "/images/certificates/applied-ml-engineering.svg",
  },
  {
    slug: "data-engineering-foundations",
    title: "Data Engineering Foundations",
    issuer: "Google Cloud",
    issuedAt: "2025-04",
    image: "/images/certificates/data-engineering-foundations.svg",
  },
  {
    slug: "mlops-production-systems",
    title: "MLOps for Production Systems",
    issuer: "Databricks",
    issuedAt: "2024-10",
    image: "/images/certificates/mlops-production-systems.svg",
  },
  {
    slug: "computer-vision-practitioner",
    title: "Computer Vision Practitioner",
    issuer: "NVIDIA",
    issuedAt: "2024-05",
    image: "/images/certificates/computer-vision-practitioner.svg",
  },
  {
    slug: "natural-language-processing-specialist",
    title: "Natural Language Processing Specialist",
    issuer: "Kaggle",
    issuedAt: "2023-12",
    image: "/images/certificates/natural-language-processing-specialist.svg",
  },
];
