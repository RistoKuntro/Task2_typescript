/**
 * Store Analytics - Task 2
 * 
 * A product management application with clean architecture:
 * - Input validation with null handling
 * - Separation of data and DOM logic
 * - No code duplication
 * - Type-safe TypeScript
 * - LocalStorage persistence with error handling
 * - Immutable state management
 */

// ===== TYPE DEFINITIONS =====

/**
 * Product interface with optional supplier
 */
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stockStatus: number;
    supplier: Supplier | null;
}

/**
 * Supplier information
 */
interface Supplier {
    name: string;
}

/**
 * Stock status with label and styling class
 */
interface StockStatusInfo {
    label: string;
    cssClass: string;
}

/**
 * Sort options for products
 */
type SortOption = "name" | "price-asc" | "price-desc";

/**
 * Validation error result
 */
interface ValidationError {
    fieldId: string;
    message: string;
}

// ===== CONSTANTS =====

const STORAGE_KEY = "storeAnalyticsProducts";
const MIN_PRODUCT_NAME_LENGTH = 2;
const MIN_PRICE = 0;
const MIN_STOCK_LOW = 0;
const STOCK_IN_STOCK_THRESHOLD = 3;

// ===== STATE MANAGEMENT =====

class ProductStore {
    private products: Product[] = [];
    private nextId: number = 1;
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
        this.load();
    }

    /**
     * Load products from localStorage with error handling
     */
    private load(): void {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    this.products = parsed;
                    this.nextId = Math.max(...this.products.map(p => p.id), 0) + 1;
                    console.log(`✅ Loaded ${this.products.length} products from storage`);
                }
            }
        } catch (error) {
            console.error("❌ Failed to load from storage:", error);
            this.products = [];
        }
    }

    /**
     * Save products to localStorage with error handling
     */
    private save(): boolean {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.products));
            console.log(`✅ Saved ${this.products.length} products to storage`);
            return true;
        } catch (error) {
            console.error("❌ Failed to save to storage:", error);
            return false;
        }
    }

    /**
     * Get all products (immutable copy)
     */
    getAll(): Product[] {
        return [...this.products];
    }

    /**
     * Add a new product
     */
    add(product: Omit<Product, "id">): Product {
        const newProduct: Product = {
            ...product,
            id: this.nextId++
        };
        this.products = [...this.products, newProduct];
        this.save();
        return newProduct;
    }

    /**
     * Delete a product by ID
     */
    delete(id: number): boolean {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        
        if (this.products.length < initialLength) {
            this.save();
            return true;
        }
        return false;
    }

    /**
     * Clear all products
     */
    clear(): void {
        this.products = [];
        this.nextId = 1;
        this.save();
    }

    /**
     * Export products as JSON
     */
    export(): string {
        return JSON.stringify(this.products, null, 2);
    }
}

// ===== VALIDATION LAYER =====

class ProductValidator {
    /**
     * Validate product form input
     */
    static validateProductForm(
        name: string | null | undefined,
        category: string | null | undefined,
        price: string | null | undefined,
        quantity: string | null | undefined
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Validate name
        if (!name || name.trim().length === 0) {
            errors.push({ fieldId: "productName", message: "Product name is required" });
        } else if (name.trim().length < MIN_PRODUCT_NAME_LENGTH) {
            errors.push({ 
                fieldId: "productName", 
                message: `Name must be at least ${MIN_PRODUCT_NAME_LENGTH} characters` 
            });
        }

        // Validate category
        if (!category || category.trim().length === 0) {
            errors.push({ fieldId: "productCategory", message: "Category is required" });
        }

        // Validate price
        if (!price || price.trim().length === 0) {
            errors.push({ fieldId: "productPrice", message: "Price is required" });
        } else {
            const numPrice = parseFloat(price);
            if (isNaN(numPrice) || numPrice < MIN_PRICE) {
                errors.push({ 
                    fieldId: "productPrice", 
                    message: "Price must be a valid positive number" 
                });
            }
        }

        // Validate quantity
        if (!quantity || quantity.trim().length === 0) {
            errors.push({ fieldId: "productQuantity", message: "Quantity is required" });
        } else {
            const numQuantity = parseInt(quantity, 10);
            if (isNaN(numQuantity) || numQuantity < MIN_STOCK_LOW) {
                errors.push({ 
                    fieldId: "productQuantity", 
                    message: "Quantity must be a non-negative number" 
                });
            }
        }

        return errors;
    }
}

