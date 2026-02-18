import type { Supplier } from "./models/Supplier";
import type { Product } from "./models/Products";

const products: Product[] = [];
const suppliers: Supplier[] = [];

let report = "Products Report\n\n";

products.forEach((product) => {
  const supplier = product.supplier;
    if (supplier) {
    report += `Product Name: ${product.name}\n`;
    report += `Price: $${product.price}\n`;
    report += `Supplier: ${supplier.name}\n\n`;
  }
});

console.log(report);