'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .hero-section * { font-family: 'Poppins', sans-serif; }
      `}</style>

            <section className="hero-section min-h-screen w-full bg-gradient-to-b from-orange-50 via-orange-50/50 to-white bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] bg-no-repeat bg-cover bg-top">
                {/* Navigation */}
                <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-semibold text-slate-900">CoutureStore</span>
                    </a>

                    {/* Center Nav Links */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-700">
                        <a href="/" className="hover:text-slate-900 transition">Home</a>
                        <button
                            onClick={() => navigate('/dashboard/inventory')}
                            className="hover:text-slate-900 transition"
                        >
                            Products
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/categories')}
                            className="hover:text-slate-900 transition"
                        >
                            Categories
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hover:text-slate-900 transition"
                        >
                            Dashboard
                        </button>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium transition text-sm"
                    >
                        Get Started
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="flex flex-col items-center justify-center px-4 pt-24 md:pt-32 pb-32">
                    {/* Announcement Badge */}
                    <div className="flex items-center gap-2 border border-slate-300 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                        <span className="text-sm text-slate-600">Track 194+ products across 24 categories</span>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1 font-medium text-slate-900 text-sm"
                        >
                            <span>Explore now</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold max-w-4xl text-center mt-10 text-slate-900 leading-tight">
                        Manage your store inventory with ease
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-slate-600 mx-auto max-w-2xl text-center mt-6 leading-relaxed">
                        Track products, monitor stock levels, and organize categories effortlessly. <span className="underline decoration-slate-400 underline-offset-2">CoutureStore</span> helps you stay on top of your inventory.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3 mt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-7 py-3 rounded-full font-medium transition text-sm"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/inventory')}
                            className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-full px-7 py-3 text-sm font-medium transition"
                        >
                            <span>View Inventory</span>
                            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="#050040" strokeOpacity=".4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
