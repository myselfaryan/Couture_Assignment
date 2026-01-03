import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchCategories, fetchCategoryPreviews } from '@/store/slices/categoriesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CategoriesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: categories, categoryPreviews, status } = useAppSelector(
        (state) => state.categories
    );

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (categories.length > 0 && Object.keys(categoryPreviews).length === 0) {
            const categorySlugs = categories.map((c) => c.slug);
            dispatch(fetchCategoryPreviews(categorySlugs));
        }
    }, [dispatch, categories, categoryPreviews]);

    const isLoading = status === 'loading';

    return (
        <div className="space-y-4">
            {/* Info */}
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{categories.length} categories available</p>
                </CardContent>
            </Card>

            {/* Categories Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="aspect-video rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const images = categoryPreviews[category.slug] || [];
                        return (
                            <Link key={category.slug} to={`/dashboard/categories/${category.slug}`}>
                                <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                                    {/* Image Preview */}
                                    <div className="aspect-video bg-white relative overflow-hidden">
                                        {images.length > 0 ? (
                                            <img
                                                src={images[0]}
                                                alt={category.name}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                No preview
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Name */}
                                    <CardContent className="p-3 flex items-center justify-between">
                                        <span className="font-medium group-hover:text-primary transition-colors">
                                            {category.name}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
