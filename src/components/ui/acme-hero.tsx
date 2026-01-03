"use client";

import { Package, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function AcmeHero() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-5xl mx-auto">
                <header className="relative pt-4">
                    <nav className="flex items-center justify-between rounded-xl bg-background py-2 px-4 shadow-lg border">
                        <div className="flex items-center space-x-6">
                            <a href="/" className="flex items-center gap-2 text-base font-semibold">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                                    <Package className="h-4 w-4" />
                                </div>
                                CoutureStore
                            </a>
                            <div className="hidden md:flex items-center space-x-6">
                                <button
                                    onClick={() => navigate('/dashboard/inventory')}
                                    className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                                >
                                    Products
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard/categories')}
                                    className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                                >
                                    Categories
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                                >
                                    Dashboard
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Separator orientation="vertical" className="h-6 hidden md:block" />
                            <Button
                                variant="ghost"
                                className="hidden md:inline-flex h-7 px-2 text-sm font-normal text-muted-foreground/60 hover:text-foreground/80"
                                onClick={() => navigate('/dashboard')}
                            >
                                Explore
                            </Button>
                            <Button
                                className="hidden md:inline-flex h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90"
                                onClick={() => navigate('/dashboard')}
                            >
                                Get Started
                            </Button>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 md:hidden"
                                    >
                                        <Menu className="h-[15px] w-[15px]" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                                    <nav className="flex flex-col space-y-4 mt-6">
                                        <button
                                            onClick={() => navigate('/dashboard/inventory')}
                                            className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors text-left"
                                        >
                                            Products
                                        </button>
                                        <button
                                            onClick={() => navigate('/dashboard/categories')}
                                            className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors text-left"
                                        >
                                            Categories
                                        </button>
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors text-left"
                                        >
                                            Dashboard
                                        </button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start h-7 px-0 text-sm font-normal text-muted-foreground/60 hover:text-foreground/80"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            Explore
                                        </Button>
                                        <Button
                                            className="h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            Get Started
                                        </Button>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </nav>
                </header>

                <main className="relative container px-2 mx-auto">
                    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36">
                        <motion.div
                            className="flex flex-col items-center space-y-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.h1
                                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                Inventory, Simplified
                            </motion.h1>
                            <motion.p
                                className="mx-auto max-w-xl text-md sm:text-2xl text-muted-foreground"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Manage your store with{" "}
                                <span className="font-semibold text-foreground">
                                    powerful tools
                                </span>{" "}
                                and{" "}
                                <span className="font-semibold text-foreground">real-time insights</span>
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <Button
                                    className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Go to Dashboard
                                    <div className="ml-2 space-x-1 hidden sm:inline-flex">
                                        <Package className="w-5 h-5" />
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => navigate('/dashboard/inventory')}
                                >
                                    <div className="mr-2 space-x-1 hidden sm:inline-flex">
                                        <span className="w-5 h-5 text-xs rounded-sm border flex items-center justify-center">#</span>
                                    </div>
                                    Browse Products
                                </Button>
                            </motion.div>

                            <motion.div
                                className="flex flex-col items-center space-y-3 pb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="text-primary hover:text-primary/80 transition-colors">
                                        194+ Products
                                    </span>
                                    <span className="text-muted-foreground/60">
                                        24 Categories
                                    </span>
                                    <span className="text-primary hover:text-primary/80 transition-colors">
                                        Real-time Stock
                                    </span>
                                </div>

                            </motion.div>
                            <motion.div
                                className="w-full border p-2 rounded-3xl"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                <div className="relative w-full">
                                    <div className="relative w-full rounded-3xl overflow-hidden border shadow-2xl">
                                        <img
                                            src="/public/screenshot.png"
                                            alt="Dashboard Preview"
                                            className="w-full h-full object-center block rounded-3xl"
                                        />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-background to-transparent" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>
                </main>
            </div>
        </div>
    );
}
