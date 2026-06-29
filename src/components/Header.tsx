import React from 'react';
import { Download, Upload } from 'lucide-react';

// Explicitly define the extended theme collection to align with App.tsx and ResumePreview.tsx
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

interface HeaderProps {
  activeTheme: ExtendedThemeUnion;
  onThemeChange: (theme: ExtendedThemeUnion) => void;
  onExport: () => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTheme,
  onThemeChange,
  onExport,
  onPdfUpload,
}) => {
  return (
    <header className="h-16 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-50 print:hidden">
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-wider text-white text-sm">APEN RESUME</span>
        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono"> v1.0.1</span>
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          value={activeTheme} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onThemeChange(e.target.value as ExtendedThemeUnion)}
          className="border border-neutral-700 bg-neutral-900 text-neutral-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="minimalist">1. Default Minimalist (Centered)</option>
          <option value="left-aligned">2. Left Aligned Dynamic</option>
          <option value="colorful">3. Colorful Indigo Accent</option>
          <option value="modern">4. Modern Serif (High Rank)</option>
          <option value="compact">5. Developer Compact (Mono)</option>
          <option value="emerald-executive">6. Emerald Executive</option>
          <option value="slate-sidebar">7. Slate Left Sidebar</option>
          <option value="warm-editorial">8. Warm Editorial Journal</option>
          <option value="tech-minimal">9. Tech Terminal Minimal</option>
          <option value="royal-accent">10. Royal Sky Trim</option>
        </select>

        <label className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 rounded-lg text-xs font-medium text-neutral-300 hover:text-white cursor-pointer transition">
          <Upload size={14} />
          <span>Parse Existing (.pdf)</span>
          <input type="file" accept=".pdf" onChange={onPdfUpload} className="hidden" onClick={(e: any) => { e.target.value = null }} />
        </label>

        <button 
          onClick={onExport}
          className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
        >
          <Download size={14} />
          <span>Export Resume</span>
        </button>
      </div>
    </header>
  );
};