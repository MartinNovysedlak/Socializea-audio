import seoPages from '@/lib/seo-pages.json';
import { absoluteUrl, absoluteAsset, SITE_URL } from '@/lib/site';

export type SeoPage = (typeof seoPages.pages)[number];

export function getSeoPage(path: string): SeoPage {
  const normalized = path === '' ? '/' : path;
  const page = seoPages.pages.find((p) => p.path === normalized);
  if (!page) {
    return seoPages.pages[0];
  }
  return page;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** WebSite + LocalBusiness – pomáha Google pochopiť značku a hlavné podstránky. */
export function siteGraphJsonLd() {
  const nav = seoPages.pages
    .filter((p) => ['/', '/prenajom', '/predaj', '/blog', '/kontakt'].includes(p.path))
    .map((p) => ({
      '@type': 'SiteNavigationElement',
      name: p.path === '/' ? 'Domov' : p.title.split('|')[0].trim(),
      url: absoluteUrl(p.path),
    }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Socializea Audio',
        url: SITE_URL,
        logo: absoluteAsset('/logo.png'),
        email: 'socializea@socializea.com',
        telephone: '+421948070577',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Čadečka 1924',
          addressLocality: 'Čadca',
          postalCode: '022 01',
          addressCountry: 'SK',
        },
        sameAs: [
          'https://www.instagram.com/socializea_audio',
          'https://www.facebook.com/p/Socializea-Audio-61556243854211/',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Socializea Audio',
        image: absoluteAsset('/logo.png'),
        url: SITE_URL,
        telephone: '+421948070577',
        email: 'socializea@socializea.com',
        description:
          'Prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly. DJ služby – Čadca, Žilina a celé Slovensko.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Čadečka 1924',
          addressLocality: 'Čadca',
          postalCode: '022 01',
          addressCountry: 'SK',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Slovakia',
        },
        priceRange: '€€',
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Socializea Audio',
        description:
          'Prenájom a predaj ozvučenia a svetiel – Socializea Audio. Svadby, eventy a DJ služby na Slovensku.',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'sk-SK',
        hasPart: nav,
      },
    ],
  };
}

export { seoPages };
