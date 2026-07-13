import React, { useState, useEffect, useCallback, FC } from 'react';
import { 
    Search, MapPin, Globe, Map as MapIcon, ShieldCheck, X, ExternalLink, 
    Settings, Navigation, Info, ArrowRight, Star, Leaf, CheckCircle2, Lock,
    MessageSquare, Users, Mail
} from 'lucide-react';
import { Product, UserLocation, GroundingSource } from './types';
import { searchOrganicProducts, geocodeLocation } from './services/geminiService';
import { BobAssistant } from './components/BobAssistant';
import { OrganicCertifications } from './components/OrganicCertifications';
import { OrganicOrganizations } from './components/OrganicOrganizations';
import { OrganicCommunityGroups } from './components/OrganicCommunityGroups';
import { OrganicManifesto } from './components/OrganicManifesto';
import { OrganicBusinessPlan } from './components/OrganicBusinessPlan';
import { FeaturedOrganicInsight } from './components/FeaturedOrganicInsight';
import { Guide } from './components/Guide';

const Logo: FC<{ className?: string }> = ({ className }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <img src="https://i.postimg.cc/5N79zr9x/IMG-6083-Original.jpg" alt="Search for Organics Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    </div>
);

const SUGGESTED_TAGS = [
    "Organic Avocados", "Heirloom Tomatoes", "Wild Blueberries", "Organic Kale", "Honeycrisp Apples",
    "Microgreens", "Organic Garlic", "Seedless Grapes", "Organic Spinach", "Baby Carrots",
    "Raw Manuka Honey", "Extra Virgin Olive Oil", "Organic Quinoa", "Coconut Aminos", "Pink Himalayan Salt",
    "Organic Maple Syrup", "Chia Seeds", "Hemp Hearts", "Hemp Protein", "Hemp Foods", "Apple Cider Vinegar", "Organic Rolled Oats",
    "Grass-Fed Butter", "Raw Milk", "Oat Milk", "Almond Butter", "Organic Greek Yogurt",
    "Goat Cheese", "Cashew Milk", "A2 Milk", "Organic Eggs", "Coconut Yogurt",
    "Grass-Fed Beef", "Pasture-Raised Chicken", "Wild-Caught Salmon", "Organic Tempeh", "Sprouted Tofu",
    "Bison Meat", "Free-Range Turkey", "Organic Lentils", "Chickpeas", "Seitan",
    "Organic Matcha", "Cold Brew Coffee", "Kombucha", "Herbal Tea", "Coconut Water",
    "Tart Cherry Juice", "Organic Wine", "Yerba Mate", "Oat Latte", "Green Juice",
    "Organic Lavender Oil", "Natural Sunscreen", "Fluoride-Free Toothpaste", "Organic Shampoo", "Shea Butter",
    "Castor Oil", "Magnesium Oil", "Bamboo Toothbrush", "Organic Cotton Pads", "Mineral Makeup",
    "Organic Farm Box", "CSA Subscription", "Permaculture Design", "Organic Lawn Care", "Holistic Nutritionist",
    "Hemp Seed Oil", "Hemp Milk", "Hemp Fiber",
    "Organic Farming", "Regenerative Agriculture", "Sustainable Gardening", "Compostable", "Biodynamic", 
    "Eco-friendly", "Soil Health", "Carbon Sequestration", "Farm-to-Table", "Heirloom Seeds", "Organic Certification"
];

// --- UI Components ---
interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  locationActive: boolean;
  onOpenSettings: () => void;
  onOpenApiSettings: () => void;
  apiKeyActive: boolean;
  localSearchEnabled: boolean;
  onToggleLocalSearch: () => void;
  locationLabel?: string;
  locationStatus?: 'idle' | 'locating' | 'error' | 'success';
  locationErrorMsg?: string | null;
}

