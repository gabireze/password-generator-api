const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{};:,.<>?';

export function generatePassword(
  length: number,
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    excludeChars?: string;
  },
): string {
  let chars = '';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += DEFAULT_SYMBOLS;

  if (options.excludeChars) {
    const excludeSet = new Set(options.excludeChars);
    chars = [...chars].filter((c) => !excludeSet.has(c)).join('');
  }

  if (!chars) return '';

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}
