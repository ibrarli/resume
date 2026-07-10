import React, { useRef, useState, useEffect } from 'react';
import { Trash2, List, AlignLeft, AlertCircle, Calendar, ChevronDown } from 'lucide-react';
import { Dropdown } from '../../global/Dropdown';
import { CITIES_DATA } from '../../../src/data/cities';
import type { DynamicSection, SectionItem } from '../../../types';

// Declare the interface for the primary component properties explicitly
interface SectionItemRowProps {
  item: SectionItem;
  sectionType: DynamicSection['type'];
  onUpdate: (field: keyof SectionItem, value: any) => void;
  onRemove: () => void;
}

// --- Dedicated Month & Year Picker Component ---
interface MonthYearPickerProps {
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ value, placeholder, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate range of years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 10 }, (_, i) => (currentYear + 5 - i).toString());

  // Parse existing value if present ("MMM YYYY")
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (value && value !== 'Present') {
      const [m, y] = value.split(' ');
      if (months.includes(m)) setSelectedMonth(m);
      if (y) setSelectedYear(y);
    } else {
      setSelectedMonth('');
      setSelectedYear('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (month: string, year: string) => {
    if (month && year) {
      onChange(`${month} ${year}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent text-xs text-foreground/60 border-b-2 border-foreground/10 focus:border-primary p-1 min-h-[1.75rem] flex items-center justify-between text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-1.5 truncate">
          <Calendar size={11} className="shrink-0 text-foreground/40" />
          {value || <span className="text-foreground/30">{placeholder}</span>}
        </span>
        <ChevronDown size={11} className="text-foreground/40 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 bg-background border-2 border-foreground/10 rounded-xl shadow-xl z-50 p-2 grid grid-cols-2 gap-2 animate-fade-in">
          {/* Months Column */}
          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
            <div className="text-[9px] font-bold text-foreground/40 px-1.5 py-0.5 sticky top-0 bg-background">MONTH</div>
            {months.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setSelectedMonth(m);
                  handleSelect(m, selectedYear);
                }}
                className={`w-full text-left text-[11px] px-2 py-1 rounded-lg transition-colors ${
                  selectedMonth === m ? 'bg-primary text-dark-neutral font-bold' : 'hover:bg-foreground/5 text-foreground/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Years Column */}
          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-0.5 pl-1 border-l border-foreground/5">
            <div className="text-[9px] font-bold text-foreground/40 px-1.5 py-0.5 sticky top-0 bg-background">YEAR</div>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setSelectedYear(y);
                  handleSelect(selectedMonth, y);
                }}
                className={`w-full text-left text-[11px] px-2 py-1 rounded-lg transition-colors ${
                  selectedYear === y ? 'bg-primary text-dark-neutral font-bold' : 'hover:bg-foreground/5 text-foreground/80'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main SectionItemRow Component ---
export const SectionItemRow: React.FC<SectionItemRowProps> = ({
  item,
  sectionType,
  onUpdate,
  onRemove,
}) => {
  const defaultFormat = (sectionType === 'awards' || sectionType === 'certifications' || sectionType === 'languages') ? 'bullets' : 'paragraph';
  const formatMode = item.formatMode || defaultFormat;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const PARAGRAPH_LIMIT = 400;

  const isSkillsOrLanguages = sectionType === 'skills' || sectionType === 'languages';
  const hasDatesAndLocation = sectionType === 'experience' || sectionType === 'education' || sectionType === 'projects' || sectionType === 'awards';
  const hasDescription = sectionType !== 'skills' && sectionType !== 'languages';

  const formatTitleCapitalization = (val: string) => {
    const lowercaseExceptions = ['of', 'in', 'and', 'for', 'with', 'at', 'to', 'the', 'by', 'a'];
    
    return val
      .split(' ')
      .map((word, index) => {
        if (!word) return word;
        
        if (lowercaseExceptions.includes(word.toLowerCase())) {
          return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase();
        }
        
        if (word.charAt(0) === word.charAt(0).toLowerCase()) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        
        return word;
      })
      .join(' ');
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (formatMode === 'bullets') {
      value = value.replace(/^[•\-\*]\s*/gm, '');
    }
    
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    onUpdate('description', value);
  };

  const toggleFormatMode = (mode: 'paragraph' | 'bullets') => {
    onUpdate('formatMode', mode);
    if (item.description) {
      let cleanedText = item.description
        .split('\n')
        .map((line: string) => line.replace(/^[•\-\*]\s*/, '').trim())
        .join('\n');
      onUpdate('description', cleanedText);
    }
  };

  const checkDateValidationIssues = () => {
    if (!item.startDate || !item.endDate || item.endDate.toLowerCase() === 'present') return false;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parseDateStr = (str: string) => {
      const parts = str.split(' ');
      if (parts.length !== 2) return null;
      const monthIdx = months.indexOf(parts[0]);
      const year = parseInt(parts[1], 10);
      if (monthIdx === -1 || isNaN(year)) return null;
      return new Date(year, monthIdx, 1);
    };

    const start = parseDateStr(item.startDate);
    const end = parseDateStr(item.endDate);
    
    if (start && end) {
      return start > end;
    }
    return false;
  };

  const textLines = item.description ? item.description.split('\n').filter(Boolean) : [];
  const displayDateWarning = checkDateValidationIssues();
  
  const descriptionLength = item.description?.length || 0;
  const isOverParagraphLimit = formatMode === 'paragraph' && descriptionLength > PARAGRAPH_LIMIT;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
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
          onChange={(e) => onUpdate('title', formatTitleCapitalization(e.target.value))}
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
          onChange={(e) => onUpdate('subtitle', formatTitleCapitalization(e.target.value))}
          className={`w-full bg-transparent text-xs text-foreground/80 focus:outline-none border-b-2 border-foreground/10 focus:border-primary p-1 ${isSkillsOrLanguages ? 'col-span-1' : ''}`}
        />
        
        {hasDatesAndLocation && (
          <>
            <div className="grid grid-cols-2 gap-2 relative">
              <MonthYearPicker
                value={item.startDate || ''}
                placeholder="Start Date"
                onChange={(val) => onUpdate('startDate', val)}
              />

              {item.endDate !== 'Present' ? (
                <MonthYearPicker
                  value={item.endDate || ''}
                  placeholder="End Date"
                  disabled={item.endDate === 'Present'}
                  onChange={(val) => onUpdate('endDate', val)}
                />
              ) : (
                <div className="text-xs text-foreground/40 p-1 border-b-2 border-foreground/5 font-medium select-none flex items-center">
                  Ongoing Role
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-start">
              {sectionType !== 'awards' && (
                <div className="w-1/2 shrink-0">
                  <Dropdown
                    value={item.location || ''}
                    placeholder="Select Location"
                    options={CITIES_DATA}
                    onChange={(val) => onUpdate('location', val)}
                    className="h-8 border-b-2 border-t-0 border-x-0 rounded-none bg-transparent px-1 border-foreground/10 focus:border-primary"
                  />
                </div>
              )}

              {sectionType === 'experience' && (
                <label className="flex items-center gap-2 text-[11px] font-medium text-foreground/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.endDate === 'Present'}
                    onChange={(e) => {
                      onUpdate('endDate', e.target.checked ? 'Present' : '');
                    }}
                    className="accent-primary rounded border-foreground/20 cursor-pointer h-3.5 w-3.5"
                  />
                  <span>Currently Work Here</span>
                </label>
              )}
            </div>

            {displayDateWarning && (
              <div className="col-span-1 sm:col-span-2 flex items-center gap-1 text-[10px] text-red-500 font-medium">
                <AlertCircle size={10} />
                <span>Timeline conflict: Start date falls after the specified expiration bound.</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* High-Impact Text Description Block */}
      {hasDescription && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold font-heading text-foreground/40 tracking-wider">
            <div className="flex items-center gap-2">
              <span>DESCRIPTION FORMAT</span>
              {formatMode === 'bullets' && textLines.length > 3 && (
                <div className="flex items-center gap-1 text-[9px] font-medium text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10 animate-fade-in">
                  <AlertCircle size={9} />
                  <span>3 bullets max recommended for elite scanning impact</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {formatMode === 'paragraph' && (
                <span className={`text-[9px] font-mono font-medium tracking-wide transition-colors ${
                  isOverParagraphLimit ? 'text-red-500 font-bold' : descriptionLength >= PARAGRAPH_LIMIT * 0.9 ? 'text-amber-500' : 'text-foreground/40'
                }`}>
                  {descriptionLength}/{PARAGRAPH_LIMIT} chars
                </span>
              )}
              
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
          </div>

          <div className={`relative min-h-[5rem] w-full bg-background border-2 rounded-xl focus-within:border-primary transition-colors p-2.5 ${
            isOverParagraphLimit ? 'border-red-500/50 focus-within:border-red-500' : 'border-foreground/10'
          }`}>
            {formatMode === 'bullets' && (
              <ul className="absolute inset-0 p-2.5 pointer-events-none text-xs text-foreground/30 list-disc list-outside pl-6 space-y-[1px] font-body leading-relaxed overflow-hidden select-none opacity-20">
                {(textLines.length ? textLines : ['']).map((_, idx) => (
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