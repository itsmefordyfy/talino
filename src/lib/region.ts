import { getCalendars, getLocales } from 'expo-localization';

/**
 * Where the parent lives, for the currency and region-only content (the Philippine vaccine
 * schedule first). The phone's region is the starting point, Settings can change it, and no
 * location permission is ever asked for it. Ported from Pawfetti.
 */

/** A region the app knows by name, with its currency (ISO 3166-1 alpha-2 → ISO 4217). */
export type Region = { code: string; name: string; currency: string };

export const REGIONS: readonly Region[] = [
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'BE', name: 'Belgium', currency: 'EUR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'FI', name: 'Finland', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'PL', name: 'Poland', currency: 'PLN' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'TW', name: 'Taiwan', currency: 'TWD' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'VN', name: 'Vietnam', currency: 'VND' },
];

/** The currency when none can be worked out (no region, an unknown one). */
export const FALLBACK_CURRENCY = 'USD';

const isCurrencyCode = (value: unknown): value is string => typeof value === 'string' && /^[A-Z]{3}$/.test(value);

export function regionByCode(code: string | null | undefined): Region | null {
  return code ? (REGIONS.find((region) => region.code === code.toUpperCase()) ?? null) : null;
}

/** The phone's region and currency as the system reports them; null where it doesn't say. */
export function deviceRegion(): { region: string | null; currency: string | null; locale: string | null } {
  const locale = getLocales()[0];
  const region = typeof locale?.regionCode === 'string' && /^[A-Za-z]{2}$/.test(locale.regionCode) ? locale.regionCode.toUpperCase() : null;
  return { region, currency: isCurrencyCode(locale?.currencyCode) ? locale.currencyCode : null, locale: locale?.languageTag ?? null };
}

/** The region in effect: the owner's choice in Settings, else the phone's (null when neither is known). */
export function effectiveRegion(chosen: string | null, device: string | null): string | null {
  return chosen ?? device;
}

/**
 * The currency in effect, always the region's (as in Pawfetti: no separate currency setting): the region table's, else what the phone reports for its own region (a country the
 * table doesn't list), else the fallback. Never guessed from anything else.
 */
export function effectiveCurrency(region: string | null, device: { region: string | null; currency: string | null }): string {
  const known = regionByCode(region)?.currency;
  if (known) return known;
  if ((region === null || region === device.region) && device.currency) return device.currency;
  return FALLBACK_CURRENCY;
}

/** The first day of the week on this phone (0 Sunday … 6 Saturday); Sunday when it isn't known. */
export function firstWeekday(): number {
  const day = getCalendars()[0]?.firstWeekday;
  // expo-localization counts Sunday as 1.
  return typeof day === 'number' && day >= 1 && day <= 7 ? day - 1 : 0;
}
