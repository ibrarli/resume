import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, MoreVertical, Check, Palette } from 'lucide-react';

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
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const themeOptions: { value: ExtendedThemeUnion; label: string }[] = [
    { value: 'minimalist', label: '1. Default Minimalist' },
    { value: 'left-aligned', label: '2. Left Aligned Dynamic' },
    { value: 'colorful', label: '3. Colorful Indigo' },
    { value: 'modern', label: '4. Modern Serif' },
    { value: 'compact', label: '5. Developer Compact' },
    { value: 'emerald-executive', label: '6. Emerald Executive' },
    { value: 'slate-sidebar', label: '7. Slate Left Sidebar' },
    { value: 'warm-editorial', label: '8. Warm Editorial' },
    { value: 'tech-minimal', label: '9. Tech Terminal Minimal' },
    { value: 'royal-accent', label: '10. Royal Sky Trim' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setThemeDropdownOpen(false);
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
        <div className="hidden md:flex items-center gap-3 relative">
          {/* Custom Desktop Dropdown Container */}
          <button
            type="button"
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="flex items-center justify-between gap-2 border border-foreground/10 bg-background text-foreground/80 rounded-xl px-3 h-9 text-xs font-medium font-body focus:outline-none focus:border-primary cursor-pointer transition-colors w-52 text-left"
          >
            <span className="truncate">
              {themeOptions.find((t) => t.value === activeTheme)?.label}
            </span>
            <span className="text-[10px] text-foreground/40">▼</span>
          </button>

          {themeDropdownOpen && (
            <div className="absolute top-11 left-0 w-56 bg-background border-2 border-foreground/10 rounded-xl shadow-xl z-50 p-1.5 max-h-80 overflow-y-auto custom-scrollbar space-y-0.5 animate-fade-in">
              {themeOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    onThemeChange(t.value);
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between font-body ${
                    activeTheme === t.value 
                      ? 'bg-primary text-dark-neutral font-bold' 
                      : 'hover:bg-foreground/5 text-foreground/80'
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  {activeTheme === t.value && <Check size={12} className="shrink-0" />}
                </button>
              ))}
            </div>
          )}

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
            <div className="absolute right-0 mt-2 w-60 bg-background border-2 border-foreground/10 rounded-2xl p-2 shadow-xl z-50 space-y-2 animate-in fade-in slide-in-from-top-1 duration-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {/* Custom Mobile Layout List Menu */}
              <div className="space-y-1 px-1">
                <span className="text-[9px] font-bold tracking-widest text-foreground/40 font-heading uppercase flex items-center gap-1.5 py-1">
                  <Palette size={10} /> Select Template Layout
                </span>
                
                <div className="space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar border border-foreground/5 rounded-xl p-1 bg-foreground/[0.01]">
                  {themeOptions.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        onThemeChange(t.value);
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between font-body ${
                        activeTheme === t.value 
                          ? 'bg-primary text-dark-neutral font-bold' 
                          : 'hover:bg-foreground/5 text-foreground/80'
                      }`}
                    >
                      <span className="truncate">{t.label.replace(/^\d+\.\s*/, '')}</span>
                      {activeTheme === t.value && <Check size={11} className="shrink-0" />}
                    </button>
                  ))}
                </div>
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