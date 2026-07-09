import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../../types';

interface ProfileEssentialsProps {
  data: ResumeData;
  onUpdatePersonalInfo: (field: string, value: any) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
}

export const ProfileEssentials: React.FC<ProfileEssentialsProps> = ({
  data,
  onUpdatePersonalInfo,
  onAddSocialLink,
  onRemoveSocialLink,
}) => {
  return (
    <div className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-4">
      <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
        Profile Essentials
      </h3>
      
      <div className="grid grid-cols-2 gap-3 font-body">
        <input 
          type="text" 
          placeholder="Full Name (e.g. Ibrar Ali)"
          value={data.personalInfo.fullName}
          onChange={(e) => onUpdatePersonalInfo('fullName', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input 
          type="text" 
          placeholder="Target Job Title"
          value={data.personalInfo.title}
          onChange={(e) => onUpdatePersonalInfo('title', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input 
          type="email" 
          placeholder="Email Address"
          value={data.personalInfo.email}
          onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input 
          type="text" 
          placeholder="Phone (e.g. +92 348 2167078)"
          value={data.personalInfo.phone}
          onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input 
          type="text" 
          placeholder="Location (e.g. Quetta, Pakistan)"
          value={data.personalInfo.location}
          onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input 
          type="text" 
          placeholder="Portfolio Link"
          value={data.personalInfo.website}
          onChange={(e) => onUpdatePersonalInfo('website', e.target.value)}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Dynamic Handles Deck */}
      <div className="space-y-3 pt-3 border-t-2 border-foreground/10 font-body">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-foreground/50">Professional Links (GitHub, LinkedIn)</span>
          <button 
            onClick={onAddSocialLink} 
            className="text-primary hover:opacity-80 flex items-center gap-1 text-xs font-bold cursor-pointer transition-opacity"
          >
            <Plus size={14} /> Add Handle
          </button>
        </div>
        
        {data.personalInfo.links.map((link, idx) => (
          <div key={link.id} className="flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="Platform" 
              value={link.platform}
              onChange={(e) => {
                const updated = [...data.personalInfo.links];
                updated[idx].platform = e.target.value;
                onUpdatePersonalInfo('links', updated);
              }}
              className="w-1/3 h-9 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input 
              type="text" 
              placeholder="Profile URL" 
              value={link.url}
              onChange={(e) => {
                const updated = [...data.personalInfo.links];
                updated[idx].url = e.target.value;
                onUpdatePersonalInfo('links', updated);
              }}
              className="w-2/3 h-9 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              onClick={() => onRemoveSocialLink(link.id)} 
              className="text-foreground/40 hover:text-red-500 p-1 cursor-pointer transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};