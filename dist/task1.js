"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pull in the sample catalog so we can actually build a report
const storeData_js_1 = require("./data/storeData.js");
const Category_1 = require("./models/Category");
const discounts_js_1 = require("./services/discounts.js");
const products = storeData_js_1.Products;
let report = "Products Report\n\n";
products.forEach((product) => {
    const supplier = product.supplier;
    const qty = product.stockStatus ?? 0;
    const categoryLabel = typeof product.category === "number" // changes Category enum to string label if it's a number
        ? Category_1.Category[product.category]
        : product.category;
    const productReviews = storeData_js_1.Reviews.filter((r) => r.productId === product.id);
    const avgRating = productReviews.length
        ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length // average rating, or 0 if there are no reviews
        : 0;
    report += ` - ${product.name} [id: ${product.id}] | ${categoryLabel} | supplier: ${supplier?.name ?? "N/A"} |`; // product name, id, category, supplier
    report += ` available: ${qty} (${qty >= 3 ? "IN_STOCK" : qty > 0 ? "LOW" : "OUT"})`; // stock status
    report += ` | rating: ${avgRating.toFixed(1)} (${productReviews.length} reviews)`; // rating
    const specsSource = product.specifications ?? supplier?.specifications;
    if (specsSource && Object.keys(specsSource).length) {
        const specs = Object.entries(specsSource)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ");
        report += ` | specs: ${specs}`;
    }
    const { applied: discountApplied } = (0, discounts_js_1.computeDiscount)(product, avgRating);
    report += ` | price: ${(0, discounts_js_1.formatPrice)(product, avgRating)}`; // price, if exists
    report += "\n";
});
console.log(report);
