import React from 'react';
import { Briefcase, GraduationCap, FolderGit2, Wrench, Trophy, Award, Languages } from 'lucide-react';
import type { DynamicSection } from '../../types';

interface SectionCreatorDeckProps {
  onAddSection: (type: DynamicSection['type']) => void;
}

export const SectionCreatorDeck: React.FC<SectionCreatorDeckProps> = ({ onAddSection }) => {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-3">Add Structured Content Section</span>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onAddSection('experience')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <Briefcase size={12} className="text-blue-400" /> Experience Block
        </button>
        <button onClick={() => onAddSection('education')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <GraduationCap size={12} className="text-green-400" /> Education Block
        </button>
        <button onClick={() => onAddSection('projects')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <FolderGit2 size={12} className="text-amber-400" /> Projects Block
        </button>
        <button onClick={() => onAddSection('skills')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <Wrench size={12} className="text-purple-400" /> Skills Matrix
        </button>
        <button onClick={() => onAddSection('awards')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <Trophy size={12} className="text-rose-400" /> Honors & Awards
        </button>
        <button onClick={() => onAddSection('certifications')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer">
          <Award size={12} className="text-teal-400" /> Certifications
        </button>
        <button onClick={() => onAddSection('languages')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-800 transition text-left flex items-center gap-2 cursor-pointer col-span-2">
          <Languages size={12} className="text-indigo-400" /> Languages Profile
        </button>
      </div>
    </div>
  );
};