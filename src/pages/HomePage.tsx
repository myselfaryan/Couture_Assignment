import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, LayoutGrid, TrendingUp, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { productApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: products, status } = useAppSelector((state) => state.products);
    const { items: categories, status: categoryStatus } = useAppSelector((state) => state.categories);

    // Fetch all products to calculate accurate stats
    const [statsLoading, setStatsLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);

    useEffect(() => {
        dispatch(fetchProducts({ limit: 10 }));
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch all products for accurate stock stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                // Fetch all products (limit 0 returns all with total, or we fetch a large batch)
                const response = await productApi.getProducts(200, 0);
                setTotalProducts(response.total);

                const lowStock = response.products.filter(p => p.stock > 0 && p.stock <= 10).length;
                const outOfStock = response.products.filter(p => p.stock === 0).length;

                setLowStockCount(lowStock);
                setOutOfStockCount(outOfStock);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Products', value: totalProducts, icon: Package, loading: statsLoading },
        { label: 'Categories', value: categories.length, icon: LayoutGrid, loading: categoryStatus === 'loading' },
        { label: 'Low Stock', value: lowStockCount, icon: AlertCircle, loading: statsLoading },
        { label: 'Out of Stock', value: outOfStockCount, icon: TrendingUp, loading: statsLoading },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {stat.loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Link to="/dashboard/inventory">
                    <Card className="hover:border-primary/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">View Inventory</CardTitle>
                                <p className="text-sm text-muted-foreground">Browse all products with filters and sorting</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                </Link>

                <Link to="/dashboard/categories">
                    <Card className="hover:border-primary/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <LayoutGrid className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Browse Categories</CardTitle>
                                <p className="text-sm text-muted-foreground">Explore products by category</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* Recent Products */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Products</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/dashboard/inventory">View all</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {status === 'loading' ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[140px]">Product</TableHead>
                                        <TableHead className="whitespace-nowrap">Price</TableHead>
                                        <TableHead className="whitespace-nowrap">Stock</TableHead>
                                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.slice(0, 5).map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="max-w-[180px]">
                                                <Link to={`/dashboard/product/${product.id}`} className="flex items-center gap-2 sm:gap-3 hover:text-primary">
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover bg-muted flex-shrink-0"
                                                        loading="lazy"
                                                    />
                                                    <span className="font-medium text-sm sm:text-base line-clamp-2">{product.title}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">₹{product.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    product.stock === 0 ? 'destructive' :
                                                        product.stock <= 10 ? 'secondary' : 'default'
                                                } className="text-xs whitespace-nowrap">
                                                    {product.stock} in stock
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell capitalize whitespace-nowrap">{product.category.replace(/-/g, ' ')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HomePage;
