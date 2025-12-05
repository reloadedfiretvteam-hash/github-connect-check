import { Check, Flame, Star, Zap, ShoppingCart, Sparkles, CreditCard, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { getStorageUrl, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Supabase storage images
const firestickHdImg = getStorageUrl('images', 'firestick-hd.jpg');
const firestick4kImg = getStorageUrl('images', 'firestick-4k.jpg');
const firestick4kMaxImg = getStorageUrl('images', 'firestick-4k-max.jpg');
const iptvImg = getStorageUrl('images', 'iptv-subscription.jpg');

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

interface ShopProps {
  onAddToCart: (product: Product) => void;
}

const fallbackProducts: Product[] = [
  // Fire Stick Products ($140, $150, $160)
  {
    id: 'firestick-hd',
    name: 'Fire Stick HD - Jailbroken & Ready',
    price: 140.00,
    type: 'firestick',
    image: firestickHdImg,
    badge: 'STARTER',
    popular: false,
    features: [
      'Fire TV Stick HD Streaming',
      '1080p Full HD Resolution',
      '1 Year IPTV Subscription Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      'Pre-configured & Ready to Use',
      '24/7 Customer Support'
    ]
  },
  {
    id: 'firestick-4k',
    name: 'Fire Stick 4K - Jailbroken & Ready',
    price: 150.00,
    type: 'firestick',
    image: firestick4kImg,
    badge: 'BEST VALUE',
    popular: true,
    features: [
      'Fire TV Stick 4K Streaming',
      '4K Ultra HD Resolution',
      'Dolby Vision & HDR10+',
      '1 Year IPTV Subscription Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      'Pre-configured & Ready to Use',
      '24/7 Customer Support'
    ]
  },
  {
    id: 'firestick-4k-max',
    name: 'Fire Stick 4K Max - Jailbroken & Ready',
    price: 160.00,
    type: 'firestick',
    image: firestick4kMaxImg,
    badge: 'PREMIUM',
    popular: false,
    features: [
      'Fire TV Stick 4K Max - Fastest Model',
      '4K Ultra HD with Wi-Fi 6E',
      'Dolby Vision, Atmos & HDR10+',
      '1 Year IPTV Subscription Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      'Ambient Experience Support',
      'Pre-configured & Ready to Use',
      '24/7 Customer Support'
    ]
  },
  // IPTV Subscription Products ($15, $30, $50, $75)
  {
    id: 'iptv-1-month',
    name: '1 Month IPTV Subscription',
    price: 15.00,
    type: 'iptv',
    image: iptvImg,
    badge: 'TRIAL',
    popular: false,
    period: '/month',
    features: [
      '36-Hour Free Trial Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      '4K/HD Quality Streaming',
      'Works on All Devices',
      '24/7 Customer Support'
    ]
  },
  {
    id: 'iptv-3-month',
    name: '3 Month IPTV Subscription',
    price: 30.00,
    type: 'iptv',
    image: iptvImg,
    badge: 'POPULAR',
    popular: true,
    period: '/3 months',
    features: [
      '36-Hour Free Trial Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      '4K/HD Quality Streaming',
      'Works on All Devices',
      'Priority Customer Support'
    ]
  },
  {
    id: 'iptv-6-month',
    name: '6 Month IPTV Subscription',
    price: 50.00,
    type: 'iptv',
    image: iptvImg,
    badge: 'GREAT VALUE',
    popular: false,
    period: '/6 months',
    features: [
      '36-Hour Free Trial Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      '4K/HD Quality Streaming',
      'Works on All Devices',
      'VIP Customer Support'
    ]
  },
  {
    id: 'iptv-12-month',
    name: '1 Year IPTV Subscription',
    price: 75.00,
    type: 'iptv',
    image: iptvImg,
    badge: 'BEST VALUE',
    popular: false,
    period: '/year',
    features: [
      '36-Hour Free Trial Included',
      '18,000+ Live TV Channels',
      '60,000+ Movies & TV Shows',
      'All Sports & PPV Events',
      '4K/HD Quality Streaming',
      'Works on All Devices',
      'Premium VIP Support',
      'Free Setup Assistance'
    ]
  }
];

export default function Shop({ onAddToCart }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const firestickProducts = useMemo(() => products.filter(p => p.type === 'firestick'), [products]);
  const iptvProducts = useMemo(() => products.filter(p => p.type === 'iptv'), [products]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProducts(fallbackProducts);
    } catch (error) {
      console.warn('Error loading products, using fallback:', error);
      setProducts(fallbackProducts);
    }
    setLoading(false);
  };

  // Direct Stripe checkout - redirects to secure domain page
  const handleBuyNow = async (product: Product) => {
    setProcessingId(product.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId: product.id,
          productName: product.name,
          price: product.price.toString(),
          successUrl: `${window.location.origin}/secure-checkout?success=true`,
          cancelUrl: `${window.location.origin}/secure-checkout?canceled=true`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <section id="shop" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2 mb-6">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="text-sm font-medium">LOADING PRODUCTS</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-700"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2 mb-6">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="text-sm font-medium">SHOP ALL PRODUCTS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Premium Products</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Browse our complete collection of jailbroken Fire Sticks and IPTV subscriptions
          </p>
        </div>

        {/* Fire Sticks Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">
            <Flame className="inline w-8 h-8 text-orange-500 mr-2" />
            Choose Your Fire Stick
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {firestickProducts.map((product) => (
              <div
                key={product.id}
                className={`relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  product.popular ? 'ring-4 ring-orange-500 scale-105 shadow-2xl shadow-orange-500/50' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce">
                      <Star className="w-4 h-4 fill-current" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="relative h-56 overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {product.badge}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{product.name}</h3>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-orange-400">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm mt-2">
                      Includes 1 Year IPTV Subscription
                    </p>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={processingId === product.id}
                      className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                        product.popular
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                      } disabled:opacity-50`}
                    >
                      {processingId === product.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                      Buy Now
                    </button>
                  </div>

                  <div className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IPTV Subscriptions Section */}
        <div>
          <h3 className="text-3xl font-bold mb-8 text-center">
            <Zap className="inline w-8 h-8 text-blue-500 mr-2" />
            IPTV Subscriptions Only
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {iptvProducts.map((product) => (
              <div
                key={product.id}
                className={`relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  product.popular ? 'ring-4 ring-blue-500 scale-105 shadow-2xl shadow-blue-500/50' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    {product.badge}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{product.name}</h3>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-400">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 border border-white/30"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={processingId === product.id}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg disabled:opacity-50"
                    >
                      {processingId === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      Buy
                    </button>
                  </div>

                  <div className="space-y-2">
                    {product.features.slice(0, 6).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
