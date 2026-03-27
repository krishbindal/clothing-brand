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

## Authentication (Firebase)

Add the following to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

The app uses a global `AuthProvider` to gate checkout and account pages, and to persist user-scoped cart/wishlist data.

## Payments (Razorpay)

Add these keys to `.env.local` for checkout:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_key
RAZORPAY_KEY_ID=your_server_key
RAZORPAY_KEY_SECRET=your_server_secret
```

The `/checkout` page creates a Razorpay order via `/api/checkout/razorpay` and stores order details through `/api/orders`.


## Sanity CMS Setup

This project uses a fresh Sanity Studio located at `studio-clothing-brand`.

### 1) Install dependencies

From the project root:

```bash
cd studio-clothing-brand
npm install
```

### 2) Run the studio locally

```bash
cd studio-clothing-brand
npm run dev
```

The studio uses the `production` dataset on project `51heegbl`.

### 3) Environment variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=51heegbl
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4) Schema files

Schemas are defined in `studio-clothing-brand/schemaTypes`:

- `product.ts`
- `category.ts`
- `banner.ts`
- `index.ts`

### 5) Query and integration layer

Sanity integration now lives in:

- `src/lib/sanity/client.ts`
- `src/lib/sanity/queries.ts`
- `src/lib/sanity/index.ts`
- `src/lib/sanity/types.ts`

Exposed helpers include:

- `getAllProducts`
- `getProductsByCategory`
- `getProductBySlug`
- `getFeaturedProducts`
- `getCategories`
- `searchProducts`
- `getHomepageBanner`

### 6) Revalidation / ISR

CMS-backed data uses safe fetches with fallbacks to avoid runtime crashes when content is empty.
