import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../types';

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
    <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-4">
      <h3 className="text-xs font-mono tracking-wider text-neutral-400 uppercase">01 / Profile Essentials</h3>
      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="Full Name (e.g. Ibrar Ali)"
          value={data.personalInfo.fullName}
          onChange={(e) => onUpdatePersonalInfo('fullName', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
        <input 
          type="text" 
          placeholder="Target Job Title"
          value={data.personalInfo.title}
          onChange={(e) => onUpdatePersonalInfo('title', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
        <input 
          type="email" 
          placeholder="Email Address"
          value={data.personalInfo.email}
          onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
        <input 
          type="text" 
          placeholder="Phone (e.g. +92 348 2167078)"
          value={data.personalInfo.phone}
          onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
        <input 
          type="text" 
          placeholder="Location (e.g. Quetta, Pakistan)"
          value={data.personalInfo.location}
          onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
        <input 
          type="text" 
          placeholder="Portfolio Link"
          value={data.personalInfo.website}
          onChange={(e) => onUpdatePersonalInfo('website', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
        />
      </div>

      {/* Dynamic Handles Deck */}
      <div className="space-y-2 pt-2 border-t border-neutral-800">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-neutral-400 font-medium">Professional Links (GitHub, LinkedIn)</span>
          <button onClick={onAddSocialLink} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
            <Plus size={12} /> Add Handle
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
              className="w-1/3 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none"
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
              className="w-2/3 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none"
            />
            <button onClick={() => onRemoveSocialLink(link.id)} className="text-neutral-500 hover:text-red-400 p-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};