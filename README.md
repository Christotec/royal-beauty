# Royal Beauty Unisex Salon — Website

A product catalog + admin dashboard for Royal Beauty Unisex Salon. Visitors
browse products and tap "Buy on WhatsApp" to complete the purchase by chat.
You manage everything (products, prices, photos) from a private `/admin`
dashboard, no coding required after setup.

## What's inside

- **Public site**: Home, Shop (with category filters), Product detail pages
  (with size/style picker), Services, About
- **Admin dashboard** (`/admin`): add/edit/delete products, add multiple
  priced options per product, upload photos, show/hide products
- Built with Next.js 14, TypeScript, Tailwind CSS, Supabase

---

## 1. Open this in VSCode

Unzip/copy this whole folder, open it in VSCode, then in the terminal:

```bash
npm install
```

This downloads all the packages the project needs (`node_modules` was
removed before sending this to you, so this step is required).

---

## 2. Set up Supabase

You said you already have a Supabase account, so:

1. Go to [supabase.com](https://supabase.com) → create a **new project**
   for this client (name it something like `royal-beauty`).
2. Wait for it to finish provisioning (~2 minutes).
3. In the left sidebar, go to **SQL Editor** → **New query**.
4. Open `supabase/schema.sql` from this project, copy everything in it,
   paste into the SQL editor, and click **Run**.
   - This creates the `products` and `product_variants` tables, sets up
     security rules (public can view, only you can edit), and creates the
     `product-images` storage bucket.
5. Go to **Project Settings → API**. You'll need two values from here:
   - **Project URL**
   - **anon public** key

---

## 3. Create your admin login

This is the email/password you and your client will use to log into
`/admin`. It is NOT a public sign-up, you create it directly:

1. In Supabase, go to **Authentication → Users**.
2. Click **Add user** → **Create new user**.
3. Enter an email (e.g. `admin@royalbeautysalon.com` or her real email) and
   a password. Check **Auto Confirm User**.
4. Click **Create user**.

That's the only account that can log into `/admin`. You can add a second
one later the same way if she wants her own login separate from yours.

---

## 4. Set up your environment variables

In the project folder, copy the example file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=<your Project URL from step 2>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon public key from step 2>
NEXT_PUBLIC_WHATSAPP_NUMBER_1=2347013532484
NEXT_PUBLIC_WHATSAPP_NUMBER_2=2347058830391
```

WhatsApp numbers must be digits only, country code first, no `+` and no
leading `0` on the local number (Nigeria's `0701...` becomes `234701...`).

---

## 5. Run it locally to check everything works

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Go to
`/admin/login` and sign in with the account from step 3. Try adding a
product with one or two options to confirm it saves and shows up on
`/products`.

---

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Royal Beauty website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/royal-beauty.git
git push -u origin main
```

(Create the empty repo on GitHub first, then run the commands above with
your real repo URL.)

---

## 7. Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → connect GitHub → pick this repo.
2. Build settings should auto-detect from `netlify.toml`
   (build command `npm run build`, publish directory `.next`). If not,
   set them manually to match.
3. Before deploying, go to **Site configuration → Environment variables**
   and add the same four variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER_1`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER_2`
4. Click **Deploy**.

Netlify will give you a live URL immediately
(something like `royal-beauty-xyz.netlify.app`). You can connect a custom
domain later from **Domain settings**.

---

## Daily use after launch

- To add a product: log into `/admin` → **Add Product** → fill in name,
  description, category, main photo, then add one or more options (label +
  price, optionally its own photo) → **Add Product**.
- To hide a product without deleting it: edit it and untick
  "Visible on the website."
- To change a price: edit the product, change the number in that option's
  price box, save.
- Every product change is live on the site within about a minute
  (no rebuild or redeploy needed).

## Notes for future you

- Services (Hydra Facial, barbing, etc.) are NOT in the database, they're
  hardcoded in `src/app/services/page.tsx` since they don't need prices or
  photos managed via the dashboard. Edit that file directly to change them.
- The WhatsApp message sent when someone taps "Buy" is built in
  `src/lib/whatsapp.ts`, edit the message templates there if you want to
  change the wording.
- Brand colors are defined in `tailwind.config.ts` under `burgundy`, `gold`,
  `cream`, `blush`, `charcoal`, reuse those names instead of hardcoding hex
  values in new components.
