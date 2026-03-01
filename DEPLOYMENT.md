# Deployment Guide

## Prerequisites
- Node.js installed
- GitHub account
- Netlify account
- Sanity.io account (free tier)

## Step 1: Install Dependencies

```bash
cd Web\ Portfolio/portfolio
npm install next-sanity @sanity/client @sanity/image-url @portabletext/react
```

## Step 2: Setup Sanity.io

1. Go to [sanity.io](https://www.sanity.io) and create a free account
2. Create a new project
3. Note your Project ID
4. Create a dataset (e.g., "production")

## Step 3: Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Step 4: Push to GitHub

```bash
cd Web\ Portfolio/portfolio
git init
git add .
git commit -m "Initial portfolio setup"
```

Create a new repository on GitHub and push:

```bash
git remote add origin https://github.com/your-username/portfolio.git
git push -u origin main
```

## Step 5: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Select GitHub and choose your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your-project-id
   - `NEXT_PUBLIC_SANITY_DATASET` = production
6. Click "Deploy site"

## Step 6: Update Sanity Studio (Optional)

To embed Sanity Studio in your portfolio:

```bash
npm install @sanity/studio
```

Create a route at `/studio` with Sanity Studio embedded.

## Customization

### Update Personal Info
- Edit content in `/app/page.tsx` (Hero section)
- Edit `/app/about/page.tsx` (About page)
- Edit `/app/contact/page.tsx` (Contact page)

### Add Projects
- Edit `/app/projects/page.tsx` and add new project objects to the array

### Add Blog Posts
- Edit `/app/blog/page.tsx` and add new post objects to the array

### Change Colors
- Edit `/src/styles/globals.css` and update CSS variables:
  - `--accent` - Change the electric blue (#00b4d8) to your preferred color

### Change Font
- Currently using JetBrains Mono
- To change, edit `/app/layout.tsx`

## Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run start
```

## Notes

- The current data is stored in static arrays for easy editing
- To fully integrate with Sanity CMS, you need to:
  1. Set up Sanity schemas
  2. Create the Sanity Studio
  3. Fetch data from Sanity using the client

- For now, the portfolio works without Sanity - just edit the static files directly.
