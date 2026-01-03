// Product Types
export interface ProductDimensions {
    width: number;
    height: number;
    depth: number;
}

export interface ProductReview {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

export interface ProductMeta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: ProductDimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: ProductReview[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: ProductMeta;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// Category Types
export interface Category {
    slug: string;
    name: string;
    url: string;
}

// Filter & Sort Types
export type SortBy = 'title' | 'price' | 'rating' | 'stock';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
    category: string;
    searchQuery: string;
    sortBy: SortBy;
    sortOrder: SortOrder;
}

// Pagination Types
export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    total: number;
}

// API State Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ApiError {
    message: string;
    status?: number;
}

// Stock Status Types
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
};

export const getStockStatusClass = (stock: number): string => {
    if (stock === 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-in';
};
