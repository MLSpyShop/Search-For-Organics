import React, { FC, useState } from 'react';
import { Briefcase, TrendingUp, Target, Users, X } from 'lucide-react';

export const OrganicBusinessPlan: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
      >
        Investors & Partners
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-organic-green-dark"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6 mb-12">
              <Briefcase className="w-12 h-12 text-organic-green mx-auto" />
              <h2 className="text-3xl font-black text-organic-green-dark tracking-tighter uppercase">
                2026–2035 Strategic Vision
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { year: '2026', title: 'Foundation', icon: <Users />, desc: 'Launch unified data aggregation platform, establish core community governance, and initiate organic advocacy partnerships.' },
                { year: '2030', title: 'Market Scale', icon: <TrendingUp />, desc: 'Integrate verification technology with global retail supply chains; influence top-tier international trade policy.' },
                { year: '2035', title: 'Total Circularity', icon: <Target />, desc: 'Define the global food system baseline; achieve total transparency and universal adoption of organic circular economy principles.' }
              ].map((milestone) => (
                <div key={milestone.year} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 space-y-4">
                  <div className="text-organic-green font-black text-3xl">{milestone.year}</div>
                  <div className="text-organic-green-dark font-black uppercase tracking-widest">{milestone.title}</div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
