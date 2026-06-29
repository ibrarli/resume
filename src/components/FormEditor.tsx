import React from 'react';
import { Plus, Trash2, Briefcase, GraduationCap, FolderGit2, Wrench, Layers, Trophy, Award, Languages } from 'lucide-react';
import { ProfileEssentials } from './FormSections/ProfileEssentials';
import { SummaryBlock } from './FormSections/SummaryBlock';
import { SectionItemRow } from './FormSections/SectionItemRow';
import { SectionCreatorDeck } from './FormSections/SectionCreatorDeck';
import type { ResumeData, DynamicSection, SectionItem } from '../types';

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

  const addSectionItem = (sectionIndex: number) => {
    const updatedSections = [...data.sections];
    updatedSections[sectionIndex].items.push({
      id: `item-${Date.now()}`, title: '', subtitle: '', startDate: '', endDate: '', location: '', description: ''
    });
    onChange({ ...data, sections: updatedSections });
  };

  const updateSectionItem = (secIdx: number, itemIdx: number, field: keyof SectionItem, value: string) => {
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
        <div key={section.id} className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">
                {section.type === 'experience' && <Briefcase size={14} />}
                {section.type === 'education' && <GraduationCap size={14} />}
                {section.type === 'projects' && <FolderGit2 size={14} />}
                {section.type === 'skills' && <Wrench size={14} />}
                {section.type === 'awards' && <Trophy size={14} />}
                {section.type === 'certifications' && <Award size={14} />}
                {section.type === 'languages' && <Languages size={14} />}
                {section.type === 'custom' && <Layers size={14} />}
              </span>
              <input 
                type="text"
                value={section.title}
                onChange={(e) => {
                  const updated = [...data.sections];
                  updated[sIdx].title = e.target.value.toUpperCase();
                  onChange({ ...data, sections: updated });
                }}
                className="bg-transparent text-xs font-mono tracking-wider font-bold text-white focus:outline-none border-b border-transparent focus:border-neutral-700"
              />
            </div>
            <button onClick={() => removeSection(section.id)} className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>

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

            <button 
              onClick={() => addSectionItem(sIdx)}
              className="w-full py-2 bg-neutral-950 border border-dashed border-neutral-800 rounded-lg flex items-center justify-center gap-1.5 text-neutral-400 hover:border-neutral-700 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <Plus size={12} />
              <span>Add Entry to Group</span>
            </button>
          </div>
        </div>
      ))}

      <SectionCreatorDeck onAddSection={addSection} />
    </div>
  );
};