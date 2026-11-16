import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Server
} from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coldStartNotice, setColdStartNotice] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');

  const { showToast } = useToast();

  const fetchProducts = async () => {
    const timer = setTimeout(() => {
      setColdStartNotice(true);
    }, 2200);

    try {
      setLoading(true);
      const res = await api.get('/products');
      clearTimeout(timer);
      setColdStartNotice(false);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      clearTimeout(timer);
      setColdStartNotice(false);
      console.error('Error fetching catalog:', err);
      showToast('Failed to load catalog from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Client-side filtering & sorting for instant responsiveness
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return 0;
      });
  }, [products, search, selectedCategory, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setMaxPrice(1000);
    setSortBy('featured');
    showToast('Filters reset to default', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Free Tier Cold-Start Banner */}
        {coldStartNotice && (
          <div className="mb-6 p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-amber-900 text-xs font-medium">
              <div className="w-7 h-7 rounded-md bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Server className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold">Connecting to cloud backend</p>
                <p className="text-amber-800 text-[11px]">
                  Render free tier instances sleep after inactivity. Please allow 30–45s for the initial wake-up.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="rounded-xl bg-slate-900 p-6 sm:p-8 text-white mb-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              TechPulse Store
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
              Hardware and productivity equipment
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Curated gear with real-time inventory management, responsive search, and full-stack MERN checkout workflows.
            </p>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by brand, title, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                Max price:
              </span>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-28 sm:w-36 accent-slate-900 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-900 min-w-[45px]">
                ${maxPrice}
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="featured">Featured first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Customer rating</option>
                <option value="newest">Newest arrivals</option>
              </select>

              {(search || selectedCategory !== 'all' || maxPrice < 1000 || sortBy !== 'featured') && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md capitalize whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
            {products.length} products
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <div className="aspect-square bg-slate-100 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-4 bg-slate-200 rounded w-14 animate-pulse"></div>
                    <div className="h-7 bg-slate-200 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto my-6">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No matching products found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try modifying your search keywords or resetting price and category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
