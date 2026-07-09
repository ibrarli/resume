import React from 'react';
import { Briefcase, GraduationCap, FolderGit2, Wrench, Trophy, Award, Languages } from 'lucide-react';
import type { DynamicSection } from '../../../types';

interface SectionCreatorDeckProps {
  onAddSection: (type: DynamicSection['type']) => void;
}

export const SectionCreatorDeck: React.FC<SectionCreatorDeckProps> = ({ onAddSection }) => {
  return (
    <div className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-3">
      <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
        Add Structured Content Section
      </h3>
      
      <div className="grid grid-cols-2 gap-2 font-body">
        <button 
          onClick={() => onAddSection('experience')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <Briefcase size={14} className="text-primary" /> Experience Block
        </button>
        
        <button 
          onClick={() => onAddSection('education')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <GraduationCap size={14} className="text-primary" /> Education Block
        </button>
        
        <button 
          onClick={() => onAddSection('projects')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <FolderGit2 size={14} className="text-primary" /> Projects Block
        </button>
        
        <button 
          onClick={() => onAddSection('skills')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <Wrench size={14} className="text-primary" /> Skills Matrix
        </button>
        
        <button 
          onClick={() => onAddSection('awards')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <Trophy size={14} className="text-primary" /> Honors & Awards
        </button>
        
        <button 
          onClick={() => onAddSection('certifications')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <Award size={14} className="text-primary" /> Certifications
        </button>
        
        <button 
          onClick={() => onAddSection('languages')} 
          className="p-2.5 h-10 bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary hover:text-foreground transition-colors text-left flex items-center gap-2.5 cursor-pointer col-span-2"
        >
          <Languages size={14} className="text-primary" /> Languages Profile
        </button>
      </div>
    </div>
  );
};