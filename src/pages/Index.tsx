import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Hero from '@/components/Hero';
import WhatYouGetVideo from '@/components/WhatYouGetVideo';
import Shop from '@/components/Shop';
import MediaCarousel from '@/components/MediaCarousel';
import BuyNowCTA from '@/components/BuyNowCTA';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ShoppingCart, { CartItem } from '@/components/ShoppingCart';

interface Product {
  id: string;
  name: string;
  price: number;
  type: 'firestick' | 'iptv';
  image: string;
  badge: string;
  popular: boolean;
  period?: string;
  features: string[];
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        type: product.type,
        image: product.image,
        quantity: 1
      }];
    });
    
    toast.success(`${product.name} added to cart!`, {
      description: `$${product.price.toFixed(2)}`,
      action: {
        label: 'View Cart',
        onClick: () => setIsCartOpen(true)
      }
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    toast.info('Cart cleared');
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Navbar */}
      <Navbar 
        cartItemCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      {/* Shopping Cart Drawer */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
      
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Single Video Section (What You Get) */}
      <WhatYouGetVideo />
      
      {/* 3. Featured Products (Shop) */}
      <Shop onAddToCart={handleAddToCart} />
      
      {/* 4. Sports Carousel */}
      <MediaCarousel />
      
      {/* 5. Buy Now CTA */}
      <BuyNowCTA />
      
      {/* 6. Footer */}
      <Footer />
    </main>
  );
};

export default Index;
