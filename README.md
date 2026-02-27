# TypeScript-Tasks

A TypeScript project that generates a product catalog report with discount calculations and customer ratings in the CLI and also as a webpage.

## Installation

```bash
npm install
```

## Running

### Compiling TypeScript to JavaScript

```bash
npx tsc
```

### Run the report

```bash
node dist/task1.js
```

## Features

- **Product Catalog**: Displays all products with suppliers and specifications
- **Pricing & Discounts**:
  - Electronics: 10% discount
  - Accessories: 15% discount (if average rating ≥ 4)
- **Ratings**: Shows average rating and review count
- **Stock Status**: Displays availability (IN_STOCK / LOW / OUT)

## Project Structure

```
src/
    task1.ts              # Main report generation
    models/               # Data types (Product, Category, etc.)
    data/                 # Sample data (Products, Reviews)
    services/
        |__discounts.ts   # Discount logic
```