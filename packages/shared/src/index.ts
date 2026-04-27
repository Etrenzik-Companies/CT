/**
 * @ct/shared — shared utility types and functions used across CT packages.
 */

// ---------------------------------------------------------------------------
// Result<T, E> — functional error handling without exceptions
// ---------------------------------------------------------------------------

export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E> = { readonly ok: false; readonly error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(r: Result<T, E>): r is Ok<T> {
  return r.ok;
}

export function isErr<T, E>(r: Result<T, E>): r is Err<E> {
  return !r.ok;
}

// ---------------------------------------------------------------------------
// Branded<T, Brand> — nominal typing
// ---------------------------------------------------------------------------

declare const brand: unique symbol;
export type Branded<T, B extends string> = T & { readonly [brand]: B };

// ---------------------------------------------------------------------------
// assertNever — exhaustive switch helper
// ---------------------------------------------------------------------------

export function assertNever(x: never, message?: string): never {
  throw new Error(message ?? `Unhandled case: ${JSON.stringify(x)}`);
}

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

/** Convert a string to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Capitalize the first letter of a string. */
export function capitalize(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

// ---------------------------------------------------------------------------
// Currency / number utilities
// ---------------------------------------------------------------------------

/** Format a number as USD currency string, e.g. "$1,250,000". */
export function formatCurrency(
  amount: number,
  options?: { decimals?: number; symbol?: string },
): string {
  const { decimals = 0, symbol = '$' } = options ?? {};
  return (
    symbol +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

// ---------------------------------------------------------------------------
// Date utilities
// ---------------------------------------------------------------------------

/** Return ISO date string (YYYY-MM-DD) for a Date or timestamp. */
export function toIsoDate(date: Date | number | string): string {
  return new Date(date).toISOString().slice(0, 10);
}
