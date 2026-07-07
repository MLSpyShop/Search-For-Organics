import React, { FC } from 'react';
import { manifestoSections } from '../src/content/manifestoContent';
import { Sprout } from 'lucide-react';

export const OrganicManifesto: FC = () => {
  return (
    <section className="bg-gray-50 border-t border-gray-100 py-32 px-6">
      <div className="container mx-auto max-w-4xl text-center space-y-12">
        <Sprout className="w-12 h-12 text-organic-green mx-auto" />
        <h2 className="text-3xl md:text-5xl font-black text-organic-green-dark tracking-tighter uppercase">
          The Organic Manifesto
        </h2>
        <div className="space-y-12 text-left text-gray-600 font-medium leading-relaxed">
          {manifestoSections.map((section, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-xl font-black text-organic-green-dark uppercase tracking-wider">
                {section.title}
              </h3>
              <p>{section.content}</p>
              {section.citation && (
                <a 
                  href={section.citation.split(" ")[1]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-organic-green underline italic"
                >
                  {section.citation}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
