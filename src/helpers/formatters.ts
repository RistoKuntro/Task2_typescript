export function formatPrice(rating: number | null): string {
    if (rating === null) {
        return "No reviews";
    } else {
        return `$rating.toFixed(2)`;
    }
}