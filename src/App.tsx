import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FormEditor } from './components/FormEditor';
import { ResumePreview } from './components/ResumePreview';
import type { ResumeData, DynamicSection, SectionItem } from './types';
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

  // Safe fallback ID generation to prevent runtime crashes over plain http/local IP addresses
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

     // Try both old and new marker formats
      const sanitizedText = fullText.replace(/\s+/g, '');
      
      const match = 
        sanitizedText.match(/APNRSMSTART(.*?)_END/) ||
        sanitizedText.match(/STRUCTURAL_SYSTEM_MANIFEST_DATA_START_(.*?)_DATA_END/);
      
      console.log('Raw text length:', fullText.length);
      console.log('Sanitized length:', sanitizedText.length);
      console.log('Marker found:', !!match);
      if (match) console.log('Base64 snippet:', match[1].substring(0, 80));

      if (match && match[1]) {
        try {
          const base64Data = match[1].replace(/[^A-Za-z0-9+/=]/g, '');
          const decoded = atob(base64Data);
          // Handle both old escape() method and new TextDecoder method
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
          // Fall through to raw text parsing
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
    <div className="h-screen w-screen bg-neutral-900 text-neutral-100 flex flex-col overflow-hidden print:h-auto print:w-auto print:bg-white print:text-black print:overflow-visible">
      <Header 
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        onExport={handlePrint}
        onPdfUpload={handlePdfUpload}
      />

      <div className="flex-1 flex flex-col md:flex-row print:block overflow-hidden print:overflow-visible">
        <div className="w-full h-1/2 md:w-1/2 md:h-full overflow-y-auto p-6 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 print:hidden">
          <FormEditor data={resumeData} onChange={setResumeData} />
        </div>

        <div className="w-full h-1/2 md:w-1/2 md:h-full overflow-y-auto bg-neutral-800/40 flex justify-center p-4 md:p-8 print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible">
          <div className="h-fit print:w-full print:h-auto">
            <ResumePreview data={resumeData} theme={activeTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}