const SearchBar: FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  query, 
  setQuery, 
  locationActive, 
  onOpenSettings,
  onOpenApiSettings,
  apiKeyActive,
  locationLabel,
  locationStatus,
  locationErrorMsg,
  localSearchEnabled,
  onToggleLocalSearch
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <div className="flex flex-col items-center gap-3">
         <div className="flex flex-wrap justify-center items-center gap-3">
            <button 
                onClick={onOpenSettings}
                className={`group flex items-center px-6 py-3 rounded-2xl text-xs font-black transition-all border shadow-sm active:scale-95 ${locationActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-100 hover:border-organic-green hover:text-organic-green'}`}
                title="Location Settings"
            >
                <MapPin className="w-4 h-4 mr-2" />
                {!localSearchEnabled ? 'Local Search OFF' : (locationActive ? (locationLabel || 'Location Active') : 'Customize Location')}
            </button>

            <button 
                onClick={onOpenApiSettings}
                className={`group flex items-center px-6 py-3 rounded-2xl text-xs font-black transition-all border shadow-sm active:scale-95 ${apiKeyActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-100 hover:border-blue-600 hover:text-blue-600'}`}
                title="Gemini API Settings"
            >
                <Lock className="w-4 h-4 mr-2" />
                {apiKeyActive ? 'API Key Active' : 'Configure API Key'}
            </button>
         </div>

         {locationErrorMsg && !locationActive && (
             <div className="flex items-center gap-2 text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 animate-in slide-in-from-top-2 duration-300">
                <X className="w-3.5 h-3.5" />
                <span>{locationErrorMsg}</span>
                <button onClick={onOpenSettings} className="ml-2 px-2 py-0.5 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors underline font-black text-amber-900">Fix Settings</button>
             </div>
         )}
      </div>

      <form onSubmit={handleSubmit} role="search" className="relative">
        <label htmlFor="organic-search-input" className="sr-only">Search for organic products</label>
        <input
          id="organic-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locationActive ? "Organic honey, farms, milk near you..." : "Organic brands, products, groceries..."}
          className="w-full pl-7 pr-16 py-4.5 border-2 border-organic-green-light/40 focus:border-organic-green-dark focus:ring-4 focus:ring-organic-green/5 rounded-3xl shadow-xl transition-all duration-300 text-lg placeholder:text-gray-300 bg-white"
          disabled={isLoading}
          aria-busy={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Submit Search"
          className="absolute inset-y-1.5 right-1.5 flex items-center justify-center px-4 text-white bg-organic-green hover:bg-organic-green-dark rounded-2xl disabled:bg-gray-300 shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-wider gap-1.5"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Organic Search</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const ProductDetailModal: FC<{ product: Product, onClose: () => void }> = ({ product, onClose }) => {
    return (
        <div className="fixed inset-0 bg-organic-green-dark/60 backdrop-blur-lg flex items-center justify-center z-[110] p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto" onClick={onClose}>
            <div className="bg-cream rounded-[2.5rem] shadow-3xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col lg:flex-row max-h-[90vh]">
                    {/* Visual Side */}
                    <div className="lg:w-2/5 relative h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-gray-100">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                         {product.isOfficial && (
                                <div className="bg-organic-green text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" />
                                    OFFICIAL SOURCE
                                </div>
                            )}
                            {product.isLocal && (
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5 w-fit">
                                    <MapPin className="w-3.5 h-3.5" />
                                    LOCAL VENDOR
                                </div>
                            )}
                            {product.criticism && (
                                <div className="bg-amber-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5 w-fit">
                                    <Globe className="w-3.5 h-3.5" />
                                    AI-Generated critique based on search information
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Facts Side */}
                    <div className="lg:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-organic-green-dark leading-none tracking-tighter mb-2">{product.name}</h2>
                                {product.sourceUrl ? (
                                    <a 
                                        href={product.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-organic-green transition-colors flex items-center gap-1.5"
                                    >
                                        {product.vendor}
                                        <Globe className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{product.vendor}</p>
                                )}
                            </div>
                            <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-colors shadow-sm"><X className="w-6 h-6 text-gray-400" /></button>
                        </div>

                        {/* The Info Box / Fact Sheet */}
                        <div className="bg-white border-4 border-black p-6 md:p-8 space-y-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] mb-8">
                            <div className="border-b-8 border-black pb-4 mb-4 flex justify-between items-end">
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Organic Facts</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-right">Purity Audit: {product.purity}%</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-4">
                                    <div className="border-b border-black pb-2 flex justify-between font-black uppercase tracking-wider">
                                        <span>Certifications</span>
                                        <span>Verified</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {product.certifications.map((cert, i) => (
                                            <li key={i} className="flex items-center gap-2 font-bold text-gray-700">
                                                <ShieldCheck className="w-4 h-4 text-organic-green shrink-0" />
                                                {cert}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-b border-black pb-2 flex justify-between font-black uppercase tracking-wider">
                                        <span>Pricing Details</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-gray-500 uppercase text-[10px]">Current Price</span>
                                            <span className="font-black text-xl text-organic-green-dark">{product.price}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline border-t border-gray-100 pt-1">
                                            <span className="font-bold text-gray-500 uppercase text-[10px]">Logistics</span>
                                            <span className="font-black text-xs text-gray-800">{product.shippingPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expert Critique */}
                            {product.criticism && (
                                <div className="pt-8 border-t-4 border-black">
                                    <h4 className="font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-amber-700">
                                        <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                                        AI-Generated critique based on search information
                                    </h4>
                                    <div className="bg-amber-50/50 p-6 rounded-2xl border-2 border-amber-100 italic text-sm text-gray-700 leading-relaxed font-medium">
                                        "{product.criticism}"
                                        <div className="mt-4 flex items-center gap-2 not-italic">
                                            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-[10px] text-white font-black">AI</div>
                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">AI-Generated critique based on search information</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nutrition / Analysis */}
                            {product.nutrition && Object.keys(product.nutrition).length > 0 && (
                                <div className="pt-8 border-t-4 border-black">
                                    <h4 className="font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        Nutritional Analysis
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(product.nutrition).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</p>
                                                <p className="font-black text-gray-800">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-[10px] leading-relaxed font-bold text-gray-400 uppercase italic">
                                Information grounded via real-time search of official certification databases. Purity is calculated based on ingredient transparency and certification tier.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 flex flex-col md:flex-row gap-4">
                             {product.sourceUrl ? (
                                <a 
                                    href={product.sourceUrl} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-organic-green-dark text-white font-black text-center py-5 rounded-2xl hover:bg-black transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                >
                                    ORDER FROM VENDOR
                                    <ShieldCheck className="w-4 h-4" />
                                </a>
                             ) : (
                                <button 
                                    disabled
                                    className="flex-1 bg-gray-200 text-gray-400 font-black text-center py-5 rounded-2xl cursor-not-allowed uppercase tracking-widest text-xs"
                                >
                                    VENDOR LINK UNAVAILABLE
                                </button>
                             )}
                            <button 
                                onClick={onClose}
                                className="flex-1 bg-white text-gray-400 font-black border border-gray-200 py-5 rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                            >
                                CLOSE ANALYSIS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard: FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => (
    <article 
        onClick={onClick}
        className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full overflow-hidden group cursor-pointer active:scale-[0.98]"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" referrerPolicy="no-referrer" />
        
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-black text-organic-green shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-organic-green animate-pulse"></span>
            {product.purity}% PURE
        </div>

        {product.isOfficial && (
            <div className="absolute top-4 left-4 bg-organic-green text-white px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                OFFICIAL SOURCE
            </div>
        )}

        {product.isLocal && !product.isOfficial && (
            <div className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5 animate-in slide-in-from-left-2 duration-500">
                <MapPin className="w-3 h-3" />
                Hyper-Local
            </div>
        )}
        
        {product.criticism && (
            <div className="absolute bottom-4 right-4 bg-amber-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-1.5 animate-in slide-in-from-right-2 duration-500">
                <Globe className="w-3 h-3" />
                AI-Generated critique based on search information
            </div>
        )}
      </div>
      
      <div className="p-7 flex flex-col flex-grow">
        <div className="mb-3">
            <h3 className="text-xl font-black text-organic-green-dark line-clamp-1 group-hover:text-organic-green transition-colors leading-tight">{product.name}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] flex items-center gap-1.5 mt-1">
                {product.vendor}
                {product.isOfficial && <span className="text-organic-green font-black">● VERIFIED SOURCE</span>}
                {product.isLocal && !product.isOfficial && <span className="text-blue-500">● LOCAL</span>}
            </p>
        </div>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {product.certifications.slice(0, 3).map((cert, index) => (
            <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-xl bg-organic-green-light/10 text-[9px] font-black text-organic-green uppercase tracking-wider border border-organic-green/5">
              {cert}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-end">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-organic-green-dark">{product.price}</span>
                    {product.sourceUrl && (
                        <a 
                            href={product.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-gray-100 rounded-lg hover:bg-organic-green hover:text-white transition-colors text-gray-400 group/link"
                            title="View Source"
                        >
                            <Globe className="w-3.5 h-3.5 group-hover/link:animate-spin-once" />
                        </a>
                    )}
                </div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{product.shippingPrice}</p>
            </div>
            <button className="bg-organic-green group-hover:bg-organic-green-dark text-white text-xs font-black py-3 px-6 rounded-2xl transition-all shadow-lg">
                DETAILS
            </button>
        </div>
      </div>
    </article>
);

const LocationSettingsModal: FC<{ 
  onClose: () => void; 
  onSet: (lat: number, lng: number, label: string) => void;
  onRequestGPS: () => void;
  locationStatus: 'idle' | 'locating' | 'error' | 'success';
  locationActive: boolean;
  localSearchEnabled: boolean;
  onToggleLocalSearch: () => void;
  apiKey: string;
}> = ({ onClose, onSet, onRequestGPS, locationStatus, locationActive, localSearchEnabled, onToggleLocalSearch, apiKey }) => {
    const [inputValue, setInputValue] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeocode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isGeocoding) return;

        if (!apiKey) {
            setError("PLEASE CONFIGURE API KEY FIRST");
            return;
        }

        setIsGeocoding(true);
        setError(null);
        try {
            const result = await geocodeLocation(inputValue, apiKey);
            onSet(result.lat, result.lng, result.name);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to find location");
        } finally {
            setIsGeocoding(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-organic-green-dark/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-organic-green-dark">Location Settings</h2>
                        <p className="text-sm text-gray-400 font-bold mt-1">Configure how we find local organics</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                
                <div className="space-y-8">
                    {/* Toggle Local Search */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-black text-gray-700">Enable Local Search</span>
                        <button 
                            onClick={onToggleLocalSearch}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 ${localSearchEnabled ? 'bg-organic-green' : 'bg-gray-300'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${localSearchEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    {localSearchEnabled && (
                        <>
                            {/* GPS Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Automatic Detection</h3>
                                <button 
                                    onClick={onRequestGPS}
                                    disabled={locationStatus === 'locating'}
                                    className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-[1.5rem] border-2 transition-all font-black text-sm active:scale-95 ${locationActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 hover:border-organic-green text-gray-700'}`}
                                >
                                    <MapPin className={`w-5 h-5 ${locationStatus === 'locating' ? 'animate-bounce text-organic-green' : ''}`} />
                                    {locationStatus === 'locating' ? 'Locating...' : (locationActive ? 'GPS Location Active' : 'Use My Current GPS')}
                                </button>
                            </div>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            {/* Manual Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Manual Override</h3>
                                <form onSubmit={handleGeocode} className="space-y-4">
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Enter City, State or Region"
                                            className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-gray-100 focus:border-organic-green focus:ring-4 focus:ring-organic-green/5 transition-all text-sm font-black bg-gray-50/50 outline-none"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-xs font-black text-red-500 uppercase tracking-widest px-2">{error}</p>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={isGeocoding || !inputValue.trim()}
                                        className="w-full bg-white border-2 border-gray-100 text-gray-700 font-black py-5 rounded-[1.5rem] hover:border-organic-green hover:text-organic-green transition-all flex items-center justify-center gap-3 disabled:bg-gray-50 disabled:text-gray-300"
                                    >
                                        {isGeocoding ? (
                                            <div className="w-5 h-5 border-2 border-organic-green border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Globe className="w-5 h-5" />
                                                SET MANUAL LOCATION
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const RankOrganicallyBanner: FC = () => (
    <section className="container mx-auto px-6 mt-32 max-w-6xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-organic-green-dark to-black rounded-[3rem] md:rounded-[4rem] p-8 sm:p-12 md:p-20 shadow-2xl group border border-white/10">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-organic-green/20 blur-[120px] rounded-full -mr-48 -mt-48 group-hover:bg-organic-green/30 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-organic-green/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black text-organic-green-light uppercase tracking-[0.4em]">
                            #1 Affiliate Partner
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase break-words">
                            Rank <span className="text-organic-green italic">Organically</span>
                        </h2>
                    </div>
                    
                    <div className="space-y-6">
                        <p className="text-xl md:text-2xl font-black text-gray-300 leading-tight tracking-tight">
                            Dominate the Search Results with Premium SEO Services.
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "White-Hat Link Building",
                                "High-Quality Content",
                                "Managed SEO Campaigns",
                                "Local SEO Domination"
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-center text-xs font-black text-organic-green-light uppercase tracking-widest opacity-80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-organic-green mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4">
                        <a 
                            href="https://rankorganically.blogspot.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-10 py-5 rounded-3xl bg-organic-green text-white text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-organic-green-dark transition-all shadow-2xl hover:shadow-organic-green/40 active:scale-95 group/btn"
                        >
                            Get More Traffic Now
                            <Search className="w-5 h-5 ml-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>

                <div className="hidden lg:block relative">
                    <div className="bg-white/5 backdrop-blur-sm rounded-[3rem] p-10 border border-white/10 shadow-inner">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-organic-green uppercase tracking-widest">Organic Growth</p>
                                    <p className="text-2xl font-black text-white">+420% Traffic</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-organic-green/20 flex items-center justify-center">
                                    <Search className="w-6 h-6 text-organic-green" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                                    "Stop guessing and start ranking. We build managed SEO campaigns that deliver real, measurable results through high-authority link building and expert content strategy."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-organic-green to-emerald-500"></div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">SEO Experts</p>
                                        <p className="text-[9px] font-black text-organic-green uppercase tracking-widest">Rank Organically Team</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const RankOrganicallySalesLetter: FC = () => (
    <section className="container mx-auto px-6 py-32 max-w-4xl">
        <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl border border-organic-green/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-organic-green/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative space-y-12">
                <div className="text-center space-y-6">
                    <span className="text-[10px] font-black text-organic-green uppercase tracking-[0.5em]">A Message from Rank Organically</span>
                    <h2 className="text-4xl md:text-6xl font-black text-organic-green-dark tracking-tighter leading-tight uppercase">
                        Stop Guessing. <br/>
                        <span className="italic">Start Ranking.</span>
                    </h2>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
                    <p className="text-xl text-gray-800 font-black leading-snug">
                        Dear Business Owner,
                    </p>
                    
                    <p>
                        Are you tired of watching your competitors dominate the search results while your website sits on page 2, 3, or worse? You know you have a superior product or service, but if your customers can't find you, it doesn't matter.
                    </p>

                    <div className="bg-cream/50 p-8 rounded-3xl border-l-8 border-organic-green italic">
                        "SEO isn't about tricking Google. It's about convincing Google that you are the most authoritative, relevant answer to a user's question."
                    </div>

                    <p>
                        Most SEO agencies will promise you the world and deliver nothing but "technical audits" and "keyword research" that never actually moves the needle. They focus on vanity metrics while your revenue stays flat.
                    </p>

                    <p className="font-black text-organic-green-dark text-2xl tracking-tight">
                        We do things differently.
                    </p>

                    <p>
                        At <span className="font-black text-organic-green">Rank Organically</span>, we focus on the only two things that actually matter for ranking in 2026: <strong>High-Authority Backlinks</strong> and <strong>Expert Content Strategy</strong>.
                    </p>

                    <ul className="space-y-4 list-none pl-0">
                        {[
                            "Managed SEO Campaigns that run on autopilot.",
                            "Bespoke Link Building from real, high-traffic websites.",
                            "Content that doesn't just rank, but actually converts visitors into customers.",
                            "Transparent reporting that shows you exactly where your money is going."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="mt-1.5 w-5 h-5 rounded-full bg-organic-green flex items-center justify-center shrink-0">
                                    <Search className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-bold text-gray-800">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <p>
                        We don't take on every client. We only work with businesses we know we can help dominate their niche. If you're ready to stop guessing and start seeing real, organic growth, let's talk.
                    </p>

                    <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">To your success,</p>
                            <p className="text-3xl font-black text-organic-green-dark italic tracking-tighter">The Rank Organically Team</p>
                        </div>
                        
                        <a 
                            href="https://rankorganically.blogspot.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-12 py-6 rounded-3xl bg-organic-green text-white text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl hover:shadow-organic-green/40 active:scale-95 group/btn"
                        >
                            Start Your Campaign
                            <Search className="w-5 h-5 ml-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const AffiliateLogo: FC<{ affiliate: { name: string, domain: string } }> = ({ affiliate }) => {
    // Generative logic to create a unique logo for each affiliate based on their name
    const getHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const seed = getHash(affiliate.name);
    
    // Warm Organic Palettes from Recipe 6
    const palettes = [
        { bg: '#f5f5f0', ink: '#5A5A40', accent: '#8A9A5B' }, // Olive / Sage
        { bg: '#fdfcf0', ink: '#7B3F00', accent: '#C19A6B' }, // Earth / Clay
        { bg: '#f0f4f0', ink: '#2D4B2D', accent: '#4A5D23' }, // Forest / Moss
        { bg: '#fffaf0', ink: '#8B4513', accent: '#D2B48C' }, // Wood / Tan
        { bg: '#f0f4f8', ink: '#1A365D', accent: '#4A5568' }, // Slate / Navy
    ];
    
    const palette = palettes[seed % palettes.length];
    
    // Abstract Organic Shapes (Blobs)
    const blobs = [
        "M30,-30C40,-20,50,-10,50,0C50,10,40,20,30,30C20,40,10,50,0,50C-10,50,-20,40,-30,30C-40,20,-50,10,-50,0C-50,-10,-40,-20,-30,-30C-20,-40,-10,-50,0,-50C10,-50,20,-40,30,-30Z",
        "M35,-35C45,-25,55,-15,55,0C55,15,45,25,35,35C25,45,15,55,0,55C-15,55,-25,45,-35,35C-45,25,-55,15,-55,0C-55,-15,-45,-25,-35,-35C-25,-45,-15,-55,0,-55C15,-55,25,-45,35,-35Z",
        "M25,-40C35,-30,45,-20,45,0C45,20,35,30,25,40C15,50,5,60,0,60C-5,60,-15,50,-25,40C-35,30,-45,20,-45,0C-45,-20,-35,-30,-25,-40C-15,-50,-5,-60,0,-60C5,-60,15,-50,25,-40Z",
    ];
    
    const blob = blobs[seed % blobs.length];
    const rotation = (seed % 360);
    const initial = affiliate.name.charAt(0).toUpperCase();

    return (
        <div 
            className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl"
            style={{ backgroundColor: palette.bg }}
        >
            {/* Background Blob */}
            <svg viewBox="-60 -60 120 120" className="absolute w-[120%] h-[120%] opacity-20" style={{ transform: `rotate(${rotation}deg)` }}>
                <path d={blob} fill={palette.accent} />
            </svg>
            
            {/* Central Brand Mark */}
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-3xl font-black italic tracking-tighter" style={{ color: palette.ink }}>
                    {initial}
                </span>
                <div className="h-0.5 w-4 mt-0.5" style={{ backgroundColor: palette.accent }}></div>
            </div>
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
        </div>
    );
};

const ShopOurAffiliates: FC = () => {
    const affiliates = [
        { name: "American Hemp Oil", desc: "Sourcing sustainable, full-spectrum hemp products to promote well-being and natural health.", link: "https://wild.link/americanhempoil/ALzC-wI", domain: "americanhempoil.com" },
        { name: "Appalachian Organics", desc: "A leader in certified organic food products, Appalachian Organics delivers fresh, clean, and healthy goods from farm to table.", link: "https://wild.link/aporganics/AO7D-wI", domain: "aporganics.com" },
        { name: "Be Natural Organics", desc: "Offering a range of organic skincare solutions, Be Natural Organics uses plant-based ingredients to nourish the skin naturally.", link: "http://www.shareasale.com/r.cfm?B=627043&U=688687&M=54202&urllink=", domain: "benaturalorganics.com" },
        { name: "Beaumont Organic", desc: "Pioneering ethical fashion, Beaumont Organic creates stylish, sustainable clothing from eco-friendly and organic fabrics.", link: "http://beaumont-o.myshopify.com/?rfsn=791323.79b154", domain: "beaumontorganic.com" },
        { name: "Bella Vita Organics", desc: "Dedicated to providing high-quality organic lifestyle products, Bella Vita Organics promotes a holistic approach to wellness.", link: "https://wild.link/bellavitaorganic/AMu--wI", domain: "bellavitaorganic.com" },
        { name: "Binoid", desc: "Binoid offers a variety of vegan-friendly CBD and hemp-derived products, all tested for purity and potency.", link: "https://www.binoidcbd.com/?ref=7iNjXKWW", domain: "binoidcbd.com" },
        { name: "Braga Organic Farms", desc: "Braga Organic Farms cultivates certified organic produce with a focus on sustainable agricultural practices.", link: "https://shareasale.com/r.cfm?b=245074&u=688687&m=28490&urllink=&afftrack=", domain: "bragaorganicfarms.com" },
        { name: "Canada Grow Supplies", desc: "Canada Grow Supplies provides a wide range of organic and vegan-friendly gardening and growing products.", link: "https://wild.link/canadagrowsupplies/AOjC-wI", domain: "canadagrowsupplies.com" },
        { name: "CannaHemp", desc: "Focusing on hemp-based wellness, CannaHemp offers ethical and clean products for natural relief and balance.", link: "https://wild.link/cannahemp/AMfC-wI", domain: "cannahemp.com" },
        { name: "Doorstep Organics", desc: "Making certified organic groceries accessible, Doorstep Organics delivers fresh, seasonal produce and pantry staples directly to your home.", link: "https://wild.link/doorsteporganics/APnD-wI", domain: "doorsteporganics.com.au" },
        { name: "Dr Lily Ros Organics", desc: "Dr. Lily Ros Organics specializes in natural and organic personal care products.", link: "https://wild.link/drlilyros/APrD-wI", domain: "drlilyros.com" },
        { name: "Earth Elements Organics", desc: "Providing a curated selection of home and wellness goods, Earth Elements Organics focuses on products that are both beautiful and beneficial.", link: "https://wild.link/earthelementsorganics/APzD-wI", domain: "earthelementsorganics.com" },
        { name: "EcoFlow", desc: "EcoFlow is a leader in portable power solutions and renewable energy.", link: "https://www.shareasale.com/r.cfm?b=1537905&u=688687&m=97298", domain: "ecoflow.com" },
        { name: "Epic Water Filters", desc: "Epic Water Filters offers a sustainable alternative to single-use plastic bottles.", link: "https://wild.link/epicwaterfilters/AJjn-wI", domain: "epicwaterfilters.com" },
        { name: "Free The Ocean", desc: "Every click on their website helps fund the removal of plastic from the ocean.", link: "https://www.shareasale.com/r.cfm?b=1734893&u=688687&m=108076", domain: "freetheocean.com" },
        { name: "Gear Hugger", desc: "Gear Hugger creates biodegradable lubricants and cleaning products for a wide range of applications.", link: "https://www.shareasale.com/r.cfm?b=1916895&u=688687&m=119276", domain: "gearhugger.com" },
        { name: "Georganics", desc: "A leader in plastic-free oral care, Georganics offers a full range of zero-waste dental products.", link: "https://wild.link/georganics/AIPE-wI", domain: "georganics.com" },
        { name: "GoSUN Stove", desc: "GoSUN Stove revolutionizes cooking with solar-powered technology.", link: "https://shareasale.com/r.cfm?b=576342&u=688687&m=52143&urllink=&afftrack=", domain: "gosun.co" },
        { name: "Green Goddess Supplies", desc: "Green Goddess Supplies offers high-quality, organic, and ethically sourced goods for a natural lifestyle.", link: "https://www.shareasale.com/r.cfm?b=893212&u=688687&m=67002", domain: "greengoddesssupplies.com" },
    ];

    return (
        <section className="container mx-auto px-6 py-32 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
                <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-60">Curated Partnerships</span>
                <h2 className="text-5xl md:text-7xl font-black text-organic-green-dark tracking-tighter leading-none uppercase">Shop Our Affiliates</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-xl mx-auto leading-loose">
                    Our Trusted Partners: Innovating for a Sustainable Future. We believe in partnering with the best to bring you transparency and authenticity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {affiliates.map((affiliate, idx) => (
                    <a 
                        key={idx}
                        href={affiliate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-organic-green transition-all duration-500 flex flex-col h-full active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-3 group-hover:bg-white transition-colors duration-500 overflow-hidden border border-transparent group-hover:border-organic-green/10">
                                <AffiliateLogo affiliate={affiliate} />
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:bg-organic-green/10 group-hover:text-organic-green transition-colors">
                                Affiliate Partner
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-organic-green-dark mb-3 group-hover:text-organic-green transition-colors">{affiliate.name}</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 flex-grow">
                            {affiliate.desc}
                        </p>
                        <div className="flex items-center text-[9px] font-black text-organic-green uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Shop Now
                            <Search className="w-3.5 h-3.5 ml-2" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

const ApiKeyModal: FC<{
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}> = ({ onClose, onSave, currentKey }) => {
  const [value, setValue] = useState(currentKey);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-start justify-center z-[100] p-4 animate-in fade-in duration-300 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-blue-900">AI Access Settings</h2>
            <p className="text-sm text-gray-400 font-bold mt-1">Configure your Gemini API connection</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Your Gemini API Key</label>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-2">
              Don't have a key? Get one at <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">aistudio.google.com/api-keys</a>
            </p>
            <input 
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="PASTE YOUR API KEY HERE"
              className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-black bg-gray-50/50 outline-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
             <p className="text-[10px] font-black text-blue-800 uppercase leading-relaxed tracking-wider">
               🔑 Your key is only used to power searches in this session and is never stored on our servers.
             </p>
          </div>

          <button 
            onClick={() => onSave(value)}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <ShieldCheck className="w-5 h-5" />
            SAVE CONNECTION SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};

const App: FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'error' | 'success'>('idle');
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filter, setFilter] = useState({
    minPurity: 0,
    showOnlyLocal: false,
    showOnlyOfficial: false,
    sortByPrice: 'none' as 'none' | 'asc' | 'desc'
  });

  const parsePrice = (priceStr: string) => {
    const numeric = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(numeric) ? Infinity : numeric;
  };

  const filteredProducts = searchResults
    .filter(p => p.purity >= filter.minPurity)
    .filter(p => !filter.showOnlyLocal || p.isLocal)
    .filter(p => !filter.showOnlyOfficial || !!p.isOfficial)
    .sort((a, b) => {
        if (filter.sortByPrice === 'asc') return parsePrice(a.price) - parsePrice(b.price);
        if (filter.sortByPrice === 'desc') return parsePrice(b.price) - parsePrice(a.price);
        return 0;
    });
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [localSearchEnabled, setLocalSearchEnabled] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toggleLocalSearch = () => setLocalSearchEnabled(!localSearchEnabled);


  useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
        setLocationErrorMsg("GPS NOT SUPPORTED");
        setLocationStatus('error');
        return;
    }
    
    setLocationStatus('locating');
    setLocationErrorMsg(null);
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            setLocationLabel('NEARBY SEARCH ACTIVE');
            setLocationStatus('success');
            setLocationErrorMsg(null);
        },
        (err) => {
            console.warn("Location error:", err);
            let msg = "GPS ACCESS DENIED";
            if (err.code === 1) msg = "GPS BLOCKED IN SETTINGS";
            if (err.code === 2) msg = "SIGNAL LOST";
            if (err.code === 3) msg = "REQUEST TIMEOUT";
            
            setLocationErrorMsg(msg);
            setLocationStatus('error');
            setUserLocation(null);
        },
        options
    );
  }, []);

  useEffect(() => {
    // Attempt to get location automatically on load
    requestLocation();

    // Monitor for permission changes if supported
    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
            const handlePermissionChange = () => {
                if (result.state === 'granted') {
                    requestLocation();
                } else if (result.state === 'denied') {
                    setLocationStatus('error');
                    setLocationErrorMsg("GPS ACCESS BLOCKED");
                }
            };
            result.addEventListener('change', handlePermissionChange);
        });
    }
  }, [requestLocation]);

  const handleManualLocationSet = async (lat: number, lng: number, label: string) => {
      setUserLocation({ latitude: lat, longitude: lng });
      setLocationLabel(label.toUpperCase());
      setShowManualLocation(false);
      setLocationStatus('success');
      setLocationErrorMsg(null);
  };

  const handleGPSRequest = () => {
      requestLocation();
  };

  // Close modal on success
  useEffect(() => {
      if (locationStatus === 'success' && showManualLocation) {
          setShowManualLocation(false);
      }
  }, [locationStatus, showManualLocation]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    if (!geminiApiKey) {
      setShowApiModal(true);
      return;
    }

    setIsLoading(true);
    setGlobalError(null);
    setInitialSearchDone(true);
    setSearchQuery(query);
    try {
      const response = await searchOrganicProducts(query, localSearchEnabled ? userLocation : null, geminiApiKey);
      setSearchResults(response.products);
      setGroundingSources(response.sources);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "SEARCH FAILED");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, localSearchEnabled, geminiApiKey]);

  return (
    <div className="min-h-screen bg-cream text-gray-800 font-sans selection:bg-organic-green/20 pb-24">
      <main className="container mx-auto px-6 py-8 md:py-12 max-w-6xl">
        <header className="text-center mb-6 md:mb-8 space-y-3 md:space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <div className="absolute -inset-6 bg-organic-green/5 rounded-full blur-2xl group-hover:bg-organic-green/10 transition-all duration-700"></div>
                <Logo className="w-28 h-28 md:w-36 md:h-36 relative z-10" />
              </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-organic-green-dark tracking-tighter leading-none">Search For Organics</h1>
          <p className="text-xs md:text-base text-organic-green font-black max-w-2xl mx-auto uppercase tracking-widest opacity-80">Certified Organic Search Engine</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/50 border border-organic-green/10 text-[9px] font-black text-organic-green uppercase tracking-widest shadow-sm">
              Powered by Google
            </span>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a 
                href="https://discord.gg/sQgy7kktS2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 hover:border-indigo-200 text-[9px] font-bold uppercase tracking-wider text-indigo-600 transition-all shadow-sm hover:shadow active:scale-95"
                title="Join our Discord Server"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Discord</span>
              </a>
              <a 
                href="https://groups.google.com/g/search-for-organics" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 text-[9px] font-bold uppercase tracking-wider text-emerald-700 transition-all shadow-sm hover:shadow active:scale-95"
                title="Subscribe to Google Group mailing list"
              >
                <Mail className="w-3 h-3" />
                <span>Google Group</span>
              </a>
              <a 
                href="https://www.facebook.com/share/g/19n1cCpKhp/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50/60 hover:bg-sky-50 border border-sky-100 hover:border-sky-200 text-[9px] font-bold uppercase tracking-wider text-sky-600 transition-all shadow-sm hover:shadow active:scale-95"
                title="Join our Facebook Group"
              >
                <Users className="w-3 h-3" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.linkedin.com/groups/13054615" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/60 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 text-[9px] font-bold uppercase tracking-wider text-blue-700 transition-all shadow-sm hover:shadow active:scale-95"
                title="Join our LinkedIn Professional Guild"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/MLSpyShop/Search-For-Organics" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50/60 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-[9px] font-bold uppercase tracking-wider text-slate-700 transition-all shadow-sm hover:shadow active:scale-95"
                title="View on GitHub"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.819-.26.819-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.292-1.552 3.299-1.23 3.299-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.901-.014 3.293 0 .32.217.694.825.576C20.565 21.795 24 17.297 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </header>
        
        <div className="mb-8 md:mb-12">
            <SearchBar 
                query={searchQuery} 
                setQuery={setSearchQuery} 
                onSearch={handleSearch} 
                isLoading={isLoading} 
                locationActive={localSearchEnabled && !!userLocation}
                onOpenSettings={() => setShowManualLocation(true)}
                onOpenApiSettings={() => setShowApiModal(true)}
                apiKeyActive={!!geminiApiKey}
                localSearchEnabled={localSearchEnabled}
                onToggleLocalSearch={toggleLocalSearch}
                locationLabel={locationLabel}
                locationStatus={locationStatus}
                locationErrorMsg={locationErrorMsg}
            />
        </div>
        <FeaturedOrganicInsight />

        <section aria-live="polite">
            {globalError && (
                <div className="text-center mb-12">
                    <div className="inline-flex items-center text-red-800 bg-red-50 border border-red-200 px-8 py-4 rounded-3xl text-sm font-black shadow-sm uppercase tracking-widest">
                        <X className="w-4 h-4 mr-2" />
                        {globalError}
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-96 space-y-8 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="w-24 h-24 border-[8px] border-organic-green-light/20 border-t-organic-green rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-4 h-4 bg-organic-green rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <p className="text-2xl font-black text-organic-green-dark uppercase tracking-tighter italic">Grounding Local Data...</p>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">Verifying Certifications & Official Blog</p>
                    </div>
                </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-organic-green/10 rounded-2xl">
                            <Search className="w-6 h-6 text-organic-green" />
                        </div>
                        <h2 className="text-3xl font-black text-organic-green-dark tracking-tighter uppercase">Verified Matches ({filteredProducts.length})</h2>
                    </div>
                    <div className="flex items-center gap-3">
                         {userLocation ? (
                             <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100 flex items-center gap-2 uppercase tracking-widest shadow-sm">
                                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                 Hyper-Local Grounding Enabled
                             </div>
                         ) : (
                             <button onClick={() => setShowManualLocation(true)} className="text-[10px] font-black text-gray-400 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 hover:bg-white hover:border-organic-green hover:text-organic-green transition-all uppercase tracking-widest flex items-center gap-2">
                                 <Globe className="w-3 h-3" />
                                 Set Local Area
                             </button>
                         )}
                    </div>
                </div>
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-3xl">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Filters:</label>
                    <select className="bg-white px-4 py-2 rounded-xl text-xs font-bold border border-gray-200" onChange={(e) => setFilter({...filter, minPurity: Number(e.target.value)})}>
                        <option value="0">Purity: Any</option>
                        <option value="90">Purity: &gt;90%</option>
                        <option value="95">Purity: &gt;95%</option>
                    </select>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <input type="checkbox" checked={filter.showOnlyLocal} onChange={(e) => setFilter({...filter, showOnlyLocal: e.target.checked})} />
                        Local Only
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <input type="checkbox" checked={filter.showOnlyOfficial} onChange={(e) => setFilter({...filter, showOnlyOfficial: e.target.checked})} />
                        Official Only
                    </label>
                    <select className="bg-white px-4 py-2 rounded-xl text-xs font-bold border border-gray-200" onChange={(e) => setFilter({...filter, sortByPrice: e.target.value as any})}>
                        <option value="none">Sort by Price: Default</option>
                        <option value="asc">Sort by Price: Low to High</option>
                        <option value="desc">Sort by Price: High to Low</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => setSelectedProduct(product)}
                      />
                    ))}
                </div>

                {groundingSources.length > 0 && (
                    <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-organic-green/5 border border-organic-green-light/10 p-12 mt-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-organic-green-dark flex items-center tracking-tighter uppercase">
                                    <MapIcon className="w-8 h-8 mr-3 text-organic-green" />
                                    Transparency Index
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Verification sources powered by Google Search & Maps</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {groundingSources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center p-5 bg-cream/30 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-organic-green/10 group"
                                >
                                    <div className={`p-4 rounded-2xl mr-5 shrink-0 transition-all duration-300 ${source.uri.includes('blogspot.com') ? 'bg-organic-green text-white' : source.type === 'maps' ? 'bg-blue-100 group-hover:bg-blue-500 group-hover:text-white' : 'bg-green-100 group-hover:bg-green-500 group-hover:text-white'}`}>
                                        {source.uri.includes('blogspot.com') ? <ShieldCheck className="w-5 h-5" /> : source.type === 'maps' ? <MapPin className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-gray-800 truncate leading-tight mb-1 group-hover:text-organic-green-dark transition-colors">{source.title}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{new URL(source.uri).hostname}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            ) : initialSearchDone ? (
                <div className="text-center py-32 space-y-6 animate-in fade-in duration-700">
                    <div className="text-8xl mb-6">🍃</div>
                    <h3 className="text-3xl font-black text-organic-green-dark tracking-tighter uppercase">No Direct Matches</h3>
                    <p className="text-gray-400 max-w-md mx-auto font-bold uppercase tracking-widest text-xs leading-loose">We couldn't find certified organic matches in this category for your area. Try searching for broader terms like "Produce" or "Honey".</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mt-24 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-organic-green-dark tracking-tighter uppercase leading-none">Start Exploring</h2>
                        <p className="text-organic-green font-bold uppercase tracking-[0.2em] text-sm opacity-60">Verified certified items near your position</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {SUGGESTED_TAGS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSearch(prompt)}
                            className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 hover:border-organic-green hover:shadow-lg transition-all text-[9px] font-black text-gray-500 active:scale-95 text-center uppercase tracking-widest group"
                        >
                            <span className="group-hover:text-organic-green-dark transition-colors">{prompt}</span>
                        </button>
                        ))}
                    </div>
                </div>
            )}
        </section>
      </main>

      {showManualLocation && (
          <LocationSettingsModal 
            onClose={() => setShowManualLocation(false)} 
            onSet={handleManualLocationSet} 
            onRequestGPS={handleGPSRequest}
            locationStatus={locationStatus}
            locationActive={localSearchEnabled && !!userLocation}
            localSearchEnabled={localSearchEnabled}
            onToggleLocalSearch={toggleLocalSearch}
            apiKey={geminiApiKey}
          />
      )}

      {showApiModal && (
          <ApiKeyModal 
            onClose={() => setShowApiModal(false)}
            onSave={(key) => {
              setGeminiApiKey(key);
              setShowApiModal(false);
            }}
            currentKey={geminiApiKey}
          />
      )}

      {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
      )}

      <BobAssistant 
        apiKey={geminiApiKey} 
        onOpenApiSettings={() => setShowApiModal(true)} 
      />

      <section className="container mx-auto px-6 py-32 max-w-4xl border-t border-organic-green/5 mt-24">
        <div className="space-y-12 text-center md:text-left">
          <div className="space-y-4">
            <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-60">A Message from Search For Organics</span>
            <h2 className="text-5xl md:text-7xl font-black text-organic-green-dark tracking-tighter leading-none">The Truth About What You Put In Your Body.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg leading-relaxed text-gray-600 font-medium">
            <div className="space-y-6">
              <p>
                In a world of "natural" labels and clever marketing, the word <span className="text-organic-green-dark font-black italic">Organic</span> has been diluted. Big corporations spend millions to make you believe their products are pure, while hiding behind vague terminology and self-regulated standards.
              </p>
              <p>
                But your health isn't a marketing budget. It's the foundation of your life. You deserve to know exactly where your food comes from, how it was grown, and whether it truly meets the rigorous standards of <span className="text-organic-green-dark font-black">USDA</span>, <span className="text-organic-green-dark font-black">EU Organic</span>, or <span className="text-organic-green-dark font-black">GOTS</span> certification.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                That's why we built <span className="text-organic-green-dark font-black">Search For Organics</span>. We don't just search the web; we filter for truth. Our engine is grounded in official certification data, prioritizing purity, locality, and transparency above all else.
              </p>
              <p>
                Stop guessing. Start knowing. Join a global community of conscious consumers who refuse to settle for anything less than absolute purity. Your body is a temple—don't let marketing speak be the architect.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center px-8 py-4 rounded-full bg-organic-green-dark text-white text-sm font-black uppercase tracking-widest hover:bg-organic-green transition-all shadow-xl hover:shadow-organic-green/20 active:scale-95"
                >
                  start your local certified organic search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RankOrganicallyBanner />
      <Guide />

      <RankOrganicallySalesLetter />

      <ShopOurAffiliates />

      <OrganicCertifications />

      <OrganicOrganizations />

      <OrganicCommunityGroups />

      <OrganicManifesto />

      <footer className="mt-48 bg-organic-green-dark text-white py-24">
          <div className="container mx-auto px-8 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-20 text-center md:text-left">
              <div className="space-y-8">
                  <h4 className="text-4xl font-black tracking-tighter leading-none">Search For<br/>Organics</h4>
                  <p className="text-organic-green-light text-xs font-bold uppercase tracking-widest leading-relaxed opacity-60">
                    A third party app released by <a href="https://marielandryspyshop.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">marielandryspyshop.com</a>, a division of <a href="https://landryindustries.ca" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">landryindustries.ca</a>.
                    Official website: <a href="https://SearchForOrganics.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">SearchForOrganics.com</a>.
                    GitHub: <a href="https://github.com/MLSpyShop/Search-For-Organics" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Search-For-Organics</a>.
                    <br/><br/>
                    #1 Affiliate: <a href="https://rankorganically.blogspot.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Rank Organically</a> (Organic SEO Provider).
                  </p>
              </div>
              <div className="space-y-8">
                  <h4 className="text-xl font-black tracking-tight uppercase">Privacy</h4>
                  <p className="text-[10px] text-organic-green-light leading-loose font-bold uppercase tracking-widest opacity-60">Local discovery requires temporary GPS data. We do not store, track, or share your coordinates beyond the active search session.</p>
              </div>
              <div className="space-y-8">
                  <h4 className="text-xl font-black tracking-tight uppercase">Standards</h4>
                  <p className="text-[10px] text-organic-green-light leading-loose font-bold uppercase tracking-widest opacity-60">Prioritizing USDA, EU Organic, and GOTS standards. All results grounded via Google Gemini with verified Search and Maps datasets.</p>
                  <OrganicBusinessPlan />
              </div>
          </div>
          <div className="container mx-auto px-8 max-w-6xl mt-24 pt-12 border-t border-white/5 text-center text-[10px] text-organic-green-light font-black uppercase tracking-[0.3em] opacity-40">
              © {new Date().getFullYear()} SEARCH FOR ORGANICS. RELEASED BY MARIELANDRYSPYSHOP.COM.
              <div className="mt-4 text-white opacity-60">Available to Earth’s 10 Billion Inhabitants.</div>
          </div>
      </footer>
    </div>
  );
};

export default App;