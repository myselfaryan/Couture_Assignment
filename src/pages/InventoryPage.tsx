import React, { useEffect, useCallback, useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector, useDebounce } from '@/hooks';
import {
    fetchProducts,
    fetchProductsByCategory,
    searchProducts,
    setCurrentPage,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setSortOrder,
} from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import type { SortBy, SortOrder, Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ViewMode = 'table' | 'grid';

// Memoized Product Row - minimal re-renders
const ProductRow = memo(({ product }: { product: Product }) => (
    <TableRow>
        <TableCell className="min-w-[180px] max-w-[280px]">
            <Link to={`/dashboard/product/${product.id}`} className="flex items-center gap-2 sm:gap-3 hover:text-primary">
                <img
                    src={product.thumbnail}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover bg-muted flex-shrink-0"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{product.title}</p>
                    {product.discountPercentage > 5 && (
                        <span className="text-xs text-destructive">{Math.round(product.discountPercentage)}% off</span>
                    )}
                </div>
            </Link>
        </TableCell>
        <TableCell className="whitespace-nowrap">
            <span className="font-medium">₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</span>
        </TableCell>
        <TableCell className="hidden md:table-cell whitespace-nowrap">{product.brand || '-'}</TableCell>
        <TableCell className="hidden lg:table-cell capitalize whitespace-nowrap">{product.category.replace(/-/g, ' ')}</TableCell>
        <TableCell className="hidden sm:table-cell whitespace-nowrap">★ {product.rating.toFixed(1)}</TableCell>
        <TableCell className="whitespace-nowrap">
            <Badge variant={product.stock === 0 ? 'destructive' : product.stock <= 10 ? 'secondary' : 'default'} className="text-xs">
                {product.stock} in stock
            </Badge>
        </TableCell>
    </TableRow>
));
ProductRow.displayName = 'ProductRow';

// Memoized Product Card
const ProductCard = memo(({ product }: { product: Product }) => (
    <Link to={`/dashboard/product/${product.id}`}>
        <Card className="overflow-hidden hover:border-primary/50">
            <div className="aspect-square bg-muted">
                <img src={product.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{product.title}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold">₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">★ {product.rating.toFixed(1)}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
));
ProductCard.displayName = 'ProductCard';

const InventoryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [localSearch, setLocalSearch] = useState('');

    // Debounce search - 500ms for better performance
    const debouncedSearch = useDebounce(localSearch, 500);

    const { items: products, total, status, searchQuery, selectedCategory, sortBy, sortOrder, currentPage, itemsPerPage } =
        useAppSelector((state) => state.products);
    const { items: categories } = useAppSelector((state) => state.categories);

    const totalPages = Math.ceil(total / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;
    const isLoading = status === 'loading';

    useEffect(() => {
        if (categories.length === 0) dispatch(fetchCategories());
    }, [dispatch, categories.length]);

    // Debounced search effect
    useEffect(() => {
        if (debouncedSearch !== searchQuery) {
            dispatch(setSearchQuery(debouncedSearch));
            dispatch(setCurrentPage(1));
        }
    }, [debouncedSearch, dispatch, searchQuery]);

    // Load data effect
    useEffect(() => {
        if (searchQuery) {
            dispatch(searchProducts({ query: searchQuery, limit: itemsPerPage, skip }));
        } else if (selectedCategory) {
            dispatch(fetchProductsByCategory({ category: selectedCategory, limit: itemsPerPage, skip, sortBy, sortOrder }));
        } else {
            dispatch(fetchProducts({ limit: itemsPerPage, skip, sortBy, sortOrder }));
        }
    }, [dispatch, searchQuery, selectedCategory, sortBy, sortOrder, itemsPerPage, skip]);

    // Handlers for shadcn Select components
    const handleCategoryChange = (value: string) => {
        dispatch(setSelectedCategory(value === 'all' ? '' : value));
        dispatch(setCurrentPage(1));
    };

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split('-') as [SortBy, SortOrder];
        dispatch(setSortBy(newSortBy));
        dispatch(setSortOrder(newSortOrder));
    };

    const clearSearch = () => {
        setLocalSearch('');
        dispatch(setSearchQuery(''));
        dispatch(setCurrentPage(1));
    };

    return (
        <div className="space-y-4 w-full min-w-0">
            {/* Search & Filters - Using native selects for better performance */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Quick find products by name..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="flex h-11 w-full rounded-md border border-input bg-transparent pl-10 pr-10 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        {localSearch && (
                            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                        )}
                    </div>

                    {/* Filters Row - shadcn Select components */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-[160px] sm:w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[140px] sm:w-[160px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title-asc">Name A-Z</SelectItem>
                                <SelectItem value="title-desc">Name Z-A</SelectItem>
                                <SelectItem value="price-asc">Price Low-High</SelectItem>
                                <SelectItem value="price-desc">Price High-Low</SelectItem>
                                <SelectItem value="rating-desc">Rating High-Low</SelectItem>
                                <SelectItem value="stock-asc">Stock Low-High</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex-1" />

                        <div className="flex border rounded-md">
                            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('table')}>
                                <List className="w-4 h-4" />
                            </Button>
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Results info */}
                    <p className="text-sm text-muted-foreground">
                        Showing {products.length} of {total} products
                        {searchQuery && <> for "{searchQuery}"</>}
                        {selectedCategory && <> in <span className="capitalize">{selectedCategory.replace(/-/g, ' ')}</span></>}
                    </p>
                </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
                <Card><CardContent className="py-12 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin" /></CardContent></Card>
            ) : products.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">No products found</CardContent></Card>
            ) : viewMode === 'table' ? (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[180px]">Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Brand</TableHead>
                                    <TableHead className="hidden lg:table-cell">Category</TableHead>
                                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                                    <TableHead>Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => <ProductRow key={product.id} product={product} />)}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { dispatch(setCurrentPage(currentPage - 1)); }} disabled={currentPage === 1}>
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { dispatch(setCurrentPage(currentPage + 1)); }} disabled={currentPage === totalPages}>
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
