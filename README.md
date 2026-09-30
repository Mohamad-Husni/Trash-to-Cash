This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Vercel deployment

Import `Mohamad-Husni/Trash-to-Cash` and deploy the `main` branch with the repository root as the Root Directory. The committed `vercel.json` selects Next.js, installs dependencies with `npm ci`, runs `npm run build`, and uses `.next` as the build output. Dependencies and build files are generated during deployment and must not be committed.

The `/` page redirects in the browser to `/login` or the signed-in user's dashboard. Next.js handles nested and dynamic routes directly; no catch-all rewrite to `index.html` is needed.

If Vercel shows its platform `404 NOT_FOUND` page, check that the production domain points to the latest successful deployment and that the project's Root Directory is the repository root. For real Google Maps, configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` before building; without it the app uses its fallback map.

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
