import type { Supplier } from "./models/Supplier";
import type { Product } from "./models/Products";

// pull in the sample catalog so we can actually build a report
import { Products, Reviews } from "./data/storeData.js";
import { Category } from "./models/Category";

import { computeDiscount, formatPrice } from "./services/discounts.js";

const products: Product[] = Products;

let report = "Products Report\n\n";

products.forEach((product) => {
  const supplier = product.supplier;
  const qty = product.stockStatus ?? 0;
  const categoryLabel =
    typeof product.category === "number" // changes Category enum to string label if it's a number
      ? (Category as any)[product.category]
      : product.category;

  const productReviews = Reviews.filter((r) => r.productId === product.id);
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

  const { applied: discountApplied } = computeDiscount(product, avgRating);

  report += ` | price: ${formatPrice(product, avgRating)}`; // price, if exists

  report += "\n";
});

console.log(report);
