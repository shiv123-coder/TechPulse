import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Image as ImageIcon } from 'lucide-react';

const categories = ['Audio', 'Wearables', 'Accessories', 'Computers', 'Photography', 'Gaming'];

const AdminProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Audio',
    imageUrl: '',
    stockCount: '10',
    featured: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price ? String(productToEdit.price) : '',
        category: productToEdit.category || 'Audio',
        imageUrl: productToEdit.imageUrl || '',
        stockCount: productToEdit.stockCount !== undefined ? String(productToEdit.stockCount) : '10',
        featured: Boolean(productToEdit.featured)
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Audio',
        imageUrl: '',
        stockCount: '10',
        featured: false
      });
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.imageUrl.trim()) {
      setError('Name, price, and image URL are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        ...formData,
        price: parseFloat(formData.price),
        stockCount: parseInt(formData.stockCount, 10) || 0
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            {productToEdit ? 'Edit product' : 'Add product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Product title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony WH-1000XM5"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="299.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Stock count
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="10"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Image URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {formData.imageUrl && (
            <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-10 h-10 rounded object-cover bg-white"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-xs text-slate-500">Image preview</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              placeholder="Write detailed specifications and features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-3.5 h-3.5 accent-slate-900 rounded cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs text-slate-700 cursor-pointer">
              Mark as featured product
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : productToEdit ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;

