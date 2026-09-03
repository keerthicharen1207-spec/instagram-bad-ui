import React, { useState } from 'react';
import { ShopProduct, CartItem } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  Star,
  X,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface ShopViewProps {
  products: ShopProduct[];
  cart: CartItem[];
  onAddToCart: (product: ShopProduct, quantity: number) => void;
  onUpdateCartItemQty: (productId: string, qty: number) => void;
  onClearCart: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartItemQty,
  onClearCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const categories = ['All', 'Fashion', 'Home', 'Tech', 'Wellness', 'Design'];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutComplete(false);
      setIsBagOpen(false);
    }, 2200);
  };

  return (
    <div className="max-w-lg mx-auto pb-20 select-none">
      {/* 1. SHOP TOP BAR */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg text-white">Shop</h1>
        <button
          type="button"
          onClick={() => setIsBagOpen(true)}
          className="relative p-2 text-white hover:text-neutral-300 cursor-pointer"
          aria-label="Shopping Bag"
        >
          <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. SEARCH & CATEGORIES */}
      <div className="p-3 space-y-2.5">
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops, products, brands..."
            className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRODUCT CATALOG GRID */}
      <div className="grid grid-cols-2 gap-2 p-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer group hover:border-neutral-700 transition-colors flex flex-col"
          >
            {/* Product Image */}
            <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-red-500 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${product.isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  {product.brand}
                </span>
                <h3 className="text-xs font-semibold text-white line-clamp-1">{product.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-neutral-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-3.5 border-b border-neutral-900">
              <span className="text-xs font-semibold text-neutral-400">{selectedProduct.brand}</span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-black border border-neutral-800">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold text-white">${selectedProduct.price}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-neutral-500">({selectedProduct.reviewsCount})</span>
                  </div>
                </div>
                <h2 className="text-sm font-semibold text-white">{selectedProduct.title}</h2>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>In stock • Authentic boutique guarantee & free 30-day returns</span>
              </div>
            </div>

            <div className="p-3 border-t border-neutral-900 bg-black flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                  setIsBagOpen(true);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SHOPPING BAG DRAWER */}
      {isBagOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-white" />
                <h2 className="font-bold text-sm text-white">Shopping Bag ({totalCartCount})</h2>
              </div>
              <button
                onClick={() => setIsBagOpen(false)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-white">Order Confirmed!</h3>
                <p className="text-xs text-neutral-400">
                  Thank you for shopping on Instagram. You will receive an email confirmation and tracking details shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-neutral-500 text-xs">
                      Your shopping bag is empty.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 bg-neutral-900/60 border border-neutral-800 p-3 rounded-xl"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-16 h-16 rounded-lg object-cover bg-neutral-950"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs font-semibold text-white line-clamp-1">
                              {item.product.title}
                            </h4>
                            <span className="text-xs font-bold text-white">
                              ${item.product.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateCartItemQty(item.product.id, Math.max(0, item.quantity - 1))
                              }
                              className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-white">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateCartItemQty(item.product.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 border-t border-neutral-900 bg-neutral-950 space-y-3">
                    <div className="space-y-1.5 text-xs text-neutral-400">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-white font-semibold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Shipping</span>
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-neutral-900">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <span>Checkout with Instagram Pay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
