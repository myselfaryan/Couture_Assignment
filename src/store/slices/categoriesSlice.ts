import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, LoadingState, ApiError } from '../../types';
import { categoryApi } from '../../services/api';

interface CategoryPreview {
    slug: string;
    images: string[];
}

interface CategoriesState {
    items: Category[];
    categoryPreviews: Record<string, string[]>;
    selectedCategorySlug: string;
    status: LoadingState;
    previewsStatus: LoadingState;
    error: ApiError | null;
}

const initialState: CategoriesState = {
    items: [],
    categoryPreviews: {},
    selectedCategorySlug: '',
    status: 'idle',
    previewsStatus: 'idle',
    error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk<
    Category[],
    void,
    { rejectValue: ApiError }
>(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryApi.getCategories();
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch categories',
            });
        }
    }
);

export const fetchCategoryPreviews = createAsyncThunk<
    CategoryPreview[],
    string[],
    { rejectValue: ApiError }
>(
    'categories/fetchCategoryPreviews',
    async (categories, { rejectWithValue }) => {
        try {
            const BASE_URL = 'https://dummyjson.com';
            const previews = await Promise.all(
                categories.map(async (category) => {
                    const response = await fetch(
                        `${BASE_URL}/products/category/${category}?limit=4&select=thumbnail`
                    );
                    const data = await response.json();
                    return {
                        slug: category,
                        images: data.products.map((p: { thumbnail: string }) => p.thumbnail),
                    };
                })
            );
            return previews;
        } catch (error) {
            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Failed to fetch category previews',
            });
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setSelectedCategorySlug: (state, action: PayloadAction<string>) => {
            state.selectedCategorySlug = action.payload;
        },
        clearCategoriesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            })
            // Fetch Category Previews
            .addCase(fetchCategoryPreviews.pending, (state) => {
                state.previewsStatus = 'loading';
            })
            .addCase(fetchCategoryPreviews.fulfilled, (state, action) => {
                state.previewsStatus = 'succeeded';
                action.payload.forEach((preview) => {
                    state.categoryPreviews[preview.slug] = preview.images;
                });
            })
            .addCase(fetchCategoryPreviews.rejected, (state, action) => {
                state.previewsStatus = 'failed';
                state.error = action.payload || { message: 'Unknown error occurred' };
            });
    },
});

export const { setSelectedCategorySlug, clearCategoriesError } = categoriesSlice.actions;

export default categoriesSlice.reducer;
