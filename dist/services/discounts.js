"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountRules = void 0;
exports.computeDiscount = computeDiscount;
exports.formatPrice = formatPrice;
const Category_1 = require("../models/Category");
exports.discountRules = [
    { category: Category_1.Category.Electronics, percent: 0.10 }, // 10%
    { category: Category_1.Category.Accessories, percent: 0.15, minRating: 4 }, // 15% if avg ≥ 4
];
function round2(n) {
    return Math.round(n * 100) / 100;
}
function fmtPrice(n) {
    // “1299” instead of “1299.00”, otherwise two decimals
    return n % 1 === 0 ? n.toString() : n.toFixed(2);
}
/**
 * return the raw numbers; `applied` is true only when a rule actually
 * changed the price.
 */
function computeDiscount(product, avgRating) {
    const rule = exports.discountRules.find(r => r.category === product.category);
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
function formatPrice(product, avgRating) {
    const { applied, original, discounted } = computeDiscount(product, avgRating);
    let s = fmtPrice(original);
    if (applied) {
        s += ` -> ${fmtPrice(discounted)}`;
    }
    return s;
}
