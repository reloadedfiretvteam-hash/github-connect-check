import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStorageUrl } from '@/lib/supabase';

const FALLBACK_CAROUSEL_IMAGE = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600';

export default function MediaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaItems = [
    // MOVIES
    { type: 'movie', title: 'Action Movies 2024', image: getStorageUrl('images', 'Playback-Tile-1024x512.webp'), year: '2024' },
    { type: 'movie', title: 'Thriller & Horror', image: getStorageUrl('images', 'Movies-categories_11zon-1024x512.webp'), year: '2024' },

    // TV SERIES
    { type: 'series', title: 'Top US Series', image: getStorageUrl('images', 'IPTVSmarters TV IMAG.jpg'), year: '2024' },
    { type: 'series', title: 'Trending Shows', image: getStorageUrl('images', 'iptv3.jpg'), year: '2024' },
    { type: 'series', title: 'Binge-Worthy Series', image: getStorageUrl('images', 'OIP (11) websit pic.jpg'), year: '2024' },

    // SPORTS
    { type: 'sport', title: 'NFL All Teams Live', image: getStorageUrl('images', 'c643f060-ea1b-462f-8509-ea17b005318aNFL.jpg'), logo: '🏈' },
    { type: 'sport', title: 'MLB All 30 Teams', image: getStorageUrl('images', 'BASEBALL.webp'), logo: '⚾' },
    { type: 'sport', title: 'NBA All Games', image: getStorageUrl('images', 'downloadBASKET BALL.jpg'), logo: '🏀' },
    { type: 'sport', title: 'UFC & Boxing PPV', image: getStorageUrl('images', 'UFC.jpg'), logo: '🥊' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(mediaItems.length - 4, 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(mediaItems.length - 4, 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(mediaItems.length - 4, 1)) % Math.max(mediaItems.length - 4, 1));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Everything</span>
          </h2>
          <p className="text-xl text-gray-300">
            New movies, trending series, and live sports - all in one place
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="overflow-hidden mx-12">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
            >
              {mediaItems.map((item, index) => (
                <div
                  key={`carousel-${index}-${item.title}`}
                  className="flex-shrink-0 w-1/6 min-w-[200px] group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                      loading="eager"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_CAROUSEL_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {item.logo && (
                        <div className="text-4xl mb-2 drop-shadow-lg">{item.logo}</div>
                      )}
                      <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg leading-tight">{item.title}</h3>
                      <p className="text-gray-300 text-sm capitalize">{item.type}</p>
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
