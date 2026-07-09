import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, MoreVertical, Settings } from 'lucide-react';

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

interface NavbarProps {
  activeTheme: ExtendedThemeUnion;
  onThemeChange: (theme: ExtendedThemeUnion) => void;
  onExport: () => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTheme,
  onThemeChange,
  onExport,
  onPdfUpload,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-50 print:hidden h-16 flex items-center justify-between px-4 sm:px-6 border-b border-foreground/5">
      
      {/* Brand & Logo Section */}
      <div className="flex items-center gap-2">
        <img
          src="/logo/resume_logo.svg"
          alt="Apen Resume Icon"
          className="block dark:hidden w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
        <img
          src="/logo/resume_logo_dark.svg"
          alt="Apen Resume Icon"
          className="hidden dark:block w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
        <div className="flex items-baseline">
          <span className="text-base sm:text-xl font-bold tracking-tight text-foreground font-heading whitespace-nowrap">
            Apen <span className="text-primary">Resume</span>
          </span>
        </div>
      </div>
      
      {/* Controls Container */}
      <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
        
        {/* ==========================================
           DESKTOP ONLY VIEW CONTROLS (Hidden on Mobile)
           ========================================== */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Selector */}
          <select 
            value={activeTheme} 
            onChange={(e) => onThemeChange(e.target.value as ExtendedThemeUnion)}
            className="border border-foreground/10 bg-background text-foreground/80 rounded-xl px-3 py-1.5 text-xs font-medium font-body focus:outline-none focus:border-primary cursor-pointer transition-colors"
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

          {/* Parse PDF Action */}
          <label className="flex items-center gap-2 px-4 h-9 border-2 border-foreground/10 hover:border-foreground/30 bg-background rounded-xl text-xs font-bold font-body text-foreground/80 hover:text-foreground cursor-pointer transition-colors">
            <Upload size={14} />
            <span>Parse Existing (.pdf)</span>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={onPdfUpload} 
              className="hidden" 
              onClick={(e: any) => { e.target.value = null }} 
            />
          </label>
        </div>

        {/* ==========================================
           PROMINENT EXPORT ACTION (Visible Everywhere)
           ========================================== */}
        <button 
          type="button"
          onClick={onExport}
          className="flex items-center justify-center gap-2 bg-primary text-dark-neutral px-4 sm:px-5 h-9 rounded-xl text-xs font-bold font-body transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
        >
          <Download size={14} />
          <span>Export Resume</span>
        </button>

        {/* ==========================================
           MOBILE ONLY DRAWER MENU (Hidden on Desktop)
           ========================================== */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center justify-center w-9 h-9 border-2 rounded-xl transition-colors cursor-pointer ${
              menuOpen 
                ? 'border-primary text-foreground bg-foreground/5' 
                : 'border-foreground/10 text-foreground/70 bg-background'
            }`}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-background border-2 border-foreground/10 rounded-2xl p-2.5 shadow-xl z-50 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-100">
              
              {/* Mobile Layout Switcher Dropdown */}
              <div className="space-y-1 px-1">
                <span className="text-[9px] font-bold tracking-widest text-foreground/40 font-heading uppercase flex items-center gap-1.5">
                  <Settings size={10} /> Choose Layout Template
                </span>
                <select 
                  value={activeTheme} 
                  onChange={(e) => {
                    onThemeChange(e.target.value as ExtendedThemeUnion);
                    setMenuOpen(false);
                  }}
                  className="w-full border-2 border-foreground/10 bg-background text-foreground/80 rounded-xl px-2.5 py-1.5 text-xs font-medium font-body focus:outline-none focus:border-primary"
                >
                  <option value="minimalist">1. Minimalist</option>
                  <option value="left-aligned">2. Left Aligned</option>
                  <option value="colorful">3. Colorful Indigo</option>
                  <option value="modern">4. Modern Serif</option>
                  <option value="compact">5. Dev Compact</option>
                  <option value="emerald-executive">6. Emerald Exec</option>
                  <option value="slate-sidebar">7. Slate Sidebar</option>
                  <option value="warm-editorial">8. Warm Editorial</option>
                  <option value="tech-minimal">9. Tech Minimal</option>
                  <option value="royal-accent">10. Royal Sky</option>
                </select>
              </div>

              <div className="border-t border-foreground/5 my-1" />

              {/* Mobile PDF Upload Input Field */}
              <label className="flex items-center gap-2.5 w-full px-3 h-9 hover:bg-foreground/5 rounded-xl text-xs font-bold font-body text-foreground/70 hover:text-foreground cursor-pointer transition-colors">
                <Upload size={14} className="text-foreground/40" />
                <span>Parse Existing (.pdf)</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => {
                    onPdfUpload(e);
                    setMenuOpen(false);
                  }} 
                  className="hidden" 
                  onClick={(e: any) => { e.target.value = null }} 
                />
              </label>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};