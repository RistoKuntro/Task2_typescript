export interface Review {
    id: number;
    productId: number;
    rating: number; // 1 to 5
    comment?: string;
    reviewerName?: string;
}