import { useState } from 'react';
import { toast } from 'sonner';
import Hero from '@/components/Hero';
import WhatYouGetVideo from '@/components/WhatYouGetVideo';
import Shop from '@/components/Shop';
import MediaCarousel from '@/components/MediaCarousel';
import BuyNowCTA from '@/components/BuyNowCTA';
import Footer from '@/components/Footer';

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
  const [cart, setCart] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    toast.success(`${product.name} added to cart!`, {
      description: `$${product.price.toFixed(2)}`,
      action: {
        label: 'View Cart',
        onClick: () => {
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-900">
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
