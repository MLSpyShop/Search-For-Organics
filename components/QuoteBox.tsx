import React, { FC } from 'react';
import { Quote } from 'lucide-react';

interface QuoteBoxProps {
  quote: string;
  author: string;
  source: string;
}

export const QuoteBox: FC<QuoteBoxProps> = ({ quote, author, source }) => {
  return (
    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 my-12 flex gap-6 items-start">
      <Quote className="w-10 h-10 text-organic-green flex-shrink-0" />
      <div className="space-y-4">
        <p className="text-lg md:text-2xl font-medium text-gray-900 leading-snug italic">
          "{quote}"
        </p>
        <div className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">
          — {author}
        </div>
        <a href={source} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-organic-green hover:text-organic-green-dark font-medium underline underline-offset-4">
          View Source
        </a>
      </div>
    </div>
  );
};
