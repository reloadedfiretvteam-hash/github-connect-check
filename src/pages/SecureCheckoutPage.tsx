import { useState } from 'react';
import { Shield, Lock, CreditCard, DollarSign, Package, CheckCircle, AlertCircle, ExternalLink, ArrowRight, Info } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export default function SecureCheckoutPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cashapp' | ''>('');
  const [step, setStep] = useState<'select' | 'checkout' | 'success'>('select');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });

  // Website design tools products (cloaked)
  const products: Product[] = [
    // Add-ons ($15, $30, $50, $75)
    {
      id: 'addon-stock-photos',
      name: 'Premium Stock Photo & Graphics Pack',
      description: '500+ royalty-free images, icons, and graphics hand-picked for your website. Includes social media banners, blog headers, and promotional graphics optimized for web use.',
      price: '15.00',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      category: 'Design Assets'
    },
    {
      id: 'addon-logo-branding',
      name: 'Custom Logo & Branding Kit',
      description: 'Professional logo design with 3 concepts, favicon set, business card template, and brand style guide. Includes all file formats (PNG, SVG, PDF) for print and web.',
      price: '30.00',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      category: 'Branding'
    },
    {
      id: 'addon-social-media',
      name: 'Social Media Marketing Bundle',
      description: 'Complete social media presence package: 50 post templates, story templates, cover photos for all platforms, and scheduling calendar. Includes Canva-editable files for ongoing use.',
      price: '50.00',
      image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop',
      category: 'Marketing'
    },
    {
      id: 'addon-maintenance',
      name: 'Website Maintenance & Support Plan - Annual',
      description: 'Year-round website care: monthly backups, security monitoring, plugin updates, performance reports, and 2 hours of content updates per month. Priority email support included.',
      price: '75.00',
      image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
      category: 'Support'
    },
    // Web Development Services ($140, $150, $160)
    {
      id: 'webdev-basic',
      name: 'Professional Website Page Design & Development',
      description: 'Complete website page design and development service. Our team creates a custom, responsive web page tailored to your business needs. Includes modern design, mobile optimization, SEO-friendly structure, and professional implementation.',
      price: '140.00',
      image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
      category: 'Web Development'
    },
    {
      id: 'webdev-seo',
      name: 'Website Page Design + 1 Month SEO Optimization',
      description: 'Complete website page design with 1 month of ongoing SEO optimization. Includes custom page design, mobile optimization, on-page SEO implementation, keyword research, meta tag optimization, and performance monitoring.',
      price: '150.00',
      image_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=300&fit=crop',
      category: 'Web Development'
    },
    {
      id: 'webdev-premium',
      name: 'Website Page Design + 6 Months SEO Strategy',
      description: 'Premium website page design with 6 months of comprehensive SEO strategy and optimization. Includes custom page design, advanced SEO implementation, ongoing keyword research, content optimization, performance tracking, monthly SEO reports, and strategy adjustments.',
      price: '160.00',
      image_url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=300&fit=crop',
      category: 'Web Development'
    }
  ];

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToProducts() {
    setStep('select');
    setSelectedProduct(null);
    setPaymentMethod('');
  }

  function handleOrderComplete() {
    setStep('success');
  }

  const totalAmount = selectedProduct ? parseFloat(selectedProduct.price) : 0;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your secure transaction has been completed.</p>
          {selectedProduct && (
            <div className="p-4 bg-gray-50 rounded-lg text-left mb-6">
              <p className="text-sm text-gray-500 mb-1">Service</p>
              <p className="font-medium text-gray-900">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500 mt-2">Amount</p>
              <p className="font-bold text-lg text-gray-900">${selectedProduct.price}</p>
            </div>
          )}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> You will receive a confirmation email with your order details and service access information.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-800">Secure Checkout</span>
                  <p className="text-xs text-slate-500">Professional Services</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Lock className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Choose Your Service
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select a professional service below. All payments are processed securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-200 overflow-hidden transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-slate-600 mb-4 min-h-[60px] text-sm">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-slate-800">
                        ${product.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Select & Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Payment</h3>
                <p className="text-slate-600 text-sm">
                  All transactions processed through secure payment gateways
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Data Protection</h3>
                <p className="text-slate-600 text-sm">
                  Your information is encrypted and never shared
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Expert Support</h3>
                <p className="text-slate-600 text-sm">
                  Professional assistance every step of the way
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Checkout Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToProducts}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Products</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary & Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              {selectedProduct && (
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    {selectedProduct.image_url && (
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{selectedProduct.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{selectedProduct.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-lg font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${selectedProduct.price}</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    This transaction will appear as <strong>"PRO DIGITAL SERVICES"</strong> on your statement.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-green-600" />
                Select Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Credit Card Payment */}
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-6 border-2 rounded-xl transition-all text-left ${
                    paymentMethod === 'stripe'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'stripe' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-slate-800">Credit/Debit Card</span>
                  </div>
                  <p className="text-sm text-slate-600">Secure payment via Stripe (Apple Pay, Google Pay, Klarna)</p>
                </button>

                {/* Cash App Payment */}
                <button
                  onClick={() => setPaymentMethod('cashapp')}
                  className={`p-6 border-2 rounded-xl transition-all text-left ${
                    paymentMethod === 'cashapp'
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className={`w-6 h-6 ${paymentMethod === 'cashapp' ? 'text-green-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-slate-800">Cash App</span>
                  </div>
                  <p className="text-sm text-slate-600">Send payment via Cash App</p>
                </button>
              </div>

              {/* Stripe Payment Info */}
              {paymentMethod === 'stripe' && (
                <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">Credit/Debit Card Payment</h3>
                      <p className="text-sm text-gray-600">Secure checkout with Stripe</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Click below to proceed to our secure Stripe checkout. We accept all major credit cards, Apple Pay, Google Pay, and Klarna.
                  </p>
                  <button
                    onClick={() => {
                      // In production, this would redirect to Stripe checkout
                      alert('Stripe checkout would open here. Integration pending.');
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Pay ${totalAmount.toFixed(2)} with Card
                  </button>
                </div>
              )}

              {/* Cash App Payment */}
              {paymentMethod === 'cashapp' && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">Cash App Payment</h3>
                      <p className="text-sm text-gray-600">Send payment directly via Cash App</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Send payment to:
                    </label>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <span className="font-mono text-lg font-bold text-green-600">$starevan11</span>
                      <button
                        onClick={() => navigator.clipboard.writeText('$starevan11')}
                        className="ml-auto px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount to Send:
                    </label>
                    <div className="text-3xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Important:</strong> After sending payment, please email your receipt to{' '}
                        <a href="mailto:reloadedfiretvteam@gmail.com" className="underline font-semibold">
                          reloadedfiretvteam@gmail.com
                        </a>{' '}
                        with your order details.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderComplete}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all"
                  >
                    I Have Sent Payment
                  </button>
                </div>
              )}

              {paymentMethod === '' && (
                <div className="text-center py-8 text-slate-500">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Please select a payment method above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
