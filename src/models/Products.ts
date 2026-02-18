import { Category } from "./Category";
import type { Supplier } from "./Supplier";

export interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    supplier: Supplier;
    specifications?: Record<string, string | number>;
}