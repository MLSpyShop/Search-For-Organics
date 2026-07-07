import React, { FC } from 'react';
import { 
  MessageSquare, Users, Mail, ExternalLink, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';

interface GroupCard {
  name: string;
  platformName: string;
  url: string;
  description: string;
  ctaText: string;
  icon: React.ReactNode;
  themeColor: string; // Tailwind bg/text color styles
  badge: string;
}

export const OrganicCommunityGroups: FC = () => {
  const groups: GroupCard[] = [
    {
      name: "Organic Discord Guild",
      platformName: "Discord Server",
      url: "https://discord.gg/sQgy7kktS2",
      description: "Chat in real-time with verified organic farmers, food security advocates, and industry developers. Discuss organic certification standards, soil biology, and search engine crawling.",
      ctaText: "Join Discord Server",
      icon: <MessageSquare className="w-6 h-6" />,
      themeColor: "from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600",
      badge: "Real-time Chat"
    },
    {
      name: "Search For Organics Community",
      platformName: "Google Group",
      url: "https://groups.google.com/g/search-for-organics",
      description: "Our core mailing list and public forum. Join detailed threads on organic certification compliance, platform feature requests, and organic SEO policy announcements.",
      ctaText: "Subscribe to Google Group",
      icon: <Mail className="w-6 h-6" />,
      themeColor: "from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700",
      badge: "Email List & Forum"
    },
    {
      name: "Organic Economy Alliance",
      platformName: "Facebook Group",
      url: "https://www.facebook.com/share/g/19n1cCpKhp/?mibextid=wwXIfr",
      description: "Share local organic products, report cases of greenwashing in your supermarket, and build grassroots consumer awareness campaigns in our active social circle.",
      ctaText: "Join Facebook Group",
      icon: <Users className="w-6 h-6" />,
      themeColor: "from-sky-600 to-blue-500 hover:from-sky-700 hover:to-blue-600",
      badge: "Consumer Sharing"
    },
    {
      name: "Organic Business Guild",
      platformName: "LinkedIn Group",
      url: "https://www.linkedin.com/groups/13054615",
      description: "A professional network for organic trade specialists, certified agricultural suppliers, retailers, and sustainable SEO partners seeking B2B collaborations.",
      ctaText: "Join LinkedIn Group",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      themeColor: "from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700",
      badge: "B2B Networking"
    }
  ];

  return (
    <section className="container mx-auto px-6 py-32 max-w-6xl border-t border-organic-green/5 mt-24">
      {/* Intro Header */}
      <div className="text-center mb-16 space-y-4">
        <span className="text-xs font-black text-organic-green uppercase tracking-[0.4em] opacity-60">
          Decentralized Networks
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-organic-green-dark tracking-tighter leading-none uppercase">
          Free Community Support Groups
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto leading-loose">
          Connect directly with fellow advocates, researchers, and trade operators. Share knowledge, troubleshoot platform features, and organize regional movements.
        </p>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {groups.map((group, index) => (
          <div
            key={index}
            className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-organic-green/30 transition-all duration-500 flex flex-col justify-between active:scale-[0.99]"
          >
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-xl bg-cream text-organic-green-dark text-[9px] font-black uppercase tracking-wider border border-organic-green/5">
                  {group.badge}
                </span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  {group.platformName}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.themeColor} text-white flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {group.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-organic-green-dark group-hover:text-organic-green transition-colors leading-tight">
                    {group.name}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Free & Open to All
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Action Button */}
            <div className="border-t border-gray-50 mt-8 pt-6">
              <a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 text-white bg-gradient-to-br ${group.themeColor} shadow-md hover:shadow-lg active:scale-95 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300`}
              >
                <span>{group.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Policy Notice banner */}
      <div className="mt-16 bg-white border border-organic-green/5 rounded-[2.5rem] p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-organic-green shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-xs font-black text-organic-green-dark uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
            Community Rules & Moderation Standards
          </h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            All our support groups are strictly moderated by organic advocates. We mandate polite, respectful, and science-backed interactions. <strong>No spam, commercial SEO backlink trickery, or synthetic farming promotion is tolerated.</strong> Let's foster a pure, healthy dialogue together!
          </p>
        </div>
      </div>
    </section>
  );
};
