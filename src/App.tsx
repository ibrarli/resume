import React, { useState } from 'react';
import { Plus, Download, Upload, Eye, EyeOff, Trash2 } from 'lucide-react';
import { type ResumeData, type DynamicSection } from './types';

// Initial state matching your uploaded default theme
const initialData: ResumeData = {
  personalInfo: {
    fullName: "IBRAR ALI",
    title: "Fullstack Developer",
    email: "ibraralihaidar@gmail.com",
    phone: "+923482167078",
    location: "Quetta, Pakistan",
    website: "ibrar.apenapps.com",
    links: [
      { platform: "GitHub", url: "github.com/ibrarli" },
      { platform: "LinkedIn", url: "linkedin.com/in/ibrarli" }
    ]
  },
  summary: "Full-Stack Developer with 3 years experience building scalable web apps...",
  sections: [
    {
      id: "exp-1",
      title: "PROFESSIONAL EXPERIENCE",
      type: "list",
      items: [
        {
          id: "item-1",
          title: "Full-Stack Developer",
          subtitle: "Apex Tech Hub",
          dateRange: "Dec 2025 - Present",
          description: "Revamped Apex Tech Hub entire website with better User Interface and User Experience..."
        }
      ]
    }
  ]
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTheme, setActiveTheme] = useState<'minimalist' | 'modern' | 'compact'>('minimalist');

  const handlePrint = () => {
    window.print();
  };

  const addSection = () => {
    const newSection: DynamicSection = {
      id: `custom-${Date.now()}`,
      title: "NEW SECTION",
      type: "list",
      items: []
    };
    setResumeData({ ...resumeData, sections: [...resumeData.sections, newSection] });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // TODO: Integrate client-side PDF text parser (e.g., pdfjs-dist)
    console.log("Parsing file:", file.name);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
      {/* Top Navigation Control Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-wider text-slate-900">APEN RESUME</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">v1.0.0</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Selector */}
          <select 
            value={activeTheme} 
            onChange={(e: any) => setActiveTheme(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white font-medium"
          >
            <option value="minimalist">Default Minimalist</option>
            <option value="modern">Modern (Serif)</option>
            <option value="compact">Developer Compact</option>
          </select>

          {/* Upload Existing */}
          <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition">
            <Upload size={16} />
            <span>Upload Existing</span>
            <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          </label>

          {/* Export PDF via Print */}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-800 transition"
          >
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split Screen Layout */}
      <div className="flex-1 flex print:block">
        {/* Left Side: Form Editor Panel */}
        <div className="w-1/2 h-[calc(100vh-4rem)] overflow-y-auto p-6 border-r border-slate-200 bg-white print:hidden">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Resume Details</h2>
          
          {/* Personal Info Group */}
          <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider mb-4">Personal Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                })}
                className="p-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-900"
              />
              <input 
                type="text" 
                placeholder="Job Title"
                value={resumeData.personalInfo.title}
                onChange={(e) => setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                })}
                className="p-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Dynamic Section Builder */}
          {resumeData.sections.map((section, sIndex) => (
            <div key={section.id} className="border border-slate-200 rounded-xl p-4 mb-4 relative">
              <div className="flex justify-between items-center mb-3">
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => {
                    const nextSections = [...resumeData.sections];
                    nextSections[sIndex].title = e.target.value.toUpperCase();
                    setResumeData({ ...resumeData, sections: nextSections });
                  }}
                  className="font-bold text-sm uppercase tracking-wide border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    const nextSections = resumeData.sections.filter(s => s.id !== section.id);
                    setResumeData({ ...resumeData, sections: nextSections });
                  }}
                  className="text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {/* Contextual form inputs would go here based on section.type */}
            </div>
          ))}

          <button 
            onClick={addSection}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition font-medium text-sm"
          >
            <Plus size={16} />
            <span>Add Custom Section</span>
          </button>
        </div>

        {/* Right Side: Document Real-time Live Preview */}
        <div className="w-1/2 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-500/10 flex justify-center p-8 print:w-full print:h-auto print:bg-white print:p-0">
          <div className={`w-[210mm] min-h-[297mm] bg-white shadow-2xl p-12 print:shadow-none print:p-0 font-sans theme-${activeTheme}`}>
            {/* Real-time Rendered Target Blueprint Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-light tracking-widest text-slate-900 uppercase">{resumeData.personalInfo.fullName}</h1>
              <p className="text-sm font-medium text-slate-600 tracking-wide mt-1">{resumeData.personalInfo.title}</p>
              
              <div className="flex justify-center gap-3 text-xs text-slate-500 mt-3 flex-wrap">
                <span>{resumeData.personalInfo.location}</span>
                <span>•</span>
                <span>{resumeData.personalInfo.email}</span>
                <span>•</span>
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            </div>

            <hr className="border-slate-200 my-4" />

            {/* Profile Summary rendering */}
            {resumeData.summary && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Professional Summary</h2>
                <p className="text-xs leading-relaxed text-slate-700 text-justify">{resumeData.summary}</p>
              </div>
            )}

            {/* Dynamic sections rendering */}
            {resumeData.sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{item.title}</span>
                        <span className="font-normal text-slate-500">{item.dateRange}</span>
                      </div>
                      {item.subtitle && <div className="text-slate-600 italic mt-0.5">{item.subtitle}</div>}
                      {item.description && <p className="text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}