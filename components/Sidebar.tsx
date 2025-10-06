import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Tool, AppContextType } from '../types';

const OutreachRoadmapLogo: React.FC = () => (
    <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 16" fill="none">
                <path d="M1 8H5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 8H15" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M21 8H28M28 8L25 5M28 8L25 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="5" y="5" width="6" height="6" rx="0.5" stroke="#9ca3af" strokeWidth="1.5"/>
                <rect x="15" y="5" width="6" height="6" rx="0.5" stroke="#9ca3af" strokeWidth="1.5"/>
                <rect x="21" y="5" width="6" height="6" rx="0.5" fill="#3b82f6"/>
            </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Outreach Roadmap</h1>
    </div>
);


const LinkedInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a4 4 0 0 1 -4 -4v-1a.5 .5 0 0 0 -1 0v1" />
    </svg>
);

const YouTubeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7 4 12 4s9.5 2 9.5 3a24.12 24.12 0 0 1 0 10c0 1-4.5 3-9.5 3s-9.5-2-9.5-3z"></path><path d="m10 15 5-3-5-3z"></path></svg>
);

const FounderSection: React.FC = () => {
    const socialLinks = [
        { href: "https://www.linkedin.com/in/ecommerceamazonbrandmanager/", icon: <LinkedInIcon />, name: 'LinkedIn' },
        { href: "https://www.facebook.com/profile.php?id=100010604628065", icon: <FacebookIcon />, name: 'Facebook' },
        { href: "https://wa.me/qr/W544227BLT5EM1", icon: <WhatsAppIcon />, name: 'WhatsApp' },
        { href: "https://www.youtube.com/@MuhammadHamza-sm6fq", icon: <YouTubeIcon />, name: 'YouTube' },
    ];
    
    return (
        <div className="mt-auto pt-6 border-t border-gray-800">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Founder</h3>
            <div className="mt-4">
                <p className="text-sm font-semibold text-white">Muhammad Hamza</p>
                <div className="flex items-center gap-4 mt-2">
                     {socialLinks.map(link => (
                         <a 
                             key={link.name} 
                             href={link.href} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="text-gray-400 hover:text-blue-400 transition-colors"
                             aria-label={`Visit Muhammad Hamza's ${link.name} profile`}
                        >
                             {link.icon}
                         </a>
                     ))}
                </div>
            </div>
        </div>
    );
};


const Sidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useContext(AppContext) as AppContextType;

  const navItems = [
    { id: Tool.LIO, label: "LinkedIn Outbound Plan" },
    { id: Tool.FIO, label: "Facebook & IG DM Outreach" },
    { id: Tool.EO, label: "Email Outreach" },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-gray-900/70 border-r border-gray-800 p-6 flex flex-col flex-shrink-0">
      <div>
        <OutreachRoadmapLogo />
        <nav className="flex flex-row md:flex-col gap-2">
            {navItems.map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTool(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTool === item.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
            >
                {item.label}
            </button>
            ))}
        </nav>
      </div>
      <FounderSection />
    </aside>
  );
};

export default Sidebar;