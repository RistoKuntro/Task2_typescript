import { Category } from "../models/Category";
import type { Product } from "../models/Products";

export type DiscountRule = { category: Category; percent: number; minRating?: number };

export const discountRules: DiscountRule[] = [
  { category: Category.Electronics, percent: 0.10 },              // 10%
  { category: Category.Accessories, percent: 0.15, minRating: 4 },// 15% if avg ≥ 4
];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function fmtPrice(n: number) {
  // “1299” instead of “1299.00”, otherwise two decimals
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}

/**
 * return the raw numbers; `applied` is true only when a rule actually
 * changed the price.
 */
export function computeDiscount(product: Product, avgRating: number) {
  const rule = discountRules.find(r => r.category === product.category);

  const original = round2(product.price);
  if (!rule || (rule.minRating !== undefined && avgRating < rule.minRating)) {
    return { applied: false, original, discounted: original };
  }

  const discounted = round2(original * (1 - rule.percent));
  return { applied: discounted !== original, original, discounted };
}

/**
 * convenience helper used by the caller – gives you the final text fragment
 * that should appear after `price:` in the report.
 */
export function formatPrice(product: Product, avgRating: number): string {
  const { applied, original, discounted } = computeDiscount(product, avgRating);
  let s = fmtPrice(original);
  if (applied) {
    s += ` -> ${fmtPrice(discounted)}`;
  }
  return s;
}