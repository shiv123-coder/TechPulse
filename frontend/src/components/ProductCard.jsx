import React from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const inCart = cartItems.find((item) => item.product._id === product._id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800';
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-medium text-slate-700 bg-white/95 rounded shadow-xs">
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded">
            Only {product.stockCount} left
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-slate-800 text-[11px]">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
            <span className="text-slate-400 text-[11px]">({product.numReviews || 24})</span>
          </div>

          <h3 className="font-medium text-slate-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Price</span>
            <span className="text-base font-semibold text-slate-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : inCart
                ? 'bg-slate-800 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2]" />
                <span>In cart ({inCart.qty})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

