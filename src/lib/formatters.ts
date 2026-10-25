/**
 * MedVault India Localization Formatters
 * Locale: en-IN | Timezone: Asia/Kolkata | Currency: INR (₹)
 */

export const DEFAULT_LOCALE = "en-IN";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_CALLING_CODE = "+91";
export const EMERGENCY_HOTLINE_INDIA = "112";

/**
 * Formats a monetary number into Indian Rupee currency (₹) with Indian lakh/crore grouping.
 * e.g., 1850 -> ₹1,850.00, 100000 -> ₹1,00,000.00
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0.00";
  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

/**
 * Formats a number with Indian number system grouping (e.g., 1,00,000).
 */
export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return "0";
  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE).format(num);
  } catch {
    return num.toLocaleString();
  }
}

/**
 * Formats a date into DD/MM/YYYY format standard in India.
 * Handles ISO strings ('YYYY-MM-DD') directly to prevent timezone shift errors.
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "";
  
  if (typeof dateInput === "string") {
    // Exact match for YYYY-MM-DD
    const isoDateMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      return `${day}/${month}/${year}`;
    }
  }

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  try {
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: DEFAULT_TIMEZONE,
    }).format(date);
  } catch {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
}

/**
 * Formats a date and time into DD/MM/YYYY, hh:mm A IST.
 */
export function formatDateTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const formattedDate = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: DEFAULT_TIMEZONE,
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: DEFAULT_TIMEZONE,
    }).format(date);

    return `${formattedDate}, ${formattedTime} IST`;
  } catch {
    return `${formatDate(date)} IST`;
  }
}

/**
 * Validates Indian 10-digit mobile numbers (+91 prefix optional) while allowing valid international formats.
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  
  // Indian mobile: starts with 6, 7, 8, or 9 and has 10 digits (with optional +91, 91, or 0 prefix)
  if (/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // General international phone (E.164 compliant length: 7 to 15 digits)
  return /^\+?[1-9]\d{6,14}$/.test(cleaned);
}

/**
 * Validates Indian 6-digit PIN codes (e.g. 560038, 110001) while allowing valid postal codes.
 */
export function isValidPinCode(pin: string): boolean {
  if (!pin || typeof pin !== "string") return false;
  const cleaned = pin.trim().replace(/\s+/g, "");
  // Indian 6-digit PIN (first digit 1-9)
  if (/^[1-9][0-9]{5}$/.test(cleaned)) {
    return true;
  }
  // Standard postal codes (3-10 alphanumeric characters)
  return /^[A-Z0-9\- ]{3,10}$/i.test(pin.trim());
}
