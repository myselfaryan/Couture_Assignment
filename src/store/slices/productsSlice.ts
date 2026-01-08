import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsResponse, LoadingState, ApiError, SortBy, SortOrder } from '../../types';
import { productApi } from '../../services/api';

interface ProductsState {
    items: Product[];
    selectedProduct: Product | null;
    similarProducts: Product[];
    total: number;
    skip: number;
    limit: number;
    status: LoadingState;
    selectedProductStatus: LoadingState;
    similarProductsStatus: LoadingState;
    error: ApiError | null;
    // Filter states
    searchQuery: string;
    selectedCategory: string;
    sortBy: SortBy;
    sortOrder: SortOrder; 
    currentPage: number;
    itemsPerPage: number;
}

const initialState: ProductsState = {
    items: [],
    selectedProduct: null,
    similarProducts: [],
    total: 0,
    skip: 0,
    limit: 20,
    status: 'idle',
    selectedProductStatus: 'idle',
    similarProductsStatus: 'idle',
    error: null,
    searchQuery: '',
    selectedCategory: '',
    sortBy: 'stock',
    sortOrder: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
};

// Async Thunks
export const fetchProducts = createAsyncThunk<
    ProductsResponse,
    { limit?: number; skip?: number; sortBy?: SortBy; sortOrder?: SortOrder },
    { rejectValue: ApiError }
>(
    'products/fetchProducts',
    async ({ limit = 20, skip = 0, sortBy, sortOrder }, { rejectWithValue }) => {
        try {
            const response = await productApi.getProducts(limit, skip, sortBy, sortOrder);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch products',
            });
        }
    }
);

export const fetchProductById = createAsyncThunk<
    Product,
    number,
    { rejectValue: ApiError }
>(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productApi.getProductById(id);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch product',
            });
        }
    }
);

export const searchProducts = createAsyncThunk<
    ProductsResponse,
    { query: string; limit?: number; skip?: number },
    { rejectValue: ApiError }
>(
    'products/searchProducts',
    async ({ query, limit = 20, skip = 0 }, { rejectWithValue }) => {
        try {
            // Fetch more results from API since we'll filter client-side
            // The API searches all fields, but we only want to match by title/name
            const response = await productApi.searchProducts(query, 100, 0);

            // Filter products to only include those where the title matches the query
            const queryLower = query.toLowerCase();
            const filteredProducts = response.products.filter(product =>
                product.title.toLowerCase().includes(queryLower)
            );

            // Apply pagination to filtered results
            const paginatedProducts = filteredProducts.slice(skip, skip + limit);

            return {
                products: paginatedProducts,
                total: filteredProducts.length,
                skip: skip,
                limit: limit,
            };
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to search products',
            });
        }
    }
);

export const fetchProductsByCategory = createAsyncThunk<
    ProductsResponse,
    { category: string; limit?: number; skip?: number; sortBy?: SortBy; sortOrder?: SortOrder },
    { rejectValue: ApiError }
>(
    'products/fetchProductsByCategory',
    async ({ category, limit = 20, skip = 0, sortBy, sortOrder }, { rejectWithValue }) => {
        try {
            const response = await productApi.getProductsByCategory(category, limit, skip, sortBy, sortOrder);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch products by category',
            });
        }
    }
);

export const fetchSimilarProducts = createAsyncThunk<
    ProductsResponse,
    { category: string; excludeId?: number },
    { rejectValue: ApiError }
>(
    'products/fetchSimilarProducts',
    async ({ category, excludeId }, { rejectWithValue }) => {
        try {
            const response = await productApi.getSimilarProducts(category, 6, excludeId);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch similar products',
            });
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.currentPage = 1;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
            state.currentPage = 1;
        },
        setSortBy: (state, action: PayloadAction<SortBy>) => {
            state.sortBy = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<SortOrder>) => {
            state.sortOrder = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
            state.similarProducts = [];
            state.selectedProductStatus = 'idle';
            state.similarProductsStatus = 'idle';
        },
        clearFilters: (state) => {
            state.searchQuery = '';
            state.selectedCategory = '';
            state.sortBy = 'title';
            state.sortOrder = 'asc';
            state.currentPage = 1;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
                state.limit = action.payload.limit;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            })
            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) => {
                state.selectedProductStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProductStatus = 'succeeded';
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.selectedProductStatus = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            })
            // Search Products
            .addCase(searchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
                state.limit = action.payload.limit;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            })
            // Fetch Products By Category
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
                state.limit = action.payload.limit;
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            })
            // Fetch Similar Products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.similarProductsStatus = 'loading';
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.similarProductsStatus = 'succeeded';
                state.similarProducts = action.payload.products;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.similarProductsStatus = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            });
    },
});

export const {
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setItemsPerPage,
    clearSelectedProduct,
    clearFilters,
    clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
