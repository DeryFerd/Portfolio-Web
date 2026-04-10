export interface CertificateEntry {
  slug: string;
  title: string;
  issuer: string;
  issuedAt?: string;
  image: string;
}

export const certificates: CertificateEntry[] = [
  {
    slug: "dicoding-1",
    title: "Dicoding Certificate I",
    issuer: "Dicoding",
    image: "/images/certificates/dicoding-1.jpg",
  },
  {
    slug: "binar",
    title: "Binar Certificate",
    issuer: "Binar Academy",
    image: "/images/certificates/binar.jpg",
  },
  {
    slug: "rakamin",
    title: "Rakamin Certificate",
    issuer: "Rakamin Academy",
    image: "/images/certificates/rakamin.jpg",
  },
  {
    slug: "zenius",
    title: "Zenius Certificate",
    issuer: "Zenius",
    image: "/images/certificates/zenius.jpg",
  },
  {
    slug: "dicoding-2",
    title: "Dicoding Certificate II",
    issuer: "Dicoding",
    image: "/images/certificates/dicoding-2.jpg",
  },
  {
    slug: "dicoding-3",
    title: "Dicoding Certificate III",
    issuer: "Dicoding",
    image: "/images/certificates/dicoding-3.jpg",
  },
];
