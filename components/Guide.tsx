import React from 'react';
import { BookOpen, Leaf, BrainCircuit, ShieldCheck, Search } from 'lucide-react';

export const Guide: React.FC = () => (
  <section className="container mx-auto px-6 py-32 max-w-4xl border-t border-organic-green/10 mt-24">
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-80">Platform Guide</span>
        <h2 className="text-5xl md:text-6xl font-black text-organic-green-dark tracking-tighter leading-none uppercase">A Journey into Organic Authenticity</h2>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 font-medium leading-relaxed space-y-8">
        <p>
          Welcome to <span className="text-organic-green-dark font-black">Search For Organics</span>. You have arrived at more than just a search engine; you are standing at the intersection of truth, sustainability, and technological innovation in the organic space. This platform is designed for the conscious consumer, the ambitious business owner, and the curious learner who refuses to accept the diluted standards of modern marketing.
        </p>
        
        <h3 className="text-2xl font-black text-organic-green-dark tracking-tight uppercase flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-organic-green" /> Meet Organic Bob, Your Expert
        </h3>
        <p>
          At the heart of our platform is <span className="font-black italic text-organic-green-dark">Organic Bob</span>, your personal AI assistant. Bob is not just an interface—he is a multifaceted expert built to guide you through complex organic landscapes. Whether you are scaling a business, navigating legal standards, or exploring the future of materials, Bob is here to help.
        </p>
        <p>
          Bob’s expertise spans:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
          {[
            { title: "Organic SEO", desc: "Master the intersection of certification and visibility." },
            { title: "Business Growth", desc: "Strategies for sustainable, authentic scaling." },
            { title: "Organic Law", desc: "Navigating compliance and rights, supreme among them the Universal Declaration of Organic Rights." },
            { title: "Materials Science", desc: "Deep technical insight into sustainable Hempoxies." },
            { title: "Attraction Marketing", desc: "Naturally attracting your ideal audience." }
          ].map(item => (
            <li key={item.title} className="bg-cream/50 p-6 rounded-2xl border border-organic-green/10">
              <span className="font-black text-organic-green-dark block mb-2">{item.title}</span>
              <span className="text-sm text-gray-600">{item.desc}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-2xl font-black text-organic-green-dark tracking-tight uppercase flex items-center gap-3">
          <Leaf className="w-6 h-6 text-organic-green" /> Authenticity & Search
        </h3>
        <p>
          The core of this platform is its commitment to <span className="font-black text-organic-green-dark">validation</span>. We do not just return links; we return grounded results. By crawling official databases (such as USDA, EU Organic, GOTS) and utilizing advanced geocoding via Google Maps, we filter for genuine organic products, local markets, and trusted farms.
        </p>
        <p>
          Our <span className="font-black text-organic-green-dark">Purity Calculation</span> feature provides an audit of ingredient transparency, while our AI-driven critique tools protect you from greenwashing by offering objective insights based on search-verified data.
        </p>

        <h3 className="text-2xl font-black text-organic-green-dark tracking-tight uppercase flex items-center gap-3">
          <Search className="w-6 h-6 text-organic-green" /> How to Start
        </h3>
        <p>
          1. <strong>Ask Bob:</strong> Use the interactive chat box to start a conversation. Whether you need technical SEO help, advice on Hempoxies, or help finding a local farmer, just ask.
        </p>
        <p>
          2. <strong>Search Locally:</strong> Set your location to discover the best organic goods near you.
        </p>
        <p>
          3. <strong>Deep Dive:</strong> Explore the platform's resources, including our manifesto, business plans, and organizational partnerships, to fully engage with the global organic community.
        </p>
        
        <div className="bg-organic-green-dark text-white p-8 rounded-3xl mt-12 text-center">
          <p className="text-xl font-black italic mb-4">"Your body is a temple—don't let marketing speak be the architect."</p>
          <p className="text-xs uppercase tracking-widest font-black opacity-70">Welcome to a cleaner, clearer way to search.</p>
        </div>
      </div>
    </div>
  </section>
);
