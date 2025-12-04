import { ShoppingCart, Play, Sparkles, Zap } from 'lucide-react';
import { getStorageUrl } from '@/lib/supabase';

const heroBg = getStorageUrl('images', 'hero-bg.jpg');

export default function Hero() {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden min-h-[700px] flex items-center pt-20">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBg}
          alt="Premium IPTV Streaming - Best Fire Stick 2025"
          className="w-full h-full object-cover object-center scale-110"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-900/60" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-slide-up">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-sm font-semibold text-orange-300 animate-pulse-glow">
              <Sparkles className="w-4 h-4" />
              #1 Premium IPTV Provider 2025
              <Zap className="w-4 h-4" />
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 animate-slide-up leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 animate-gradient">
              Stream Stick Pro
            </span>
          </h1>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 animate-slide-up animation-delay-200">
            Premium IPTV Subscriptions
          </h2>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl text-blue-200/90 mb-8 animate-slide-up animation-delay-400">
            & Jailbroken Fire Stick Shop
          </h3>

          {/* Feature highlights */}
          <p className="text-lg sm:text-xl md:text-2xl text-orange-100 mb-10 animate-slide-up animation-delay-600 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              18,000+ live channels
            </span>
            <span className="mx-3 text-white/30">•</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              60,000+ movies & shows
            </span>
            <span className="mx-3 text-white/30">•</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              All sports & PPV
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-slide-up animation-delay-600">
            <button
              onClick={scrollToShop}
              className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 inline-flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
              Shop Now
              <span className="bg-white/20 rounded-full px-4 py-1 text-sm font-semibold">Save 50%</span>
            </button>
            <button
              onClick={scrollToVideo}
              className="px-10 py-5 bg-white/5 backdrop-blur-md hover:bg-white/10 border-2 border-white/20 hover:border-cyan-400/50 rounded-2xl font-bold text-lg transition-all inline-flex items-center justify-center gap-3 group"
            >
              <Play className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              See What You Get
            </button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up animation-delay-600">
            <div className="glass rounded-2xl px-6 py-4 hover:border-orange-500/30 transition-colors">
              <div className="text-orange-400 font-bold text-2xl">2,700+</div>
              <div className="text-blue-200 text-sm">Happy Customers</div>
            </div>
            <div className="glass rounded-2xl px-6 py-4 hover:border-cyan-500/30 transition-colors">
              <div className="text-cyan-400 font-bold text-2xl">4.9/5 ⭐</div>
              <div className="text-blue-200 text-sm">Customer Rating</div>
            </div>
            <div className="glass rounded-2xl px-6 py-4 hover:border-green-500/30 transition-colors">
              <div className="text-green-400 font-bold text-2xl">Same Day</div>
              <div className="text-blue-200 text-sm">Shipping Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </section>
  );
}
