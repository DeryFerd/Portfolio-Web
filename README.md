# Personal Portfolio (AI Engineer and LLM Engineer)

A personal portfolio website built with Next.js App Router.

This project showcases my profile, skills, projects, blog posts, and contact links in a clean single-page home plus dedicated detail pages.

## What Is Inside

- Home sections: Hero, About, Skills, Experience, Featured Projects, Latest Posts, Contact
- Dedicated pages: About, Projects, Blog
- Dynamic detail pages: `/projects/[slug]` and `/blog/[slug]`
- Theme toggle support
- Reusable UI components and CSS Modules styling

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS Modules + global CSS variables
- Optional Sanity setup (`next-sanity`, `@sanity/client`, `@sanity/image-url`)

## Project Routes

- `/` Home
- `/about` About page
- `/projects` All projects
- `/projects/[slug]` Project detail
- `/blog` All blog posts
- `/blog/[slug]` Blog detail

## Run Locally

Requirements: Node.js LTS and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm run start
```

## Where To Edit Content

- Main home composition: `src/app/page.tsx`
- Navbar links: `src/components/layout/Header.tsx`
- Home featured projects: `src/components/sections/Projects.tsx`
- Projects list page data: `src/app/projects/page.tsx`
- Project detail content map: `src/app/projects/[slug]/page.tsx`
- Blog list and detail data: `src/lib/blogData.ts`
- Contact email and social links: `src/components/sections/Contact.tsx`
- Global theme variables: `src/styles/globals.css`

## Optional Environment Variables

Create `.env.local` only if you want to use Sanity:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

Note: current portfolio content works with local static data.

## Personalization Checklist

- Replace placeholder social/profile URLs
- Replace placeholder email in Contact section
- Replace demo project images and descriptions
- Replace blog post sample content with your real writing
- Update logo/title text in header

## Deployment

Quick deployment notes are available in `DEPLOYMENT.md`.

You can deploy this project to platforms like Vercel or Netlify.
