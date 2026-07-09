import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase, GraduationCap, FolderGit2, Wrench, Layers, Trophy, Award, Languages } from 'lucide-react';
import { ProfileEssentials } from './FormSections/ProfileEssentials';
import { SummaryBlock } from './FormSections/SummaryBlock';
import { SectionItemRow } from './FormSections/SectionItemRow';
import { SectionCreatorDeck } from './FormSections/SectionCreatorDeck';
import type { ResumeData, DynamicSection, SectionItem } from '../../types';

interface FormEditorProps {
  data: ResumeData;
  onChange: (updatedData: ResumeData) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  
  const updatePersonalInfo = (field: string, value: any) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const addSocialLink = () => {
    const updatedLinks = [...data.personalInfo.links, { id: `link-${Date.now()}`, platform: '', url: '' }];
    onChange({ ...data, personalInfo: { ...data.personalInfo, links: updatedLinks } });
  };

  const removeSocialLink = (id: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, links: data.personalInfo.links.filter(l => l.id !== id) } });
  };

  const addSection = (type: DynamicSection['type']) => {
    const sectionTitles: Record<DynamicSection['type'], string> = {
      experience: 'PROFESSIONAL EXPERIENCE',
      education: 'EDUCATION',
      projects: 'PROJECTS',
      skills: 'TECHNICAL SKILLS',
      awards: 'HONORS & AWARDS',
      certifications: 'CERTIFICATIONS',
      languages: 'LANGUAGES',
      custom: 'ADDITIONAL SECTION'
    };
    const newSection: DynamicSection = { id: `sec-${Date.now()}`, title: sectionTitles[type], type, items: [] };
    onChange({ ...data, sections: [...data.sections, newSection] });
  };

  const removeSection = (sectionId: string) => {
    onChange({ ...data, sections: data.sections.filter(s => s.id !== sectionId) });
  };

  // Absolute array positioning controls
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = data.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.sections.length) return;

    const updatedSections = [...data.sections];
    const [movedSection] = updatedSections.splice(index, 1);
    updatedSections.splice(targetIndex, 0, movedSection);

    onChange({ ...data, sections: updatedSections });
  };

  const addSectionItem = (sectionIndex: number) => {
    const updatedSections = [...data.sections];
    const sectionType = updatedSections[sectionIndex].type;
    const defaultFormat = (sectionType === 'awards' || sectionType === 'certifications' || sectionType === 'languages') ? 'bullets' : 'paragraph';
    
    updatedSections[sectionIndex].items.push({
      id: `item-${Date.now()}`, 
      title: '', 
      subtitle: '', 
      startDate: '', 
      endDate: '', 
      location: '', 
      description: '',
      formatMode: defaultFormat
    });
    onChange({ ...data, sections: updatedSections });
  };

  const updateSectionItem = (secIdx: number, itemIdx: number, field: keyof SectionItem, value: any) => {
    const updatedSections = [...data.sections];
    updatedSections[secIdx].items[itemIdx] = { ...updatedSections[secIdx].items[itemIdx], [field]: value };
    onChange({ ...data, sections: updatedSections });
  };

  const removeSectionItem = (secIdx: number, itemIdx: number) => {
    const updatedSections = [...data.sections];
    updatedSections[secIdx].items = updatedSections[secIdx].items.filter((_, idx) => idx !== itemIdx);
    onChange({ ...data, sections: updatedSections });
  };

  return (
    <div className="space-y-6">
      <ProfileEssentials 
        data={data}
        onUpdatePersonalInfo={updatePersonalInfo}
        onAddSocialLink={addSocialLink}
        onRemoveSocialLink={removeSocialLink}
      />

      <SummaryBlock 
        summary={data.summary}
        onChange={(val) => onChange({ ...data, summary: val })}
      />

      {data.sections.map((section, sIdx) => (
        <div key={section.id} className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-4">
          
          {/* Section Dynamic Header with Navigation Shifts */}
          <div className="flex justify-between items-center border-b border-foreground/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-foreground/60">
                {section.type === 'experience' && <Briefcase size={15} />}
                {section.type === 'education' && <GraduationCap size={15} />}
                {section.type === 'projects' && <FolderGit2 size={15} />}
                {section.type === 'skills' && <Wrench size={15} />}
                {section.type === 'awards' && <Trophy size={15} />}
                {section.type === 'certifications' && <Award size={15} />}
                {section.type === 'languages' && <Languages size={15} />}
                {section.type === 'custom' && <Layers size={15} />}
              </span>
              <input 
                type="text"
                value={section.title}
                onChange={(e) => {
                  const updated = [...data.sections];
                  updated[sIdx].title = e.target.value.toUpperCase();
                  onChange({ ...data, sections: updated });
                }}
                className="bg-transparent text-sm font-bold font-heading tracking-wide text-foreground focus:outline-none border-b-2 border-transparent focus:border-primary px-1"
              />
            </div>

            {/* Layout Location Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={sIdx === 0}
                onClick={() => handleMoveSection(section.id, 'up')}
                className="p-1.5 rounded-lg border-2 border-foreground/10 hover:border-primary text-foreground/60 hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Move Section Up"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                disabled={sIdx === data.sections.length - 1}
                onClick={() => handleMoveSection(section.id, 'down')}
                className="p-1.5 rounded-lg border-2 border-foreground/10 hover:border-primary text-foreground/60 hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Move Section Down"
              >
                <ArrowDown size={12} />
              </button>
              <button 
                type="button"
                onClick={() => removeSection(section.id)} 
                className="p-1.5 rounded-lg border-2 border-foreground/10 hover:border-red-500 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer ml-1"
                title="Delete Section Block"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Section Sub-items Block */}
          <div className="space-y-4">
            {section.items.map((item, iIdx) => (
              <SectionItemRow 
                key={item.id}
                item={item}
                sectionType={section.type}
                onUpdate={(field, val) => updateSectionItem(sIdx, iIdx, field, val)}
                onRemove={() => removeSectionItem(sIdx, iIdx)}
              />
            ))}

            {/* Flat Google-Style Container Action Trigger */}
            <button 
              type="button"
              onClick={() => addSectionItem(sIdx)}
              className="w-full h-10 bg-background border-2 border-dashed border-foreground/10 rounded-xl flex items-center justify-center gap-2 text-foreground/60 hover:border-primary hover:text-foreground transition-colors text-xs font-bold font-body cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Entry to Group</span>
            </button>
          </div>
        </div>
      ))}

      <SectionCreatorDeck onAddSection={addSection} />
    </div>
  );
};