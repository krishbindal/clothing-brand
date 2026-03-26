This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Sanity CMS Setup

This project supports Sanity as the content source for products, homepage content, and collections.

### 1) Install dependencies

Already included in this repository:

- `@sanity/client`
- `@sanity/image-url`
- `next-sanity`

### 2) Initialize Sanity Studio

From the project root:

```bash
npx sanity init
```

Use your Sanity project, and select/create the `production` dataset.

### 3) Environment variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_token
```

### 4) Schema files

Schemas are defined in:

- `sanity/schemaTypes/product.ts`
- `sanity/schemaTypes/collection.ts`
- `sanity/schemaTypes/homepage.ts`
- `sanity/schemaTypes/index.ts`
- `sanity.config.ts`

### 5) Query and integration layer

Sanity integration is implemented in:

- `src/lib/sanity.ts`

Exposed helpers include:

- `getAllProducts`
- `getProductBySlug`
- `getFeaturedProducts`
- `getHomepageContent`
- `getCollections`
- `urlFor` (Sanity image URL builder)

### 6) Client content workflow

Once configured, non-technical users can:

- Add/edit products (`product` documents)
- Update homepage hero and featured products (`homepage` document)
- Manage collections (`collection` documents)

### 7) Revalidation / ISR

CMS-backed data uses Next.js revalidation (`revalidate: 60`) for performant near-real-time content refresh.
