import { Category } from "./Category";
import type { Supplier } from "./Supplier";

export interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    supplier: Supplier;
    stockStatus: number;
    specifications?: Record<string, string | number>;
}