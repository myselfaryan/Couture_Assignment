import React, { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
    fetchProductsByCategory,
    setCurrentPage,
    setSortBy,
    setSortOrder,
} from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import type { SortBy, SortOrder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type ViewMode = 'table' | 'grid';

const CategoryProductsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const {
        items: products,
        total,
        status,
        sortBy,
        sortOrder,
        currentPage,
        itemsPerPage,
    } = useAppSelector((state) => state.products);

    const { items: categories } = useAppSelector((state) => state.categories);

    const totalPages = Math.ceil(total / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    const category = categories.find((c) => c.slug === slug);
    const categoryName = category?.name || slug?.replace(/-/g, ' ') || 'Category';

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length]);

    const loadData = useCallback(() => {
        if (slug) {
            dispatch(fetchProductsByCategory({
                category: slug,
                limit: itemsPerPage,
                skip,
                sortBy,
                sortOrder,
            }));
        }
    }, [dispatch, slug, itemsPerPage, skip, sortBy, sortOrder]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split('-') as [SortBy, SortOrder];
        dispatch(setSortBy(newSortBy));
        dispatch(setSortOrder(newSortOrder));
    };

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isLoading = status === 'loading';

    return (
        <div className="space-y-4">
            {/* Back link */}
            <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/categories" className="gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                </Link>
            </Button>

            {/* Header */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div>
                        <CardTitle className="capitalize">{categoryName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{total} products</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title-asc">Name A-Z</SelectItem>
                                <SelectItem value="title-desc">Name Z-A</SelectItem>
                                <SelectItem value="price-asc">Price Low-High</SelectItem>
                                <SelectItem value="price-desc">Price High-Low</SelectItem>
                                <SelectItem value="rating-desc">Rating High-Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex border rounded-md">
                            <Button
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('table')}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Content */}
            {isLoading ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        Loading...
                    </CardContent>
                </Card>
            ) : products.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No products found
                    </CardContent>
                </Card>
            ) : viewMode === 'table' ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Link to={`/dashboard/product/${product.id}`} className="flex items-center gap-3 hover:text-primary">
                                            <img src={product.thumbnail} alt="" className="w-10 h-10 rounded object-cover bg-muted" />
                                            <span className="font-medium">{product.title}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</TableCell>
                                    <TableCell><span className="text-yellow-500">★</span> {product.rating.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            product.stock === 0 ? 'destructive' :
                                                product.stock <= 10 ? 'secondary' : 'default'
                                        }>
                                            {product.stock} in stock
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link key={product.id} to={`/dashboard/product/${product.id}`}>
                            <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="aspect-square bg-muted">
                                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
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
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;
