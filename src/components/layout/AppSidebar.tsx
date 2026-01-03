import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Package, LayoutGrid, Home } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/dashboard/inventory', label: 'Inventory', icon: Package },
    { path: '/dashboard/categories', label: 'Categories', icon: LayoutGrid },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <NavLink to="/" className="flex items-center gap-2 px-2 py-1 hover:opacity-80 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Package className="h-4 w-4" />
                    </div>
                    <span className="font-semibold">CoutureStore</span>
                </NavLink>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path ||
                                    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                                            <NavLink to={item.path}>
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


        </Sidebar>
    );
}
