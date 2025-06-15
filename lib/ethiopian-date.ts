// Ethiopian calendar constants
const ETHIOPIAN_EPOCH = 1723856;
const GREGORIAN_EPOCH = 1721426;
const ETHIOPIAN_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
];

// Convert Ethiopian date to Gregorian
export function ethiopianToGregorian(day: number, month: number, year: number) {
  const jdn = ethiopianToJDN(day, month, year);
  return jdnToGregorian(jdn);
}

// Convert Gregorian date to Ethiopian
export function gregorianToEthiopian(day: number, month: number, year: number) {
  const jdn = gregorianToJDN(day, month, year);
  return jdnToEthiopian(jdn);
}

// Helper functions
function ethiopianToJDN(day: number, month: number, year: number): number {
  return (
    ETHIOPIAN_EPOCH +
    (year - 1) * 365 +
    Math.floor(year / 4) +
    (month - 1) * 30 +
    day -
    1
  );
}

function jdnToEthiopian(jdn: number): { day: number; month: number; year: number } {
  const r = (jdn - ETHIOPIAN_EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - ETHIOPIAN_EPOCH) / 1461) + Math.floor(r / 365) + 1;
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return { day, month, year };
}

function gregorianToJDN(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToGregorian(jdn: number): { day: number; month: number; year: number } {
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l1 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l1 + 1)) / 1461001);
  const l2 = l1 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l2) / 2447);
  const l3 = l2 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);

  const day = l3;
  const month = j + 1 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;

  return { day, month, year };
}

// Get Ethiopian month name
export function getEthiopianMonthName(month: number): string {
  return ETHIOPIAN_MONTHS[month - 1] || "";
} 