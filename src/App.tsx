import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { LightningCanvas } from './components/LightningCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { WishlistModal } from './components/WishlistModal';
import { BrandStory } from './components/BrandStory';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // State
  const [products] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('atomic_prime_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('atomic_prime_wishlist');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('atomic_prime_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('atomic_prime_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL',
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize: size,
            selectedColor: product.colors[0]?.name || 'Black',
            quantity,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === id && item.selectedSize === size))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  // Navigation smooth scroll
  const handleScrollToCatalog = (category?: string) => {
    if (category) {
      setActiveCategory(category as ProductCategory);
    }
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToStory = () => {
    const el = document.getElementById('filosofia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setIsSizeGuideOpen(false);
        setIsWishlistOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#f1f5f9] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 60fps Lightweight Procedural Lightning Engine */}
      <LightningCanvas />

      {/* Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onScrollToCatalog={handleScrollToCatalog}
        onScrollToStory={handleScrollToStory}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => handleScrollToCatalog('all')}
          onSelectCategory={(cat) => handleScrollToCatalog(cat)}
        />

        {/* Catalog Section with Category, Collection & Fit Filters */}
        <CatalogSection
          products={products}
          wishlistIds={wishlist}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onQuickView={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Brand Story & Heavyweight Specifications */}
        <BrandStory />
      </main>

      {/* Mobile Fixed Bottom Nav (Thumb Zone for 9:16 vertical smartphone screen) */}
      <MobileBottomNav
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onScrollToTop={handleScrollToTop}
        onScrollToCatalog={() => handleScrollToCatalog()}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreProducts={() => handleScrollToCatalog('all')}
      />

      {/* Checkout Simulator Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={handleClearCart}
      />

      {/* Bodybuilding Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        wishlistProducts={wishlistedProducts}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}

