"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPrice = formatPrice;
function formatPrice(rating) {
    if (rating === null) {
        return "No reviews";
    }
    else {
        return `$rating.toFixed(2)`;
    }
}
