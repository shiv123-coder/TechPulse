import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdminProductModal from '../components/AdminProductModal';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  DollarSign,
  Boxes,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
      showToast('Failed to fetch inventory from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (formData) => {
    if (productToEdit) {
      // Update
      const res = await api.put(`/products/${productToEdit._id}`, formData);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productToEdit._id ? res.data.data : p))
        );
        showToast('Product updated successfully', 'success');
      }
    } else {
      // Create
      const res = await api.post('/products', formData);
      if (res.data.success) {
        setProducts((prev) => [res.data.data, ...prev]);
        showToast('New product created successfully', 'success');
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted from inventory', 'info');
      try {
        await api.delete(`/products/${id}`);
      } catch (err) {
        console.error('Failed to delete product:', err);
        showToast('Failed to delete product on server', 'error');
        fetchProducts();
      }
    }
  };

  const openCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  // Metrics
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stockCount || 0), 0);
  const lowStockCount = products.filter((p) => (p.stockCount || 0) <= 5).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * (p.stockCount || 0), 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Storefront
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Admin Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add new catalog inventory, adjust pricing, modify descriptions, and monitor stock.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Product
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">{totalProducts}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Stock Units
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">{totalStockUnits}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Low Stock Alert
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700">{lowStockCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Inventory Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product inventory by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isOutOfStock = p.stockCount <= 0;
                    const isLowStock = p.stockCount > 0 && p.stockCount <= 5;

                    return (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-11 h-11 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                              <p className="text-xs text-slate-400 truncate">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-slate-600">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                          {p.stockCount} units
                        </td>
                        <td className="py-3 px-4">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default AdminDashboard;