// ===== BUSINESS LOGIC LAYER =====

class ProductService {
    /**
     * Determine stock status based on quantity
     */
    static getStockStatus(quantity: number): StockStatusInfo {
        if (quantity >= STOCK_IN_STOCK_THRESHOLD) {
            return { label: "IN_STOCK", cssClass: "status-in-stock" };
        }
        if (quantity > 0) {
            return { label: "LOW", cssClass: "status-low" };
        }
        return { label: "OUT_OF_STOCK", cssClass: "status-out" };
    }

    /**
     * Filter products by search query
     */
    static filterProducts(products: Product[], query: string): Product[] {
        if (!query || query.trim().length === 0) {
            return products;
        }
        const lowerQuery = query.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(lowerQuery));
    }

    /**
     * Sort products by option
     */
    static sortProducts(products: Product[], sortBy: SortOption): Product[] {
        const sorted = [...products];

        switch (sortBy) {
            case "name":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
        }

        return sorted;
    }
}

// ===== DOM UTILITIES =====

class DOMUtils {
    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(text: string | null | undefined): string {
        if (!text) return "";
        
        const map: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return String(text).replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Get element or throw error
     */
    static getElement(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    /**
     * Safe element query with null check
     */
    static queryElement<T extends HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    /**
     * Show error message for a field
     */
    static showFieldError(fieldId: string, message: string): void {
        const errorElement = this.queryElement(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? "block" : "none";
        }
    }

    /**
     * Clear all field errors
     */
    static clearAllErrors(): void {
        document.querySelectorAll(".error-message").forEach((el) => {
            (el as HTMLElement).textContent = "";
            (el as HTMLElement).style.display = "none";
        });
    }

    /**
     * Show temporary notification
     */
    static showNotification(message: string, type: "success" | "error"): void {
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add("show"), 10);
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}

// ===== UI CONTROLLER =====

class UIController {
    private store: ProductStore;

    constructor(store: ProductStore) {
        this.store = store;
    }

    /**
     * Create product card element
     */
    private createProductCard(product: Product): HTMLElement {
        const status = ProductService.getStockStatus(product.stockStatus);
        const supplierName = product.supplier?.name ?? "N/A";

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="product-name">${DOMUtils.escapeHtml(product.name)}</h3>
                    <p class="product-category">${DOMUtils.escapeHtml(product.category)}</p>
                </div>
                <button class="btn-delete" data-id="${product.id}" title="Delete">×</button>
            </div>
            <div class="card-content">
                <div class="price-rating">
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="stock-info">
                    <p>Stock: <strong>${product.stockStatus}</strong> units</p>
                    <div class="status-badge ${status.cssClass}">${status.label}</div>
                </div>
                <p class="supplier-info">Supplier: ${DOMUtils.escapeHtml(supplierName)}</p>
            </div>
        `;

        const deleteBtn = card.querySelector(".btn-delete") as HTMLButtonElement;
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                const id = parseInt(deleteBtn.dataset.id ?? "0", 10);
                if (confirm("Delete this product?")) {
                    this.store.delete(id);
                    this.render();
                }
            });
        }

        return card;
    }

    /**
     * Render product grid
     */
    render(sortBy: SortOption = "name", filterQuery: string = ""): void {
        const grid = DOMUtils.queryElement<HTMLDivElement>("productsGrid");
        const emptyState = DOMUtils.queryElement<HTMLDivElement>("emptyState");
        const count = DOMUtils.queryElement<HTMLElement>("productCount");

        if (!grid) return;

        const products = this.store.getAll();
        let displayed = ProductService.filterProducts(products, filterQuery);
        displayed = ProductService.sortProducts(displayed, sortBy);

        grid.innerHTML = "";
        displayed.forEach(product => grid.appendChild(this.createProductCard(product)));

        if (emptyState) {
            emptyState.style.display = displayed.length === 0 ? "block" : "none";
        }
        if (count) {
            count.textContent = displayed.length.toString();
        }
    }

    /**
     * Add product from form
     */
    addProductFromForm(): boolean {
        const nameInput = DOMUtils.queryElement<HTMLInputElement>("productName");
        const categoryInput = DOMUtils.queryElement<HTMLInputElement>("productCategory");
        const priceInput = DOMUtils.queryElement<HTMLInputElement>("productPrice");
        const quantityInput = DOMUtils.queryElement<HTMLInputElement>("productQuantity");

        const name = nameInput?.value ?? "";
        const category = categoryInput?.value ?? "";
        const price = priceInput?.value ?? "";
        const quantity = quantityInput?.value ?? "";

        // Validate
        DOMUtils.clearAllErrors();
        const errors = ProductValidator.validateProductForm(name, category, price, quantity);

        if (errors.length > 0) {
            errors.forEach(error => {
                DOMUtils.showFieldError(error.fieldId, error.message);
            });
            return false;
        }

        // Add product
        try {
            this.store.add({
                name: name.trim(),
                category: category.trim(),
                price: parseFloat(price),
                stockStatus: parseInt(quantity, 10),
                supplier: null
            });

            // Reset form
            if (nameInput) nameInput.value = "";
            if (categoryInput) categoryInput.value = "";
            if (priceInput) priceInput.value = "";
            if (quantityInput) quantityInput.value = "";

            this.render();
            DOMUtils.showNotification("✅ Product added!", "success");
            return true;
        } catch (error) {
            DOMUtils.showNotification("❌ Error adding product", "error");
            return false;
        }
    }

    /**
     * Clear all products
     */
    clearAllProducts(): void {
        if (confirm("Clear all products?")) {
            this.store.clear();
            this.render();
            DOMUtils.showNotification("All products cleared", "success");
        }
    }

    /**
     * Export products as JSON file
     */
    exportProducts(): void {
        try {
            const json = this.store.export();
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "products.json";
            link.click();
            URL.revokeObjectURL(url);
            DOMUtils.showNotification("📥 Downloaded products.json", "success");
        } catch (error) {
            DOMUtils.showNotification("❌ Export failed", "error");
        }
    }

    /**
     * Show debug information
     */
    showDebugInfo(): void {
        const debugOutput = DOMUtils.queryElement<HTMLPreElement>("debugOutput");
        if (!debugOutput) return;

        debugOutput.style.display = debugOutput.style.display === "none" ? "block" : "none";

        if (debugOutput.style.display === "block") {
            const products = this.store.getAll();
            const output = `=== Storage Data ===\n\nItems: ${products.length}\n\n${JSON.stringify(products, null, 2)}`;
            debugOutput.textContent = output;
        }
    }
}

// ===== APPLICATION INITIALIZATION =====

let uiController: UIController | null = null;

function initApp(): void {
    try {
        const store = new ProductStore(STORAGE_KEY);
        uiController = new UIController(store);

        // Setup event listeners
        const form = DOMUtils.queryElement<HTMLFormElement>("productForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                uiController?.addProductFromForm();
            });
        }

        const filterInput = DOMUtils.queryElement<HTMLInputElement>("filterInput");
        if (filterInput) {
            filterInput.addEventListener("input", () => {
                const sortSelect = DOMUtils.queryElement<HTMLSelectElement>("sortSelect");
                const sortValue = (sortSelect?.value as SortOption) || "name";
                uiController?.render(sortValue, filterInput.value);
            });
        }

        const sortSelect = DOMUtils.queryElement<HTMLSelectElement>("sortSelect");
        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                const filterInput = DOMUtils.queryElement<HTMLInputElement>("filterInput");
                const filterValue = filterInput?.value || "";
                uiController?.render(sortSelect.value as SortOption, filterValue);
            });
        }

        const clearBtn = DOMUtils.queryElement<HTMLButtonElement>("clearAllBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => uiController?.clearAllProducts());
        }

        const exportBtn = DOMUtils.queryElement<HTMLButtonElement>("exportBtn");
        if (exportBtn) {
            exportBtn.addEventListener("click", () => uiController?.exportProducts());
        }

        // Make debug function global
        (window as any).showDebugInfo = () => uiController?.showDebugInfo();

        // Initial render
        uiController.render();
        console.log("✅ Application initialized");
    } catch (error) {
        console.error("❌ Failed to initialize application:", error);
    }
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
