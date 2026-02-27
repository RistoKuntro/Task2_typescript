"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = exports.Products = void 0;
const Category_1 = require("../models/Category");
exports.Products = [
    {
        id: 1,
        name: "Smartphone",
        price: 699.99,
        category: Category_1.Category.Electronics,
        supplier: {
            id: 1,
            name: "Tech Supplies Inc.",
            specifications: {
                brand: "TechBrand",
                model: "X1000",
                storage: "128GB",
                color: "Black",
            },
        },
        stockStatus: 5,
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 199.99,
        category: Category_1.Category.Accessories,
        supplier: {
            id: 2,
            name: "Audio Gear Co.",
            specifications: {
                brand: "AudioGear",
                model: "SoundPro",
                batteryLife: "20 hours",
                color: "White",
            },
        },
        stockStatus: 2,
    },
    {
        id: 3,
        name: "Laptop",
        price: 1299.99,
        category: Category_1.Category.Electronics,
        supplier: {
            id: 1,
            name: "Tech Supplies Inc.",
            specifications: {
                brand: "TechBrand",
                model: "LaptopPro",
                ram: "16GB",
                storage: "512GB SSD",
            },
        },
        stockStatus: 3,
    },
];
exports.Reviews = [
    {
        id: 1,
        productId: 1,
        rating: 4,
        comment: "Great phone with excellent battery life.",
        reviewerName: "Alice",
    },
    {
        id: 2,
        productId: 1,
        rating: 5,
        comment: "Amazing performance and camera quality!",
        reviewerName: "Bob",
    },
    {
        id: 3,
        productId: 2,
        rating: 3,
        comment: "Good sound but uncomfortable for long use.",
        reviewerName: "Charlie",
    },
];
