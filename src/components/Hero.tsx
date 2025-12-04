import { ShoppingCart, Play } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { getStorageUrl } from '@/lib/supabase';
import { HERO_FILENAME_CANDIDATES } from '@/utils/storage';

export default function Hero() {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const failedImagesRef = useRef(new Set<number>());
  const heroImageUrl = getStorageUrl('images', HERO_FILENAME_CANDIDATES[heroImageIndex]);

  const handleImageError = useCallback(() => {
    if (!failedImagesRef.current.has(heroImageIndex)) {
      failedImagesRef.current.add(heroImageIndex);

      if (heroImageIndex < HERO_FILENAME_CANDIDATES.length - 1) {
        setHeroImageIndex(heroImageIndex + 1);
      } else {
        setShowImage(false);
      }
    }
  }, [heroImageIndex]);

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden min-h-[600px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        {showImage && (
          <img
            src={heroImageUrl}
            alt="Best Jailbroken Fire Stick 2025 - Premium IPTV Streaming Device"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              objectPosition: 'center center',
              transform: 'scale(1.15)',
              transformOrigin: 'center center'
            }}
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-6 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-sm font-semibold text-orange-300 animate-pulse">
              🔥 #1 Premium IPTV Provider
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-slide-up leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-400">
              Stream Stick Pro
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-5xl text-white">Premium IPTV Subscriptions</span>
            <br />
            <span className="text-xl sm:text-2xl md:text-4xl text-blue-200">& Jailbroken Fire Stick Shop</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-8 animate-slide-up max-w-3xl mx-auto">
            18,000+ live channels • 60,000+ movies & shows • All sports & PPV events
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-slide-up">
            <button
              onClick={scrollToShop}
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-orange-500/50 inline-flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
              Shop Now
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">Save up to 50%</span>
            </button>
            <button
              onClick={scrollToVideo}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/20 hover:border-white/40 rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm md:text-base animate-slide-up">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
              <div className="text-orange-400 font-bold text-lg">2,700+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
              <div className="text-orange-400 font-bold text-lg">4.9/5 ⭐</div>
              <div className="text-blue-200">Customer Rating</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
              <div className="text-orange-400 font-bold text-lg">Same Day</div>
              <div className="text-blue-200">Shipping Available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
    </section>
  );
}
