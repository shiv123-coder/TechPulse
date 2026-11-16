import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  Shield,
  User,
  LogOut,
  LogIn,
  Store
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-base tracking-tight text-slate-900">
                TechPulse
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 rounded">
                Store
              </span>
            </div>
          </Link>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors inline-flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Catalog</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin panel</span>
              </Link>
            )}

            {/* Shopping Cart Button with counter badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User auth state */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-700 max-w-[100px] truncate text-xs">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

