# TypeScript-Tasks

A TypeScript project that generates a product catalog report with discount calculations and customer ratings in the CLI and also as a webpage.

## Installation

```bash
npm install
```

## Running

### Compiling TypeScript to JavaScript

```bash
npm run build
```

### Task 1: Run the report

```bash
node dist/task1.js
```

### Task 2: Run the web app

1. Open VS Code
2. Install "Live Server" extension
3. Right-click on `src/index.html`
4. Select "Open with Live Server"

## Features

### Task 1 (CLI Report)
- **Product Catalog**: Displays all products with suppliers and specifications
- **Pricing & Discounts**:
  - Electronics: 10% discount
  - Accessories: 15% discount (if average rating ≥ 4)
- **Ratings**: Shows average rating and review count
- **Stock Status**: Displays availability (IN_STOCK / LOW / OUT)

### Task 2 (Web App)
- **Add Products**: Create new products with form validation
- **Search**: Find products by name in real-time
- **Sort**: Sort by name or price
- **Delete**: Remove products from the catalog
- **Export**: Download products as JSON file
- **Data Persistence**: Saves to browser LocalStorage

## Project Structure

```
src/
    task1.ts              # CLI report generation
    task2.ts              # Web application
    index.html            # Web app page
    styles.css            # Web app styling
    models/               # Data types (Product, Category, etc.)
    data/                 # Sample data (Products, Reviews)
    services/
        |__discounts.ts   # Discount logic
        |__stockService.ts
    helpers/
        |__formatters.ts
```
