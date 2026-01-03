import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  LandingPage,
  HomePage,
  InventoryPage,
  ProductDetailsPage,
  CategoriesPage,
  CategoryProductsPage,
} from './pages';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page - No sidebar/header */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes - With sidebar/header */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/dashboard/inventory" element={<InventoryPage />} />
          <Route path="/dashboard/product/:id" element={<ProductDetailsPage />} />
          <Route path="/dashboard/categories" element={<CategoriesPage />} />
          <Route path="/dashboard/categories/:slug" element={<CategoryProductsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
