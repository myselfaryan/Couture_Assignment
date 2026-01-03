import { Product, ProductsResponse, Category, SortBy, SortOrder } from '../types';

const BASE_URL = 'https://dummyjson.com';

// Generic fetch wrapper with error handling
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Product APIs
export const productApi = {
    // Get all products with pagination, sorting, and optional search
    getProducts: async (
        limit: number = 20,
        skip: number = 0,
        sortBy?: SortBy,
        order?: SortOrder
    ): Promise<ProductsResponse> => {
        let url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;

        if (sortBy) {
            url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        }

        return fetchWithErrorHandling<ProductsResponse>(url);
    },

    // Get a single product by ID
    getProductById: async (id: number): Promise<Product> => {
        return fetchWithErrorHandling<Product>(`${BASE_URL}/products/${id}`);
    },

    // Search products with optional pagination
    searchProducts: async (
        query: string,
        limit: number = 20,
        skip: number = 0
    ): Promise<ProductsResponse> => {
        return fetchWithErrorHandling<ProductsResponse>(
            `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        );
    },

    // Get products by category with pagination
    getProductsByCategory: async (
        category: string,
        limit: number = 20,
        skip: number = 0,
        sortBy?: SortBy,
        order?: SortOrder
    ): Promise<ProductsResponse> => {
        let url = `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;

        if (sortBy) {
            url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        }

        return fetchWithErrorHandling<ProductsResponse>(url);
    },

    // Get similar/related products (same category, limited results)
    getSimilarProducts: async (
        category: string,
        limit: number = 6,
        excludeId?: number
    ): Promise<ProductsResponse> => {
        const response = await fetchWithErrorHandling<ProductsResponse>(
            `${BASE_URL}/products/category/${category}?limit=${limit + 1}`
        );

        // Filter out the current product if excludeId is provided
        if (excludeId) {
            response.products = response.products.filter(p => p.id !== excludeId).slice(0, limit);
        }

        return response;
    },
};

// Category APIs
export const categoryApi = {
    // Get all categories with details
    getCategories: async (): Promise<Category[]> => {
        return fetchWithErrorHandling<Category[]>(`${BASE_URL}/products/categories`);
    },

    // Get category list (slugs only)
    getCategoryList: async (): Promise<string[]> => {
        return fetchWithErrorHandling<string[]>(`${BASE_URL}/products/category-list`);
    },

    // Get first product image for a category (for category cards)
    getCategoryPreview: async (category: string): Promise<string> => {
        const response = await fetchWithErrorHandling<ProductsResponse>(
            `${BASE_URL}/products/category/${category}?limit=4&select=thumbnail`
        );

        return response.products[0]?.thumbnail || '';
    },
};

export default {
    productApi,
    categoryApi,
};
