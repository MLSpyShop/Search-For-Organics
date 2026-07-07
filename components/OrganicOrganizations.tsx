import React, { useState, FC } from 'react';
import { 
  Building2, Users, Globe, Search, ArrowRight, ExternalLink, Sprout, Compass, ShieldAlert, HeartHandshake, HelpCircle
} from 'lucide-react';

interface Organization {
  name: string;
  acronym: string;
  type: 'Trade & Business' | 'Consumer Advocacy' | 'Research & Education' | 'Global Umbrella';
  region: string;
  scope: 'Global' | 'North America' | 'Europe' | 'Asia-Pacific' | 'Africa / Latin America';
  url: string;
  description: string;
  impactTheme: string;
  memberCount?: string;
  founded: number;
  tags: string[];
}

export const OrganicOrganizations: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tabs = ['All', 'Global Umbrella', 'Trade & Business', 'Consumer Advocacy', 'Research & Education'];

  const organizations: Organization[] = [
    {
      name: "IFOAM - Organics International",
      acronym: "IFOAM",
      type: "Global Umbrella",
      region: "Global (Headquartered in Germany)",
      scope: "Global",
      url: "https://www.ifoam.bio",
      description: "The ultimate global umbrella organization for the organic agriculture movement. IFOAM advocates for organic principles at international policy levels, maintains the Organic Guarantee System, and unites over 800 affiliates in 120 countries.",
      impactTheme: "Global Organic Policy & Standards Harmonization",
      memberCount: "800+ Affiliates",
      founded: 1972,
      tags: ["Advocacy", "Standardization", "Worldwide Network"]
    },
    {
      name: "Organic Trade Association",
      acronym: "OTA",
      type: "Trade & Business",
      region: "North America (United States & Canada)",
      scope: "North America",
      url: "https://www.ota.com",
      description: "The business association for the organic industry in North America. OTA's mission is to promote and protect organic trade, representing growers, shippers, processors, certifiers, importers, and retailers to foster business growth.",
      impactTheme: "Market Advocacy, Farm Policy & Supply Chain Development",
      memberCount: "9,500+ Businesses",
      founded: 1985,
      tags: ["Market Growth", "Lobbying", "Farmer Support"]
    },
    {
      name: "Organic Consumers Association",
      acronym: "OCA",
      type: "Consumer Advocacy",
      region: "Global & United States",
      scope: "North America",
      url: "https://www.organicconsumers.org",
      description: "A grassroots public interest organization campaigning for health, justice, and ecological sustainability. OCA educates consumers on organic purity, fights greenwashing, and advocates for strict food safety guidelines.",
      impactTheme: "Grassroots Campaigns, Anti-Greenwashing & Consumers Rights",
      memberCount: "2 Million+ Supporters",
      founded: 1998,
      tags: ["Grassroots Advocacy", "Anti-GMO", "Food Safety"]
    },
    {
      name: "Research Institute of Organic Agriculture",
      acronym: "FiBL",
      type: "Research & Education",
      region: "Europe (Switzerland, Germany, Austria, France)",
      scope: "Europe",
      url: "https://www.fibl.org",
      description: "One of the world's leading research centers for organic agriculture. FiBL conducts cutting-edge research in soil management, crop protection, animal welfare, and organic food safety, publishing highly-cited global organic statistics.",
      impactTheme: "Scientific Agricultural Innovation & Global Data Tracking",
      memberCount: "300+ Researchers",
      founded: 1973,
      tags: ["Soil Science", "Data Reports", "Agronomy Research"]
    },
    {
      name: "Organic Farmers Association",
      acronym: "OFA",
      type: "Trade & Business",
      region: "United States",
      scope: "North America",
      url: "https://organicfarmersassociation.org",
      description: "OFA provides a strong, unified national voice for domestic organic farmers in US federal policy. Governed entirely by certified organic farmers, they ensure farmers' priorities are centered in Agricultural bills.",
      impactTheme: "Farm Bills, Legislative Advocacy & Peer Learning",
      memberCount: "Thousands of Farms",
      founded: 2016,
      tags: ["Policy Voice", "Farmer Led", "Organic Purity"]
    },
    {
      name: "IFOAM Organics Europe",
      acronym: "IFOAM Europe",
      type: "Global Umbrella",
      region: "European Union (Brussels)",
      scope: "Europe",
      url: "https://www.organicseurope.bio",
      description: "The European regional group representing the organic food and farming sector. They campaign for the transition of EU food systems and work closely with European policy makers on the Green Deal and Farm to Fork targets.",
      impactTheme: "EU Agrarian Policy & organic farming targets (25% by 2030)",
      memberCount: "200+ Member Orgs",
      founded: 2002,
      tags: ["European Union Policy", "Green Deal Advocacy", "Sustainability"]
    },
    {
      name: "Organic Food Development Center",
      acronym: "OFDC",
      type: "Research & Education",
      region: "China",
      scope: "Asia-Pacific",
      url: "http://www.ofdc.org.cn",
      description: "As China's pioneer national professional organization, OFDC handles research, standards creation, and training. Under China's Ministry of Ecology and Environment, it spearheads regional conversion to organic practices.",
      impactTheme: "Eco-Farming Conversion & Asian Organic Certification Science",
      memberCount: "National Entity",
      founded: 1994,
      tags: ["Ecology", "Training Programs", "State Research"]
    },
    {
      name: "Organic Federation of Canada",
      acronym: "OFC",
      type: "Trade & Business",
      region: "Canada",
      scope: "North America",
      url: "https://organicfederation.ca",
      description: "Responsible for coordinating the maintenance and interpretation of the Canadian Organic Standards. OFC ensures federal compliance and coordinates research investments via the Canadian Organic Science Cluster.",
      impactTheme: "Standards Maintenance, Science Funding & Provincial Liaison",
      memberCount: "13 Regional Bodies",
      founded: 2007,
      tags: ["Standard Interpretation", "National Regulations", "Canadian Ag"]
    },
    {
      name: "The Biodynamic Association",
      acronym: "BDA",
      type: "Research & Education",
      region: "North America",
      scope: "North America",
      url: "https://www.biodynamics.com",
      description: "A collaborative membership association that promotes the practice of biodynamic agriculture. BDA hosts national conferences, provides farmer training courses, and publishes educational materials on holistic agronomy.",
      impactTheme: "Holistic Farm Organisms, Agro-ecology & Spiritual Science",
      memberCount: "3,000+ Practitioners",
      founded: 1938,
      tags: ["Biodynamics", "Farmer Training", "Eco-Agriculture"]
    },
    {
      name: "Sustain: The Alliance for Better Food and Farming",
      acronym: "Sustain",
      type: "Consumer Advocacy",
      region: "United Kingdom",
      scope: "Europe",
      url: "https://www.sustainweb.org",
      description: "Sustain advocates for food and agriculture policies and practices that enhance the health and welfare of people and animals, improve the environment, and promote local, high-integrity organic economies.",
      impactTheme: "Local Food Networks, School Meals Policy & Soil Safety Campaigns",
      memberCount: "100+ National Coalitions",
      founded: 1999,
      tags: ["Public Health", "Eco-Social Food", "Community Farming"]
    },
    {
      name: "The Organic Association of Kentucky",
      acronym: "OAK",
      type: "Trade & Business",
      region: "State/Local (Kentucky, USA)",
      scope: "North America",
      url: "https://www.oak-ky.org",
      description: "OAK improves ecological and economic health by supporting organic and transitioning growers. They provide highly regarded on-farm field days, soil transition advice, and community organic market coordination.",
      impactTheme: "Grassroots Soil Building, On-Farm Auditing & Regional Food Webs",
      memberCount: "450+ Active Growers",
      founded: 2009,
      tags: ["On-Farm Field Days", "Local Markets", "Soil Conversion"]
    },
    {
      name: "Bionext",
      acronym: "Bionext",
      type: "Trade & Business",
      region: "Netherlands",
      scope: "Europe",
      url: "https://www.bionext.nl",
      description: "The Dutch chain organization representing organic farmers, processors, trade, and consumers. Bionext builds partnerships across the value chain to increase organic consumption and political influence in Holland.",
      impactTheme: "Value-Chain Partnerships & National Organic Consumer Campaigns",
      memberCount: "Dutch Organic Lobby",
      founded: 2001,
      tags: ["Retail Liaison", "Farmer-Trader Network", "Consumer Outreach"]
    }
  ];

  const filteredOrgs = organizations.filter(org => {
    const matchesTab = activeTab === 'All' || org.type === activeTab;
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.impactTheme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section className="container mx-auto px-6 py-32 max-w-6xl border-t border-organic-green/5 mt-24">
      {/* Intro Header */}
      <div className="text-center mb-16 space-y-4">
        <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-60">
          Civic & Economic Ecosystem
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-organic-green-dark tracking-tighter leading-none uppercase">
          Organic Directory
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto leading-loose">
          Connect with trusted global and regional organic trade alliances, consumer watchdog groups, and scientific research networks fueling a circular, toxin-free food economy.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Organization Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-organic-green-dark text-white shadow-md'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Org name, theme..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-organic-green text-[11px] font-black bg-cream/10 uppercase tracking-widest"
          />
          <span className="absolute right-3.5 top-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Grid List */}
      {filteredOrgs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredOrgs.map((org, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-organic-green/40 transition-all duration-500 flex flex-col justify-between active:scale-[0.99] relative overflow-hidden"
            >
              {/* Decorative faint background icon */}
              <div className="absolute right-6 top-6 text-gray-50 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <Compass className="w-40 h-40" />
              </div>

              <div className="space-y-6 relative z-10">
                {/* Header line */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                    org.type === 'Global Umbrella' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                    org.type === 'Trade & Business' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    org.type === 'Consumer Advocacy' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-sky-50 text-sky-700 border border-sky-100'
                  }`}>
                    {org.type}
                  </span>

                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 text-[8px] font-black uppercase tracking-wider">
                      {org.scope}
                    </span>
                    {org.memberCount && (
                      <span className="px-2.5 py-1 rounded-lg bg-cream/80 border border-organic-green/10 text-organic-green-dark text-[8px] font-black uppercase tracking-wider">
                        {org.memberCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Acronym */}
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-2xl font-black text-organic-green-dark leading-tight">
                      {org.acronym}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                      Est. {org.founded}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-wide mt-1">
                    {org.name}
                  </h4>
                </div>

                {/* Impact Statement Banner */}
                <div className="bg-cream/40 rounded-2xl p-4 border border-organic-green/5">
                  <span className="text-[8px] font-black text-organic-green uppercase tracking-[0.2em] block mb-1">
                    Primary Impact Focus
                  </span>
                  <p className="text-xs font-black text-organic-green-dark">
                    {org.impactTheme}
                  </p>
                </div>

                {/* Full description */}
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {org.description}
                </p>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {org.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button Link */}
              <div className="border-t border-gray-50 mt-8 pt-6 relative z-10">
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full text-[10px] font-black text-organic-green-dark group-hover:text-organic-green uppercase tracking-[0.2em] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    Visit Official Site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 group-hover:bg-organic-green group-hover:text-white px-3 py-1.5 rounded-xl transition-all">
                    <span className="text-[8px]">CONNECT</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white border border-gray-100 rounded-[2.5rem] p-16 max-w-md mx-auto space-y-4">
          <div className="text-4xl">🏢</div>
          <h4 className="text-lg font-black text-organic-green-dark uppercase tracking-tight">No Entities Found</h4>
          <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
            We couldn't find any organizations matching your search term. Try resetting the filters or keywords.
          </p>
          <button
            onClick={() => {
              setActiveTab('All');
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-organic-green-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md hover:bg-organic-green active:scale-95 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Local Action Notice Banner */}
      <div className="mt-12 bg-gradient-to-br from-organic-green-dark to-organic-green rounded-[2.5rem] p-8 md:p-12 text-white max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none"></div>
        <div className="space-y-3 relative z-10 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest">
            <Sprout className="w-3 h-3 text-cream" /> Get Involved Locally
          </div>
          <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
            Strengthen Organic Systems In Your Community
          </h4>
          <p className="text-xs text-cream/80 font-medium leading-relaxed">
            By donating to, purchasing from, or partnering with these organizations, you directly support small family farms, safeguard clean watersheds, and build resilient soil profiles that reverse greenwashing globally.
          </p>
        </div>
        <div className="shrink-0 relative z-10 w-full md:w-auto">
          <a
            href="https://www.ifoam.bio/membership"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-organic-green-dark hover:bg-cream hover:scale-105 active:scale-95 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all duration-300"
          >
            <HeartHandshake className="w-4 h-4" /> Become an Ally
          </a>
        </div>
      </div>
    </section>
  );
};
