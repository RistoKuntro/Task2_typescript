"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockStatus = getStockStatus;
function getStockStatus(quantity) {
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
