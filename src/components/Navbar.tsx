import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Flame, Tv, Zap, Phone, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartItemCount, onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">Stream</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Stick</span>
              <span className="text-xl font-bold text-white"> Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavButton onClick={() => scrollToSection('shop')} icon={<Tv className="w-4 h-4" />}>
              Fire Sticks
            </NavButton>
            <NavButton onClick={() => scrollToSection('shop')} icon={<Zap className="w-4 h-4" />}>
              IPTV Plans
            </NavButton>
            <NavButton onClick={() => scrollToSection('video-section')} icon={<Flame className="w-4 h-4" />}>
              Features
            </NavButton>
            <NavButton onClick={() => scrollToSection('footer')} icon={<Phone className="w-4 h-4" />}>
              Contact
            </NavButton>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Auth Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all text-sm"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 flex items-center justify-center transition-all group"
            >
              <ShoppingCart className="w-5 h-5 text-white group-hover:text-orange-400 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center animate-pulse">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              <MobileNavButton onClick={() => scrollToSection('shop')} icon={<Tv className="w-5 h-5" />}>
                Fire Sticks
              </MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('shop')} icon={<Zap className="w-5 h-5" />}>
                IPTV Plans
              </MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('video-section')} icon={<Flame className="w-5 h-5" />}>
                Features
              </MobileNavButton>
              <MobileNavButton onClick={() => scrollToSection('footer')} icon={<Phone className="w-5 h-5" />}>
                Contact
              </MobileNavButton>
              
              {/* Mobile Auth Button */}
              {user ? (
                <MobileNavButton onClick={handleLogout} icon={<LogOut className="w-5 h-5" />}>
                  Sign Out
                </MobileNavButton>
              ) : (
                <MobileNavButton onClick={() => { setIsMobileMenuOpen(false); navigate('/auth'); }} icon={<User className="w-5 h-5" />}>
                  Sign In
                </MobileNavButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavButton({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
    >
      {icon}
      {children}
    </button>
  );
}

function MobileNavButton({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3"
    >
      {icon}
      {children}
    </button>
  );
}
