import React, { useState, FC } from 'react';
import { 
  Globe, ExternalLink, Award, CheckCircle, Leaf, Shield, HelpCircle, ArrowRight, Layers, FileText
} from 'lucide-react';

interface Certification {
  name: string;
  acronym: string;
  region: string;
  category: 'North America' | 'Europe' | 'Asia-Pacific' | 'Global / Multi-Region';
  url: string;
  logoColor: string;
  logoLetter: string;
  description: string;
  focus: string[];
  rigorRating: number; // out of 5
  ifoamStatus: string; // e.g. "Equivalent", "Member", "Approved"
}

export const OrganicCertifications: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'North America', 'Europe', 'Asia-Pacific', 'Global / Multi-Region'];

  const certifications: Certification[] = [
    {
      name: "USDA National Organic Program",
      acronym: "USDA Organic",
      region: "United States",
      category: "North America",
      url: "https://www.ams.usda.gov/nop",
      logoColor: "from-emerald-800 to-green-700",
      logoLetter: "U",
      description: "Administered by the Agricultural Marketing Service of the USDA. It ensures that agricultural products are produced without prohibited methods (such as genetic engineering, ionizing radiation, or sewage sludge) and using allowed substances.",
      focus: ["No Synthetic Fertilizers", "Non-GMO Verified", "No Synthetic Pesticides", "Strict Soil Standards"],
      rigorRating: 4,
      ifoamStatus: "IFOAM Accreditated"
    },
    {
      name: "European Union Organic Certification",
      acronym: "EU Organic",
      region: "European Union",
      category: "Europe",
      url: "https://agriculture.ec.europa.eu/farming/organic-farming_en",
      logoColor: "from-green-600 to-emerald-500",
      logoLetter: "E",
      description: "Governed by strict EU-wide legislation. The famous 'organic leaf' logo represents compliance with rigorous guidelines on animal welfare, biodiversity preservation, and restriction of chemicals.",
      focus: ["Crop Rotation", "High Animal Welfare", "Limited Synthetic Additives", "No Synthetic Inputs"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Family Member"
    },
    {
      name: "Japan Agricultural Standards Organic",
      acronym: "JAS Organic",
      region: "Japan",
      category: "Asia-Pacific",
      url: "https://www.maff.go.jp/e/jas/jas_organic.html",
      logoColor: "from-teal-800 to-emerald-700",
      logoLetter: "J",
      description: "Administered by Japan's Ministry of Agriculture, Forestry and Fisheries (MAFF). It certifies that agricultural and processed products satisfy the organic criteria, applying to soil management and handling systems.",
      focus: ["Natural Fertilizers Only", "Strict 2-Year Transition", "Chemical-Free Buffers", "Non-GMO Compliance"],
      rigorRating: 4,
      ifoamStatus: "IFOAM Endorsed"
    },
    {
      name: "Canada Organic Regime",
      acronym: "COR",
      region: "Canada",
      category: "North America",
      url: "https://inspection.canada.ca/en/food-labels/organic-products",
      logoColor: "from-emerald-700 to-teal-600",
      logoLetter: "C",
      description: "Regulated by the Canadian Food Inspection Agency (CFIA). COR covers products grown, harvested, or processed in Canada. It has strong equivalency agreements with the US and EU.",
      focus: ["Ecological Balance", "No Genetic Engineering", "No Synthetic Hormones", "Mandatory Record Keeping"],
      rigorRating: 4,
      ifoamStatus: "IFOAM Equivalent"
    },
    {
      name: "Soil Association",
      acronym: "Soil Assoc.",
      region: "United Kingdom",
      category: "Europe",
      url: "https://www.soilassociation.org/",
      logoColor: "from-green-800 to-green-600",
      logoLetter: "S",
      description: "The UK's largest organic certifier, setting standards that are often higher than basic EU regulations. They certify organic food, textiles, farming, and beauty products with a heavy focus on soil health.",
      focus: [" Soil Microbiome Focus", "Zero Animal Cruelty", "No Artificial Colorings", "Wildlife Protection Areas"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Accredited Member"
    },
    {
      name: "Bio Suisse",
      acronym: "Bio Suisse",
      region: "Switzerland",
      category: "Europe",
      url: "https://www.bio-suisse.ch/en.html",
      logoColor: "from-emerald-900 to-green-800",
      logoLetter: "B",
      description: "Represented by the 'Bud' label. It is one of the most demanding organic standards in the world. It mandates that 100% of the farm must be organic, not just selected crops, and implements high social guidelines.",
      focus: ["100% Whole-Farm Organic", "Strict Water Conservation", "Eco-Compensation Areas", "Fair Labor Standards"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Family Approved"
    },
    {
      name: "Ecocert Organic Standard",
      acronym: "Ecocert",
      region: "Global (France)",
      category: "Global / Multi-Region",
      url: "https://www.ecocert.com/",
      logoColor: "from-teal-700 to-green-600",
      logoLetter: "E",
      description: "Founded in France, Ecocert is an international inspection and certification body certifying organic agriculture, cosmetics, textiles, and fair trade practices across more than 80 countries.",
      focus: ["Eco-friendly Processing", "Global Supply Traceability", "Natural Cosmetics Quality", "Fair Trade Sourcing"],
      rigorRating: 4,
      ifoamStatus: "IFOAM Accredited Body"
    },
    {
      name: "Biodynamic Federation Demeter International",
      acronym: "Demeter",
      region: "Global",
      category: "Global / Multi-Region",
      url: "https://www.demeter.net/",
      logoColor: "from-amber-900 to-amber-700",
      logoLetter: "D",
      description: "The global brand for biodynamic agricultural products. It requires full organic compliance first, then adds biodynamic measures that treat the farm as a cohesive, self-healing, living organism.",
      focus: ["Biodynamic Preparations", "Astronomical Sowing Cycle", "On-Farm Seed Autonomy", "Holistic Biodiversity"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Equivalent+"
    },
    {
      name: "National Programme for Organic Production",
      acronym: "NPOP India",
      region: "India",
      category: "Asia-Pacific",
      url: "https://www.apeda.gov.in/apedawebsite/organic/index.htm",
      logoColor: "from-emerald-800 to-teal-800",
      logoLetter: "I",
      description: "Overseen by the Ministry of Commerce and Industry. NPOP standards for production and accreditation system have been recognized by European Commission and USDA as equivalent.",
      focus: ["Sustainable Soil Biology", "Indigenous Crop Rotation", "Prohibited Synthetic inputs", "Natural Pest Management"],
      rigorRating: 4,
      ifoamStatus: "IFOAM Equivalent"
    },
    {
      name: "NASAA Certified Organic",
      acronym: "NASAA",
      region: "Australia & Asia",
      category: "Asia-Pacific",
      url: "https://www.nasaaorganic.org.au/",
      logoColor: "from-teal-900 to-emerald-800",
      logoLetter: "N",
      description: "Australia's pioneer organic certifier. NASAA is fully accredited by IFOAM and operates globally to verify high ecological integrity of organic food systems and processing facilities.",
      focus: ["Water Catchment Health", "No synthetic chemicals", "Sustainable Overgrazing Limits", "Transparent Supply Chain"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Accredited"
    },
    {
      name: "Global Organic Textile Standard",
      acronym: "GOTS",
      region: "Global",
      category: "Global / Multi-Region",
      url: "https://global-standard.org/",
      logoColor: "from-green-700 to-teal-700",
      logoLetter: "G",
      description: "The gold standard for organic fibers and textiles worldwide. It mandates that at least 70% of fibers must be organic, and enforces strict chemical restrictions along with rigid social and labor standards.",
      focus: ["Organic Fiber Purity", "Toxic-Free Dyeing Systems", "Fair Wage & Safe Conditions", "Waste-Water Treatment"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Aligned"
    },
    {
      name: "Naturland Association",
      acronym: "Naturland",
      region: "Germany & Global",
      category: "Europe",
      url: "https://www.naturland.de/en/",
      logoColor: "from-emerald-800 to-teal-700",
      logoLetter: "NL",
      description: "Naturland is a major international association for organic agriculture. It combines strict ecological standards with strong social responsibility requirements for workers, exceeding minimum EU rules.",
      focus: ["Eco-Social Certification", "Organic Agro-Forestry", "Sustainable Organic Aquaculture", "Strict Social Audits"],
      rigorRating: 5,
      ifoamStatus: "IFOAM Family Approved"
    }
  ];

  const filteredCertifications = certifications.filter(cert => {
    const matchesCategory = activeCategory === 'All' || cert.category === activeCategory;
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="container mx-auto px-6 py-32 max-w-6xl border-t border-organic-green/5 mt-24">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-60">
          Global Purity Alliances
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-organic-green-dark tracking-tighter leading-none uppercase">
          Worldwide Organic Certifications
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto leading-loose">
          Recognized or accredited under the family of standards governed by <strong className="text-organic-green-dark">IFOAM - Organics International</strong>. 
          We cross-check products against these rigorous regulatory bodies to protect you from greenwashing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Region Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-organic-green-dark text-white shadow-md'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Standard, Region, or Focus..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-organic-green text-[11px] font-black bg-cream/10 uppercase tracking-widest"
          />
          <span className="absolute right-3.5 top-3 text-gray-400">
            <Globe className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Grid of Certifications */}
      {filteredCertifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-organic-green transition-all duration-500 flex flex-col h-full active:scale-[0.98]"
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between mb-6">
                {/* Emblem Logo */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.logoColor} text-white flex items-center justify-center font-black text-xl shadow-lg border border-white/15 shrink-0`}>
                  {cert.logoLetter}
                </div>
                {/* Badges */}
                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-organic-green/10 text-organic-green-dark text-[8px] font-black uppercase tracking-wider">
                    {cert.region}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-2.5 h-2.5 shrink-0" />
                    {cert.ifoamStatus}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  {cert.name}
                </span>
                <h3 className="text-xl font-black text-organic-green-dark group-hover:text-organic-green transition-colors leading-tight">
                  {cert.acronym}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 flex-grow">
                {cert.description}
              </p>

              {/* Focus List */}
              <div className="space-y-2 mb-6 pt-4 border-t border-gray-50">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                  Core Exclusions & Targets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.focus.map((focusItem, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-[9px] font-bold text-gray-600 border border-gray-100 group-hover:bg-green-50/25 group-hover:border-organic-green/10 transition-colors"
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-organic-green shrink-0" />
                      {focusItem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rigor Score */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Standard Rigor Rating
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Leaf
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < cert.rigorRating ? 'text-organic-green fill-organic-green' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Link to Official URL */}
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-50 text-[10px] font-black text-organic-green-dark group-hover:text-organic-green uppercase tracking-widest transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  View Official Standards Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-organic-green group-hover:translate-x-1.5 transition-all" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white border border-gray-100 rounded-[2.5rem] p-16 max-w-md mx-auto space-y-4">
          <div className="text-4xl">🔍</div>
          <h4 className="text-lg font-black text-organic-green-dark uppercase tracking-tight">No Certifications Match</h4>
          <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
            We couldn't find any certifications matching your search. Try resetting the filters or typing a different keyword.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-organic-green-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md hover:bg-organic-green active:scale-95 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Info Notice card */}
      <div className="mt-12 bg-white border border-organic-green/5 rounded-[2.5rem] p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-organic-green shrink-0">
          <Shield className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-xs font-black text-organic-green-dark uppercase tracking-widest">
            Why is IFOAM Recognition Crucial?
          </h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            IFOAM - Organics International acts as the global voice for the organic movement. The <strong>IFOAM Family of Standards</strong> contains all organic standards officially recognized as equivalent or compliant. This ensures international trade compatibility, prevents deceptive labeling practices (greenwashing), and guarantees that any product claiming to be organic has complied with absolute, planet-restoring eco-social standards.
          </p>
        </div>
      </div>
    </section>
  );
};
