import { useState, useEffect } from 'react';
import { Navbar } from '../components/global/Navbar';
import { FormEditor } from '../components/home/FormEditor';
import { ResumePreview } from '../components/home/ResumePreview';
import { Edit3, Eye } from 'lucide-react';
import type { ResumeData, DynamicSection, SectionItem } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const LOCAL_STORAGE_KEY = 'apen_resume_engine_cache';
const THEME_STORAGE_KEY = 'apen_resume_engine_theme';

const blankCanvasStructure: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    links: []
  },
  summary: '',
  sections: []
};

type ExtendedThemeUnion = 
  | 'minimalist' 
  | 'left-aligned' 
  | 'colorful' 
  | 'modern' 
  | 'compact'
  | 'emerald-executive'
  | 'slate-sidebar'
  | 'warm-editorial'
  | 'tech-minimal'
  | 'royal-accent';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : blankCanvasStructure;
    } catch (e) {
      console.error("Failed to parse cached canvas state:", e);
      return blankCanvasStructure;
    }
  });

  const [activeTheme, setActiveTheme] = useState<ExtendedThemeUnion>(() => {
    try {
      const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return (cachedTheme as ExtendedThemeUnion) || 'minimalist';
    } catch {
      return 'minimalist';
    }
  });

  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (resumeData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
    }
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
  }, [activeTheme]);

  const handlePrint = () => {
    window.print();
  };

  const generateSafeId = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `id_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  };

  const parseRawTextToLayout = (lines: string[]): ResumeData => {
    const parsed: ResumeData = {
      personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', website: '', links: [] },
      summary: '',
      sections: []
    };

    let currentSection: DynamicSection | null = null;
    let currentItem: SectionItem | null = null;
    let fallbackSummaryLines: string[] = [];

    const cleanLines = lines.map(l => l.trim()).filter(Boolean);

    if (cleanLines.length > 0) parsed.personalInfo.fullName = cleanLines[0];
    if (cleanLines.length > 1) parsed.personalInfo.title = cleanLines[1];

    cleanLines.forEach(line => {
      if (line.includes('@') && !parsed.personalInfo.email) {
        parsed.personalInfo.email = line.split(' ').find(w => w.includes('@')) || '';
      }
      if ((line.includes('+') || line.match(/\d{4}/)) && !parsed.personalInfo.phone) {
        const matches = line.match(/(\+\d[\d\s-]{7,15})/);
        if (matches) parsed.personalInfo.phone = matches[0].trim();
      }
      if (line.toLowerCase().includes('linkedin.com/')) {
        const url = line.split(' ').find(w => w.includes('linkedin.com')) || '';
        parsed.personalInfo.links.push({ id: generateSafeId(), platform: 'LinkedIn', url });
      }
      if (line.toLowerCase().includes('github.com/')) {
        const url = line.split(' ').find(w => w.includes('github.com')) || '';
        parsed.personalInfo.links.push({ id: generateSafeId(), platform: 'GitHub', url });
      }
    });

    let mode: 'NONE' | 'SUMMARY' | 'SECTION' = 'NONE';

    for (let i = 2; i < cleanLines.length; i++) {
      const line = cleanLines[i];
      const upperLine = line.toUpperCase();

      if (upperLine.includes('PROFESSIONAL SUMMARY') || upperLine.includes('SUMMARY')) {
        mode = 'SUMMARY';
        continue;
      }

      if (
        upperLine === 'PROFESSIONAL EXPERIENCE' || 
        upperLine === 'EXPERIENCE' || 
        upperLine === 'PROJECTS' || 
        upperLine === 'EDUCATION' || 
        upperLine === 'CERTIFICATIONS' || 
        upperLine === 'HONORS & AWARDS' || 
        upperLine === 'TECHNICAL SKILLS'
      ) {
        mode = 'SECTION';
        currentSection = { id: generateSafeId(), title: line, type: 'custom', items: [] };
        parsed.sections.push(currentSection);
        currentItem = null;
        continue;
      }

      if (mode === 'SUMMARY') {
        fallbackSummaryLines.push(line);
      } else if (mode === 'SECTION' && currentSection) {
        const hasDate = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i);
        
        if (!currentItem && !hasDate) {
          currentItem = { id: generateSafeId(), title: line, subtitle: '', startDate: '', endDate: '', location: '', description: '', formatMode: 'bullets' };
          currentSection.items.push(currentItem);
        } else if (currentItem && !currentItem.subtitle && hasDate) {
          currentItem.subtitle = line;
        } else if (currentItem) {
          currentItem.description = currentItem.description ? `${currentItem.description}\n${line}` : line;
        }
      }
    }

    parsed.summary = fallbackSummaryLines.join(' ');
    return parsed;
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      let rawLines: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const lines = textContent.items.map((item: any) => item.str);
        rawLines = [...rawLines, ...lines];
        fullText += lines.join(' ');
      }

      const sanitizedText = fullText.replace(/\s+/g, '');
      
      const match = 
        sanitizedText.match(/APNRSMSTART(.*?)_END/) ||
        sanitizedText.match(/STRUCTURAL_SYSTEM_MANIFEST_DATA_START_(.*?)_DATA_END/);

      if (match && match[1]) {
        try {
          const base64Data = match[1].replace(/[^A-Za-z0-9+/=]/g, '');
          const decoded = atob(base64Data);
          let decodedJson: string;
          try {
            decodedJson = decodeURIComponent(escape(decoded));
          } catch {
            const bytes = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));
            decodedJson = new TextDecoder('utf-8').decode(bytes);
          }
          const parsedData: ResumeData = JSON.parse(decodedJson);
          setResumeData(parsedData);
          alert('🎉 Resume restored successfully!');
        } catch (decodeError) {
          console.error('Decode failed:', decodeError);
          const reconstructedData = parseRawTextToLayout(rawLines);
          setResumeData(reconstructedData);
          alert('✨ Canvas reconstructed from visible text (metadata decode failed).');
        }
      } else {
        const reconstructedData = parseRawTextToLayout(rawLines);
        setResumeData(reconstructedData);
        alert('✨ Canvas Layout Dynamically Reconstructed from Visible Document Tracks!');
      }
    } catch (error) {
      console.error("Hydration processing failure details:", error);
      alert('❌ Failed to process document layout configuration.');
    }
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden print:h-auto print:w-auto print:bg-white print:text-black print:overflow-visible">
      <Navbar 
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        onExport={handlePrint}
        onPdfUpload={handlePdfUpload}
      />

      <div className="flex-1 flex flex-col md:flex-row print:block overflow-hidden print:overflow-visible relative pb-16 md:pb-0">
        
        {/* Editor Form Workspace Panel - Strictly hidden during print regardless of active dynamic mobile states */}
        <div className={`w-full h-full md:w-1/2 overflow-y-auto p-4 md:p-6 bg-background md:border-r border-foreground/10 print:!hidden ${
          activeMobileTab === 'edit' ? 'block' : 'hidden md:block'
        }`}>
          <FormEditor data={resumeData} onChange={setResumeData} />
        </div>

        {/* Live Document Preview Monitor - Strip mobile transforms, margins, scaling, and hidden states on print */}
        <div className={`w-full h-full md:w-1/2 overflow-y-auto flex justify-center p-4 md:p-8 max-sm:scale-90 max-sm:origin-top ${
          activeMobileTab === 'preview' ? 'flex' : 'hidden md:flex'
        } print:!flex print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible print:scale-100 print:transform-none`}>
          <div className="h-fit print:w-full print:h-auto">
            <ResumePreview data={resumeData} theme={activeTheme} />
          </div>
        </div>

        {/* Persistent Micro-Dock Mobile View Controls - Enforced complete removal on print */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border-2 border-foreground/10 rounded-2xl p-1 flex items-center gap-1 z-50 md:hidden shadow-lg print:hidden">
          <button
            type="button"
            onClick={() => setActiveMobileTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body flex items-center gap-2 transition-all cursor-pointer ${
              activeMobileTab === 'edit' 
                ? 'bg-primary text-dark-neutral' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Edit3 size={13} />
            <span>Editor</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body flex items-center gap-2 transition-all cursor-pointer ${
              activeMobileTab === 'preview' 
                ? 'bg-primary text-dark-neutral' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>

      </div>
    </div>
  );
}