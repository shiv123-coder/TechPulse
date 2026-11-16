import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  } = useCart();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-900" />
              <h2 className="text-sm font-semibold text-slate-900">
                Cart ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {checkoutSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Order placed successfully</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Your order has been recorded in the demo session.
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Your cart is empty</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Browse the catalog to add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Explore products
                </button>
              </div>
            ) : (
              cartItems.map(({ product, qty }) => (
                <div
                  key={product._id}
                  className="flex gap-3 p-3 rounded-lg border border-slate-200 bg-white"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product._id, qty - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-slate-800">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, qty + 1)}
                          disabled={qty >= product.stockCount}
                          className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total & remove */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-semibold text-slate-900">
                          ${(product.price * qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && !checkoutSuccess && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-600">Free</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-slate-900 text-sm">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

