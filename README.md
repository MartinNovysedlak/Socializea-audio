# Socializea Audio

Web Socializea Audio – **prenájom a predaj** profesionálnej zvukovej a svetelnej techniky pre svadby, firemné akcie a eventy. Pôsobíme v Čadci, Žiline a po celom Slovensku.

**Živá stránka:** [www.socializea-audio.com](https://www.socializea-audio.com)

---

## Jazyk a backend

| Vrstva | Technológia |
| --- | --- |
| **Jazyk** | **TypeScript** |
| **Frontend** | React 19, Vite 8, Tailwind CSS, Shadcn/UI |
| **Backend / databáza** | **Supabase** (PostgreSQL, Storage, REST API) |
| **Hosting** | Vercel |
| **Serverless API** | Vercel Functions v `api/` (TypeScript) |
| **E-maily** | EmailJS (dopyty z formulárov a košíka) |

Aplikácia je **SPA** (single-page app), nie Next.js. Dáta katalógu, predaja a prenájmu idú z **Supabase**. Vercel funkcie slúžia na Google Merchant feed a na keep-alive cron, ktorý nenechá bezplatný Supabase projekt zaspať.

---

## Čo web vie

- Prenájom aparatúry vrátane balíkov a košíka
- Predaj novej techniky a B-Stock
- Kontaktný formulár, FAQ, blog
- Administrácia obsahu (`/admin`)
- SEO: `robots.txt`, sitemap, meta tagy, canonical URL, prerender pre crawlerov
- Google Merchant feed (`/api/merchant/feed`)

---

## Štruktúra

```
src/                 React aplikácia (stránky, komponenty, služby)
  pages/             Verejné stránky + admin
  components/        UI, katalóg, košík, SEO
  lib/               Supabase klient, SEO, firemné údaje
api/                 Vercel serverless funkcie
  merchant/feed.ts   XML feed pre Google Merchant Center
  cron/keep-alive.ts Denný ping na Supabase
scripts/             Prerender meta tagov + sitemap po builde
public/              robots.txt, sitemap, favicon, statické súbory
```

---

## Lokálne spustenie

```bash
npm install
npm run dev
```

Aplikácia beží na [http://localhost:5173](http://localhost:5173).

V koreni projektu môže byť `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Bez `.env` sa použijú predvolené hodnoty z `src/lib/supabase.ts`.

### Ďalšie príkazy

```bash
npm run build      # produkčný build + SEO prerender
npm run preview    # náhľad dist
npm run lint       # ESLint
```

---

## Produkcia

- Doména: `https://www.socializea-audio.com`
- Apex `socializea-audio.com` presmeruje 308 na www
- Deploy: Vercel (build: `vite build && node scripts/prerender-seo.mjs`)

---

## Kontakt

**Socializea-audio** · Martin Novysedlák  
Čadečka 1924, 022 01 Čadca  
[+421 948 070 577](tel:+421948070577) · [socializea@socializea.com](mailto:socializea@socializea.com)
