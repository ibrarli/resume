import React, { useRef } from 'react';
import { Trash2, List, AlignLeft } from 'lucide-react';
import type { DynamicSection, SectionItem } from '../../../types';

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
  const defaultFormat = (sectionType === 'awards' || sectionType === 'certifications' || sectionType === 'languages') ? 'bullets' : 'paragraph';
  const formatMode = item.formatMode || defaultFormat;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="bg-background p-4 rounded-xl border-2 border-foreground/10 space-y-3.5 relative group transition-colors">
      
      {/* Delete Trigger Button */}
      <button 
        onClick={onRemove}
        className="absolute top-3 right-3 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 p-1"
      >
        <Trash2 size={14} />
      </button>

      {/* Field Input Layout System */}
      <div className="grid grid-cols-2 gap-3 font-body">
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
          className="w-full bg-transparent text-xs text-foreground focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1 font-bold font-heading tracking-tight"
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
          className={`w-full bg-transparent text-xs text-foreground/80 focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1 ${isSkillsOrLanguages ? 'col-span-1' : ''}`}
        />
        
        {hasDatesAndLocation && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text"
                placeholder={sectionType === 'awards' ? "Date Issued (e.g. 10/2022)" : "Start (MM/YYYY)"}
                value={item.startDate || ''}
                onChange={(e) => onUpdate('startDate', e.target.value)}
                className="w-full bg-transparent text-xs text-foreground/60 focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1"
              />
              {sectionType !== 'awards' && (
                <input 
                  type="text"
                  placeholder="End (or Present)"
                  value={item.endDate || ''}
                  onChange={(e) => onUpdate('endDate', e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground/60 focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1"
                />
              )}
            </div>
            {sectionType !== 'awards' && (
              <input 
                type="text"
                placeholder="Location (e.g. City, Remote)"
                value={item.location || ''}
                onChange={(e) => onUpdate('location', e.target.value)}
                className="w-full bg-transparent text-xs text-foreground/60 focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1"
              />
            )}
          </>
        )}
      </div>

      {/* High-Impact Text Description Block */}
      {hasDescription && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold font-heading text-foreground/40 tracking-wider">
            <span>DESCRIPTION FORMAT</span>
            <div className="flex bg-background border-2 border-foreground/10 rounded-xl overflow-hidden p-0.5">
              <button
                type="button"
                onClick={() => toggleFormatMode('paragraph')}
                className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[10px] font-bold font-body ${formatMode === 'paragraph' ? 'bg-primary text-dark-neutral' : 'text-foreground/60 hover:text-foreground'}`}
              >
                <AlignLeft size={11} />
                <span>Paragraph</span>
              </button>
              <button
                type="button"
                onClick={() => toggleFormatMode('bullets')}
                className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[10px] font-bold font-body ${formatMode === 'bullets' ? 'bg-primary text-dark-neutral' : 'text-foreground/60 hover:text-foreground'}`}
              >
                <List size={11} />
                <span>Bullets</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[5rem] w-full bg-background border-2 border-foreground/10 rounded-xl focus-within:border-primary transition-colors p-2.5">
            {formatMode === 'bullets' && (
              <ul className="absolute inset-0 p-2.5 pointer-events-none text-xs text-foreground/30 list-disc list-outside pl-6 space-y-[1px] font-body leading-relaxed overflow-hidden select-none opacity-20">
                {textLines.map((_, idx) => (
                  <li key={idx} className="min-h-[1.5rem] break-words whitespace-pre-wrap"> </li>
                ))}
              </ul>
            )}

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
              className={`w-full bg-transparent text-xs text-foreground/80 placeholder:text-foreground/30 focus:outline-none resize-none min-h-[4.5rem] leading-relaxed font-body block ${
                formatMode === 'bullets' ? 'pl-4 list-item list-disc list-outside ml-2 text-justify' : 'text-justify'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};