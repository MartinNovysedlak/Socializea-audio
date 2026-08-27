export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_KEY = 'socializea_cookie_consent';
export const COOKIE_SETTINGS_EVENT = 'open-cookie-settings';

type StoredConsent = CookiePreferences & { updatedAt: string };

export function getCookieConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (typeof parsed?.analytics !== 'boolean' || typeof parsed?.marketing !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCookieConsent(prefs: Omit<CookiePreferences, 'necessary'>): CookiePreferences {
  const next: StoredConsent = {
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: next }));
  return next;
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}
