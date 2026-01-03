import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProductById, fetchSimilarProducts } from '@/store/slices/productsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [selectedImage, setSelectedImage] = useState(0);

    const { selectedProduct, similarProducts, selectedProductStatus, error } = useAppSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(parseInt(id)));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchSimilarProducts({
                category: selectedProduct.category,
                excludeId: selectedProduct.id,
            }));
        }
    }, [dispatch, selectedProduct]);

    if (selectedProductStatus === 'loading' || !selectedProduct) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (selectedProductStatus === 'failed' && error) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-destructive">
                    {error.message}
                </CardContent>
            </Card>
        );
    }

    const product = selectedProduct;
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/inventory" className="gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Inventory
                </Link>
            </Button>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded overflow-hidden">
                                <img
                                    src={product.images[selectedImage] || product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`aspect-square rounded overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground capitalize">{product.category.replace(/-/g, ' ')}</p>
                                <h1 className="text-2xl font-semibold mt-1">{product.title}</h1>
                                {product.brand && <p className="text-muted-foreground">by {product.brand}</p>}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-muted'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)</span>
                            </div>

                            <Separator />

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">₹{discountedPrice.toFixed(2)}</span>
                                {product.discountPercentage > 0 && (
                                    <>
                                        <span className="text-lg text-muted-foreground line-through">₹{product.price.toFixed(2)}</span>
                                        <Badge variant="destructive">-{Math.round(product.discountPercentage)}%</Badge>
                                    </>
                                )}
                            </div>

                            {/* Stock */}
                            <Badge variant={
                                product.stock === 0 ? 'destructive' :
                                    product.stock <= 10 ? 'secondary' : 'default'
                            }>
                                {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                            </Badge>

                            <Separator />

                            {/* Description */}
                            <div>
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Specifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">SKU</dt>
                                    <dd className="font-medium">{product.sku}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Weight</dt>
                                    <dd className="font-medium">{product.weight}g</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Dimensions</dt>
                                    <dd className="font-medium">
                                        {product.dimensions?.width} × {product.dimensions?.height} × {product.dimensions?.depth} cm
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Min Order</dt>
                                    <dd className="font-medium">{product.minimumOrderQuantity} units</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Shipping & Warranty */}
                    <div className="grid grid-cols-3 gap-4">
                        {product.shippingInformation && (
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-muted-foreground">Shipping</p>
                                    <p className="text-sm font-medium mt-1">{product.shippingInformation}</p>
                                </CardContent>
                            </Card>
                        )}
                        {product.warrantyInformation && (
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-muted-foreground">Warranty</p>
                                    <p className="text-sm font-medium mt-1">{product.warrantyInformation}</p>
                                </CardContent>
                            </Card>
                        )}
                        {product.returnPolicy && (
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-muted-foreground">Returns</p>
                                    <p className="text-sm font-medium mt-1">{product.returnPolicy}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Reviews ({product.reviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {product.reviews.map((review: { reviewerName: string; date: string; rating: number; comment: string }, i: number) => (
                            <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{review.reviewerName}</span>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, j) => (
                                            <Star
                                                key={j}
                                                className={`w-3 h-3 ${j < review.rating ? 'text-yellow-400 fill-current' : 'text-muted'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Similar Products</h3>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to={`/dashboard/categories/${product.category}`}>View all</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {similarProducts.slice(0, 6).map((p) => (
                            <Link key={p.id} to={`/dashboard/product/${p.id}`}>
                                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                                    <div className="aspect-square bg-muted">
                                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                                    </div>
                                    <CardContent className="p-2">
                                        <p className="text-xs font-medium truncate">{p.title}</p>
                                        <p className="text-sm font-semibold mt-1">₹{(p.price * (1 - p.discountPercentage / 100)).toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;
