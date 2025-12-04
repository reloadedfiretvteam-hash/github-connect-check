import { ShoppingCart, Zap, Shield, Clock } from 'lucide-react';

export default function BuyNowCTA() {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiLz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Cut the Cord?
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-8">
            Join 2,700+ happy customers streaming their favorite content
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Zap className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Instant Access</h3>
              <p className="text-orange-100 text-sm">Start streaming immediately after purchase</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Money-Back Guarantee</h3>
              <p className="text-orange-100 text-sm">100% satisfaction or your money back</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Clock className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-orange-100 text-sm">Always here to help you</p>
            </div>
          </div>

          <button
            onClick={scrollToShop}
            className="group px-12 py-5 bg-white text-orange-600 hover:bg-orange-50 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            <ShoppingCart className="w-7 h-7 group-hover:animate-bounce" />
            Shop Now & Save
          </button>

          <p className="text-orange-200 mt-6 text-sm">
            🔥 Limited time offer - Prices may increase soon!
          </p>
        </div>
      </div>
    </section>
  );
}
