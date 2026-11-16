/**
 * Money is stored as an integer in the currency's minor unit (cents, centavos, yen) together with
 * the currency it was entered in, so a total never drifts with floating point. It's always shown
 * in the region's currency (owner's call, 2026-10-17: a display format, not a conversion): ₱500
 * shows as $500 or £500 after a region change, the same 500. `displayMinor` rescales between minor
 * units (₱500.00 is 50000, ¥500 is 500) so the number never changes; no exchange rate is ever used.
 * Columns and fields are still named `…Centavos` from the pesos-only first version.
 */

/** ISO 4217 minor units that aren't 2 (the regions' currencies; any other is 2). */
const MINOR_DIGITS: Record<string, number> = { JPY: 0, KRW: 0, VND: 0, KWD: 3 };

export function currencyDigits(currency: string): number {
  return MINOR_DIGITS[currency] ?? 2;
}

/**
 * An amount stored in `stored`'s minor units, in `display`'s minor units with the same value:
 * 50000 (₱500.00) is 500 for yen and 50000 for dollars. A display format only, never a conversion.
 */
export function displayMinor(minor: number, stored: string | null | undefined, display: string): number {
  const shift = currencyDigits(display) - currencyDigits(stored || display);
  return shift === 0 ? minor : Math.round(minor * 10 ** shift);
}

/**
 * The same rescaling in SQL, for sums the database does: `amountColumn` (in the row's
 * `currencyColumn` minor units) in `display`'s minor units. Only codes and numbers go in the text.
 */
export function displayMinorSql(amountColumn: string, currencyColumn: string, display: string): string {
  const factor = (digits: number) => String(10 ** (currencyDigits(display) - digits));
  const byDigits = new Map<number, string[]>();
  for (const [code, digits] of Object.entries(MINOR_DIGITS)) byDigits.set(digits, [...(byDigits.get(digits) ?? []), `'${code}'`]);
  const cases = [...byDigits].map(([digits, codes]) => `WHEN ${currencyColumn} IN (${codes.join(', ')}) THEN ${amountColumn} * ${factor(digits)}`).join(' ');
  return `ROUND(CASE ${cases} ELSE ${amountColumn} * ${factor(2)} END)`;
}

const formatters = new Map<string, Intl.NumberFormat>();
// The phone's locale for separators and symbol placement; set once at start (lib/region).
let formatLocale: string | undefined;

export function setMoneyLocale(locale: string | null): void {
  if (locale && locale !== formatLocale) {
    formatLocale = locale;
    formatters.clear();
  }
}

// Intl.NumberFormat construction is expensive on Hermes; reuse one per currency and style.
function getFormatter(currency: string, compact: boolean): Intl.NumberFormat {
  const key = `${currency}:${compact ? 'c' : 'e'}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    const digits = compact ? 0 : currencyDigits(currency);
    try {
      formatter = new Intl.NumberFormat(formatLocale, { style: 'currency', currency, maximumFractionDigits: digits, minimumFractionDigits: digits });
    } catch {
      formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: digits, minimumFractionDigits: digits });
    }
    formatters.set(key, formatter);
  }
  return formatter;
}

/** "₱1,250.50", "$1,250.50", "£1,250.50"; with `compact` whole units for totals at a glance. */
export function formatMoney(minor: number, currency: string, options?: { compact?: boolean }): string {
  return getFormatter(currency, options?.compact ?? false).format(minor / 10 ** currencyDigits(currency));
}

/**
 * The currency's symbol as this phone writes it ("₱", "$", "CA$"), for a field's suffix: zero
 * formatted, less the digits, separators and spaces. (Not `formatToParts`: iOS's Hermes lacks it.)
 */
export function currencySymbol(currency: string): string {
  const symbol = getFormatter(currency, true)
    .format(0)
    .replace(/[\d.,\s\u00a0\u202f\u200f\u200e-]/g, '');
  return symbol || currency;
}

/**
 * Parses typed money like "1,250.50", "1.250,50" or "₱350" into minor units; null when it isn't
 * an amount. The last "." or "," followed by 1 to `digits` digits is the decimal mark; other
 * separators are grouping.
 */
export function parseMoney(text: string, currency: string): number | null {
  const digits = currencyDigits(currency);
  const cleaned = text.replace(/[^0-9.,]/g, '');
  if (cleaned === '') return null;
  const mark = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
  const tail = mark >= 0 ? cleaned.slice(mark + 1) : '';
  const decimal = mark >= 0 && digits > 0 && tail.length >= 1 && tail.length <= digits && !/[.,]/.test(tail);
  const whole = (decimal ? cleaned.slice(0, mark) : cleaned).replace(/[.,]/g, '');
  const fraction = decimal ? tail : '';
  if (whole === '' && fraction === '') return null;
  const value = Number(`${whole || '0'}.${fraction || '0'}`);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 10 ** digits) : null;
}

/** Minor units back into a field: "1250.5" for 125050 cents, "350" for 35000. */
export function minorToInput(minor: number | null, currency: string): string {
  if (minor === null) return '';
  const digits = currencyDigits(currency);
  const text = (minor / 10 ** digits).toFixed(digits);
  return digits > 0 ? text.replace(/\.?0+$/, '') : text;
}
