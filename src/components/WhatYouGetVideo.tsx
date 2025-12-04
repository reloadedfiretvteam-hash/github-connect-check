import { useState } from 'react';
import { Play, Check, X } from 'lucide-react';

interface WhatYouGetVideoProps {
  videoUrl?: string;
}

const DEFAULT_VIDEO_URL = 'https://emlqlmfzqsnqokrqvmcm.supabase.co/storage/v1/object/public/imiges/iptv-preview-video.mp4';

export default function WhatYouGetVideo({ videoUrl }: WhatYouGetVideoProps) {
  const [showModal, setShowModal] = useState(false);
  const videoSource = videoUrl || DEFAULT_VIDEO_URL;

  const benefits = [
    '18,000+ Live TV Channels',
    '60,000+ Movies & TV Shows',
    'All Sports Leagues (NFL, NBA, MLB, NHL)',
    'Pay-Per-View Events (UFC, Boxing)',
    '4K Ultra HD Streaming Quality',
    'Works on All Your Devices',
    'No Buffering or Lag',
    'Lifetime Software Updates',
    '24/7 Customer Support',
    'Money-Back Guarantee'
  ];

  return (
    <section id="video-section" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Get</span>
            </h2>
            <p className="text-xl text-blue-200">
              Everything you need for unlimited entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video Preview */}
            <div className="relative">
              <div
                className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-orange-400/50 shadow-2xl shadow-orange-500/20 overflow-hidden cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="absolute inset-0 flex items-center justify-center hover:scale-105 transition-transform">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/50">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-white font-semibold text-lg">Watch Demo Video</p>
                    <p className="text-blue-200 text-sm">See it in action</p>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')]"></div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-orange-400 font-semibold text-sm">
                  🔥 Over 2,700+ Happy Customers
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-orange-400/50 transition-all"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="#shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50"
            >
              <Play className="w-5 h-5" />
              See Products Below
            </a>
            <p className="text-blue-200 text-sm mt-3">
              Scroll down to explore our Fire Stick packages
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={videoSource}
                controls
                autoPlay
                className="w-full h-full"
                onError={() => {
                  console.error('Video failed to load from:', videoSource);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
