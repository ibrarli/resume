import React, { useRef } from 'react';
import { Trash2, List, AlignLeft } from 'lucide-react';
import type { DynamicSection, SectionItem } from '../../types';

interface SectionItemRowProps {
  item: SectionItem;
  sectionType: DynamicSection['type'];
  onUpdate: (field: keyof SectionItem, value: any) => void;
  onRemove: () => void;
}

export const SectionItemRow: React.FC<SectionItemRowProps> = ({
  item,
  sectionType,
  onUpdate,
  onRemove,
}) => {
  // Languages and certifications default nicely to bullet mode, while others fallback to paragraph
  const defaultFormat = (sectionType === 'awards' || sectionType === 'certifications' || sectionType === 'languages') ? 'bullets' : 'paragraph';
  const formatMode = item.formatMode || defaultFormat;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Structural checks to handle visibility across specialized blocks
  const isSkillsOrLanguages = sectionType === 'skills' || sectionType === 'languages';
  const hasDatesAndLocation = sectionType === 'experience' || sectionType === 'education' || sectionType === 'projects' || sectionType === 'awards';
  const hasDescription = sectionType !== 'skills' && sectionType !== 'languages';

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    if (formatMode === 'bullets') {
      value = value.replace(/^[•\-\*]\s*/gm, '');
    }
    
    onUpdate('description', value);
  };

  const toggleFormatMode = (mode: 'paragraph' | 'bullets') => {
    onUpdate('formatMode', mode);
    
    if (item.description) {
      const cleanedText = item.description
        .split('\n')
        .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
        .join('\n');
      onUpdate('description', cleanedText);
    }
  };

  const textLines = item.description ? item.description.split('\n') : [''];

  return (
    <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3 relative group">
      <button 
        onClick={onRemove}
        className="absolute top-3 right-3 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
      >
        <Trash2 size={12} />
      </button>

      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text"
          placeholder={
            sectionType === 'experience' ? "Job Title / Role" :
            sectionType === 'education' ? "Degree Major (e.g. BS Computer Science)" :
            sectionType === 'projects' ? "Project Name" :
            sectionType === 'awards' ? "Award / Honor Title" :
            sectionType === 'certifications' ? "Certification Name" : 
            sectionType === 'languages' ? "Language Name" : "Classification Group Name"
          }
          value={item.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none border-b border-neutral-800 p-1 font-semibold"
        />
        <input 
          type="text"
          placeholder={
            sectionType === 'experience' ? "Company / Employer" :
            sectionType === 'education' ? "University / School" :
            sectionType === 'projects' ? "Tech Stack Keywords" :
            sectionType === 'awards' ? "Issuing Organization / Authority" :
            sectionType === 'certifications' ? "Issuing Body (e.g. AWS, Coursera)" :
            sectionType === 'languages' ? "Proficiency Level (e.g. Native, Professional)" : 
            "Values / Tech Stack (Comma separated)"
          }
          value={item.subtitle || ''}
          onChange={(e) => onUpdate('subtitle', e.target.value)}
          className={`w-full bg-transparent text-xs text-neutral-300 focus:outline-none border-b border-neutral-800 p-1 ${isSkillsOrLanguages ? 'col-span-1' : ''}`}
        />
        
        {hasDatesAndLocation && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text"
                placeholder={sectionType === 'awards' ? "Date Issued (e.g. 10/2022)" : "Start (MM/YYYY)"}
                value={item.startDate || ''}
                onChange={(e) => onUpdate('startDate', e.target.value)}
                className="w-full bg-transparent text-xs text-neutral-400 focus:outline-none border-b border-neutral-800 p-1"
              />
              {sectionType !== 'awards' && (
                <input 
                  type="text"
                  placeholder="End (or Present)"
                  value={item.endDate || ''}
                  onChange={(e) => onUpdate('endDate', e.target.value)}
                  className="w-full bg-transparent text-xs text-neutral-400 focus:outline-none border-b border-neutral-800 p-1"
                />
              )}
            </div>
            {sectionType !== 'awards' && (
              <input 
                type="text"
                placeholder="Location (e.g. City, Remote)"
                value={item.location || ''}
                onChange={(e) => onUpdate('location', e.target.value)}
                className="w-full bg-transparent text-xs text-neutral-400 focus:outline-none border-b border-neutral-800 p-1"
              />
            )}
          </>
        )}
      </div>

      {hasDescription && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
            <span>DESCRIPTION FORMAT</span>
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden p-0.5">
              <button
                type="button"
                onClick={() => toggleFormatMode('paragraph')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${formatMode === 'paragraph' ? 'bg-neutral-800 text-white' : 'hover:text-neutral-300'}`}
              >
                <AlignLeft size={10} />
                <span>Paragraph</span>
              </button>
              <button
                type="button"
                onClick={() => toggleFormatMode('bullets')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${formatMode === 'bullets' ? 'bg-neutral-800 text-purple-400' : 'hover:text-neutral-300'}`}
              >
                <List size={10} />
                <span>Bullets</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[5rem] w-full bg-neutral-950 border border-neutral-800/60 rounded-lg focus-within:border-neutral-600 transition-all p-2">
            {/* Render Layer: Handles hanging list bullet alignment formatting */}
            {formatMode === 'bullets' && (
              <ul className="absolute inset-0 p-2 pointer-events-none text-xs text-neutral-400 list-disc list-outside pl-6 space-y-[1px] font-sans leading-relaxed overflow-hidden select-none opacity-20">
                {textLines.map((_, idx) => (
                  <li key={idx} className="min-h-[1.5rem] break-words whitespace-pre-wrap"> </li>
                ))}
              </ul>
            )}

            {/* Input Layer */}
            <textarea 
              ref={textareaRef}
              placeholder={
                formatMode === 'bullets' 
                  ? sectionType === 'awards'
                    ? "Led a team to win 1st place in the programming competition.\nCompeted against 87 teams and 200 participants across the province."
                    : "Add contextual details or specific key tracking milestones here..."
                  : "ATS High Impact Block: Quantify your core milestones and performance context..."
              }
              value={item.description || ''}
              onChange={handleDescriptionChange}
              className={`w-full bg-transparent text-xs text-neutral-300 focus:outline-none resize-none min-h-[4.5rem] leading-relaxed font-sans block ${
                formatMode === 'bullets' ? 'pl-4 list-item list-disc list-outside ml-2 text-justify' : 'text-justify'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};