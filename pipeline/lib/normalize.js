// Duration normalization. Verbatim strings are preserved upstream; this only
// produces the comparable value_days. Unknown shapes return {error} so the
// caller can fail the run rather than silently drop data.
const DAYS_PER = { day: 1, week: 7, month: 30.44 };

const UNAVAILABLE = new Set(['no processing time available']);
const INSUFFICIENT = new Set(['not enough data']);

export function normalizeDuration(raw) {
  const s = String(raw).trim();
  const low = s.toLowerCase();
  if (UNAVAILABLE.has(low)) return { status: 'unavailable', value_days: null, unit_original: null };
  if (INSUFFICIENT.has(low)) return { status: 'insufficient_data', value_days: null, unit_original: null };
  const m = low.match(/^(\d+(?:\.\d+)?)\s*(day|week|month)s?$/);
  if (!m) return { error: `unparseable duration: "${s}"` };
  const n = parseFloat(m[1]);
  const unit = m[2];
  if (n <= 0) return { error: `non-positive duration: "${s}"` };
  return { status: 'ok', value_days: Math.round(n * DAYS_PER[unit] * 100) / 100, unit_original: unit + 's' };
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code) {
  try {
    const n = regionNames.of(code.toUpperCase());
    return n && n !== code.toUpperCase() ? n : code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/** "August 19, 2026" -> "2026-08-19" (IRCC's lastupdated format). */
export function parseUsDate(s) {
  const d = new Date(s + ' UTC');
  if (isNaN(d)) return null;
  return d.toISOString().slice(0, 10);
}

export function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
