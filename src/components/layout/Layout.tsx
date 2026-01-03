import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Separator } from '@/components/ui/separator';
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path === '/dashboard/inventory') return 'Inventory';
        if (path === '/dashboard/categories') return 'Categories';
        if (path.startsWith('/dashboard/categories/')) return 'Category Products';
        if (path.startsWith('/dashboard/product/')) return 'Product Details';
        return 'CoutureStore';
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-auto p-4 md:p-6">
                    {children || <Outlet />}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;
