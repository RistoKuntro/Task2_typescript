export function getStockStatus(quantity) {
    if (quantity >= 3) {
        return "In Stock";
    }
    else if (quantity > 0) {
        return "Low Stock";
    }
    else {
        return "Out of Stock";
    }
}
