import React from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const inCart = cartItems.find((item) => item.product._id === product._id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800';
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold text-slate-800 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50/95 border border-rose-200 rounded-lg">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50/95 border border-amber-200 rounded-lg">
            Only {product.stockCount} left
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="font-bold text-slate-700">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
            <span className="text-slate-400">({product.numReviews || 24})</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : inCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added ({inCart.qty})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
