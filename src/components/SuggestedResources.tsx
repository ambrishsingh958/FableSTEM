import React from 'react';
import {
  BookOpen,
  ExternalLink,
  Globe,
  ShoppingCart,
  Search,
  Sparkles,
  Compass,
} from 'lucide-react';
import { SuggestedBook, SuggestedWebsite } from '../types';

interface SuggestedResourcesProps {
  topic: string;
  books?: SuggestedBook[];
  websites?: SuggestedWebsite[];
}

export const SuggestedResources: React.FC<SuggestedResourcesProps> = ({
  topic,
  books,
  websites,
}) => {
  // Safe fallbacks if not provided
  const displayBooks = books && books.length > 0 ? books : [
    {
      title: `The Science of ${topic} for Young Explorers`,
      author: 'National Geographic Kids',
      description: `Vivid diagrams, fun facts, and real-world photos showing how ${topic} works.`,
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${topic} national geographic kids`)}`,
      flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic} national geographic kids`)}`,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${topic} books for kids`)}`,
    },
    {
      title: `The Magic School Bus Explores ${topic}`,
      author: 'Joanna Cole',
      description: `Ms. Frizzle and her curious class take an unforgettable journey inside ${topic}!`,
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${topic} magic school bus`)}`,
      flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic} magic school bus`)}`,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${topic} magic school bus book`)}`,
    },
  ];

  const displayWebsites = websites && websites.length > 0 ? websites : [
    {
      title: `National Geographic Kids: ${topic}`,
      sourceName: 'NatGeo Kids',
      description: `Fun interactive guides, photos, quizzes, and cool science videos.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`National Geographic Kids ${topic}`)}`,
    },
    {
      title: `NASA Kids' Club & STEM Learning`,
      sourceName: 'NASA STEM',
      description: `Hands-on experiments, space photos, and games for curious minds.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`NASA STEM kids ${topic}`)}`,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-indigo-50/40 rounded-3xl border border-indigo-100 p-6 sm:p-9 shadow-md shadow-indigo-100/30 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Recommended Reading & Resources</span>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Dive Deeper into {topic}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suggested books to order online and trusted educational websites to explore further.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shrink-0 self-start sm:self-auto">
          FableSTEM Curated
        </span>
      </div>

      {/* 1. Recommended Books Section */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Recommended Books for Kids</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayBooks.map((book, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📖</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                    Book #{idx + 1}
                  </span>
                </div>

                <h5 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                  {book.title}
                </h5>

                {book.author && (
                  <p className="text-xs font-semibold text-indigo-600 mb-2">
                    by {book.author}
                  </p>
                )}

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {book.description}
                </p>
              </div>

              {/* Purchase & Search Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Amazon Button */}
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title={`Search for "${book.title}" on Amazon`}
                  >
                    <ShoppingCart className="w-3 h-3 text-amber-700" />
                    <span>Amazon</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>

                  {/* Flipkart Button */}
                  <a
                    href={book.flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title={`Search for "${book.title}" on Flipkart`}
                  >
                    <span className="font-black text-blue-600 text-xs">F</span>
                    <span>Flipkart</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>

                {/* Google Search Link */}
                <a
                  href={book.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>Search on Google</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Educational Websites Section */}
      <div>
        <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Interactive Websites & Portals</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayWebsites.map((site, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {site.sourceName}
                  </span>
                  <Compass className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform" />
                </div>

                <h5 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                  {site.title}
                </h5>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {site.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Explore on {site.sourceName}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>💡 Clicking links opens external bookstores or educational search safely in a new tab.</span>
      </div>
    </section>
  );
};
