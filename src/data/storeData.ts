import { Product } from "../models/Products";
import { Review } from "../models/Review";
import { Supplier } from "../models/Supplier";
import { Category } from "../models/Category";

export const Products: Product[] = [
    {
        id: 1,
        name: "Smartphone",
        price: 699.99,
        category: Category.Electronics,
        supplier: {
            id: 1,
            name: "Tech Supplies Inc.",
            specifications: {
                "brand": "TechBrand",
                "model": "X1000",
                "storage": "128GB",
                "color": "Black"
            }
        }
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 199.99,
        category: Category.Accessories,
        supplier: {
            id: 2,
            name: "Audio Gear Co.",
            specifications: {
                "brand": "AudioGear",
                "model": "SoundPro",
                "batteryLife": "20 hours",
                "color": "White"
            }
        }
    },
];

export const Reviews: Review[] = [
    {
        id: 1,
        productId: 1,
        rating: 4,
        comment: "Great phone with excellent battery life.",
        reviewerName: "Alice"
    },
    {
        id: 2,
        productId: 1,
        rating: 5,
        comment: "Amazing performance and camera quality!",
        reviewerName: "Bob"
    },
    {
        id: 3,
        productId: 2,
        rating: 3,
        comment: "Good sound but uncomfortable for long use.",
        reviewerName: "Charlie"
    }
];