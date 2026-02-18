export function formatPrice(rating) {
    if (rating === null) {
        return "No reviews";
    }
    else {
        return `$rating.toFixed(2)`;
    }
}
