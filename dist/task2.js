"use strict";
const STORAGE_KEY = "storeAnalyticsProducts";
const MIN_PRODUCT_NAME_LENGTH = 2;
const MIN_PRICE = 0;
const MIN_STOCK_LOW = 0;
const STOCK_IN_STOCK_THRESHOLD = 3;
class ProductStore {
    constructor(storageKey) {
        this.products = [];
        this.nextId = 1;
        this.storageKey = storageKey;
        this.load();
    }
    load() {
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
        }
        catch (error) {
            console.error("❌ Failed to load from storage:", error);
            this.products = [];
        }
    }
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.products));
            console.log(`✅ Saved ${this.products.length} products to storage`);
            return true;
        }
        catch (error) {
            console.error("❌ Failed to save to storage:", error);
            return false;
        }
    }
    getAll() {
        return [...this.products];
    }
    add(product) {
        const newProduct = {
            ...product,
            id: this.nextId++
        };
        this.products = [...this.products, newProduct];
        this.save();
        return newProduct;
    }
    delete(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        if (this.products.length < initialLength) {
            this.save();
            return true;
        }
        return false;
    }
    clear() {
        this.products = [];
        this.nextId = 1;
        this.save();
    }
    export() {
        return JSON.stringify(this.products, null, 2);
    }
}
class ProductValidator {
    static validateProductForm(name, category, price, quantity) {
        const errors = [];
        if (!name || name.trim().length === 0) {
            errors.push({ fieldId: "productName", message: "Product name is required" });
        }
        else if (name.trim().length < MIN_PRODUCT_NAME_LENGTH) {
            errors.push({
                fieldId: "productName",
                message: `Name must be at least ${MIN_PRODUCT_NAME_LENGTH} characters`
            });
        }
        if (!category || category.trim().length === 0) {
            errors.push({ fieldId: "productCategory", message: "Category is required" });
        }
        if (!price || price.trim().length === 0) {
            errors.push({ fieldId: "productPrice", message: "Price is required" });
        }
        else {
            const numPrice = parseFloat(price);
            if (isNaN(numPrice) || numPrice < MIN_PRICE) {
                errors.push({
                    fieldId: "productPrice",
                    message: "Price must be a valid positive number"
                });
            }
        }
        if (!quantity || quantity.trim().length === 0) {
            errors.push({ fieldId: "productQuantity", message: "Quantity is required" });
        }
        else {
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
class ProductService {
    static getStockStatus(quantity) {
        if (quantity >= STOCK_IN_STOCK_THRESHOLD) {
            return { label: "IN_STOCK", cssClass: "status-in-stock" };
        }
        if (quantity > 0) {
            return { label: "LOW", cssClass: "status-low" };
        }
        return { label: "OUT_OF_STOCK", cssClass: "status-out" };
    }
    static filterProducts(products, query) {
        if (!query || query.trim().length === 0) {
            return products;
        }
        const lowerQuery = query.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(lowerQuery));
    }
    static sortProducts(products, sortBy) {
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
class DOMUtils {
    static escapeHtml(text) {
        if (!text)
            return "";
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return String(text).replace(/[&<>"']/g, char => map[char]);
    }
    static getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }
    static queryElement(id) {
        return document.getElementById(id);
    }
    static showFieldError(fieldId, message) {
        const errorElement = this.queryElement(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? "block" : "none";
        }
    }
    static clearAllErrors() {
        document.querySelectorAll(".error-message").forEach((el) => {
            el.textContent = "";
            el.style.display = "none";
        });
    }
    static showNotification(message, type) {
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
class UIController {
    constructor(store) {
        this.store = store;
    }
    createProductCard(product) {
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
        const deleteBtn = card.querySelector(".btn-delete");
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
    render(sortBy = "name", filterQuery = "") {
        const grid = DOMUtils.queryElement("productsGrid");
        const emptyState = DOMUtils.queryElement("emptyState");
        const count = DOMUtils.queryElement("productCount");
        if (!grid)
            return;
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
    addProductFromForm() {
        const nameInput = DOMUtils.queryElement("productName");
        const categoryInput = DOMUtils.queryElement("productCategory");
        const priceInput = DOMUtils.queryElement("productPrice");
        const quantityInput = DOMUtils.queryElement("productQuantity");
        const name = nameInput?.value ?? "";
        const category = categoryInput?.value ?? "";
        const price = priceInput?.value ?? "";
        const quantity = quantityInput?.value ?? "";
        DOMUtils.clearAllErrors();
        const errors = ProductValidator.validateProductForm(name, category, price, quantity);
        if (errors.length > 0) {
            errors.forEach(error => {
                DOMUtils.showFieldError(error.fieldId, error.message);
            });
            return false;
        }
        try {
            this.store.add({
                name: name.trim(),
                category: category.trim(),
                price: parseFloat(price),
                stockStatus: parseInt(quantity, 10),
                supplier: null
            });
            if (nameInput)
                nameInput.value = "";
            if (categoryInput)
                categoryInput.value = "";
            if (priceInput)
                priceInput.value = "";
            if (quantityInput)
                quantityInput.value = "";
            this.render();
            DOMUtils.showNotification("✅ Product added!", "success");
            return true;
        }
        catch (error) {
            DOMUtils.showNotification("❌ Error adding product", "error");
            return false;
        }
    }
    clearAllProducts() {
        if (confirm("Clear all products?")) {
            this.store.clear();
            this.render();
            DOMUtils.showNotification("All products cleared", "success");
        }
    }
    exportProducts() {
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
        }
        catch (error) {
            DOMUtils.showNotification("❌ Export failed", "error");
        }
    }
    showDebugInfo() {
        const debugOutput = DOMUtils.queryElement("debugOutput");
        if (!debugOutput)
            return;
        debugOutput.style.display = debugOutput.style.display === "none" ? "block" : "none";
        if (debugOutput.style.display === "block") {
            const products = this.store.getAll();
            const output = `=== Storage Data ===\n\nItems: ${products.length}\n\n${JSON.stringify(products, null, 2)}`;
            debugOutput.textContent = output;
        }
    }
}
let uiController = null;
function initApp() {
    try {
        const store = new ProductStore(STORAGE_KEY);
        uiController = new UIController(store);
        const form = DOMUtils.queryElement("productForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                uiController?.addProductFromForm();
            });
        }
        const filterInput = DOMUtils.queryElement("filterInput");
        if (filterInput) {
            filterInput.addEventListener("input", () => {
                const sortSelect = DOMUtils.queryElement("sortSelect");
                const sortValue = sortSelect?.value || "name";
                uiController?.render(sortValue, filterInput.value);
            });
        }
        const sortSelect = DOMUtils.queryElement("sortSelect");
        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                const filterInput = DOMUtils.queryElement("filterInput");
                const filterValue = filterInput?.value || "";
                uiController?.render(sortSelect.value, filterValue);
            });
        }
        const clearBtn = DOMUtils.queryElement("clearAllBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => uiController?.clearAllProducts());
        }
        const exportBtn = DOMUtils.queryElement("exportBtn");
        if (exportBtn) {
            exportBtn.addEventListener("click", () => uiController?.exportProducts());
        }
        window.showDebugInfo = () => uiController?.showDebugInfo();
        uiController.render();
        console.log("✅ Application initialized");
    }
    catch (error) {
        console.error("❌ Failed to initialize application:", error);
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
}
else {
    initApp();
}
//# sourceMappingURL=task2.js.map