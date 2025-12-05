import carouselUfc from '@/assets/carousel-ufc.jpg';
import carouselSoccer from '@/assets/carousel-soccer.jpg';
import carouselBasketball from '@/assets/carousel-basketball.jpg';
import carouselNfl from '@/assets/carousel-nfl.jpg';
import carouselBaseball from '@/assets/carousel-baseball.webp';

const mediaItems = [
  { title: 'UFC & Boxing PPV', image: carouselUfc, logo: '🥊' },
  { title: 'Soccer Worldwide', image: carouselSoccer, logo: '⚽' },
  { title: 'NBA All Games', image: carouselBasketball, logo: '🏀' },
  { title: 'NFL All Teams Live', image: carouselNfl, logo: '🏈' },
  { title: 'MLB All 30 Teams', image: carouselBaseball, logo: '⚾' },
];

export default function MediaCarousel() {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...mediaItems, ...mediaItems];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Everything</span>
          </h2>
          <p className="text-xl text-gray-300">
            Live sports - all in one place
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 animate-scroll-left"
              style={{
                width: 'max-content',
              }}
            >
              {duplicatedItems.map((item, index) => (
                <div
                  key={`carousel-${index}-${item.title}`}
                  className="flex-shrink-0 w-72 group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-3xl mb-2 drop-shadow-lg">{item.logo}</div>
                      <h3 className="text-white font-bold text-lg drop-shadow-lg leading-tight">{item.title}</h3>
                    </div>

                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      LIVE
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">18,000+</div>
              <div className="text-gray-300">Live Channels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">60,000+</div>
              <div className="text-gray-300">Movies & Shows</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">16,000+</div>
              <div className="text-gray-300">TV Series</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">ALL</div>
              <div className="text-gray-300">Sports & PPV</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
