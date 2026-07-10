import React from 'react';
import type { ResumeData } from '../../types';

interface ResumePreviewProps {
  data: ResumeData;
  theme: 
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
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme }) => {
  // Comprehensive theme-to-font map using native web-safe stacks
  const themeClasses = {
    minimalist: 'style-sans text-neutral-900 tracking-normal text-sm',
    'left-aligned': 'style-sans text-neutral-900 tracking-normal text-sm',
    colorful: 'style-sans text-slate-900 tracking-normal text-sm',
    // Defaulting strictly to high-fidelity Times New Roman / Georgia configurations
    modern: 'text-slate-900 tracking-wide text-sm style-serif',
    compact: 'style-mono text-black tracking-tight text-[12px]',
    'emerald-executive': 'style-sans text-stone-900 tracking-normal text-sm',
    'slate-sidebar': 'style-sans text-slate-900 tracking-normal text-sm',
    'warm-editorial': 'text-amber-950 tracking-normal text-sm bg-stone-50/10 style-serif',
    'tech-minimal': 'style-mono text-neutral-900 tracking-tight text-[13px]',
    'royal-accent': 'style-sans text-slate-900 tracking-normal text-sm'
  };

  const cleanPhone = data.personalInfo.phone.replace(/[^+\d]/g, '');

  const isCentered = theme === 'minimalist' || theme === 'modern';
  const isColorful = theme === 'colorful';
  const isEmerald = theme === 'emerald-executive';
  const isSlateSidebar = theme === 'slate-sidebar';
  const isWarmEditorial = theme === 'warm-editorial';
  const isTechMinimal = theme === 'tech-minimal';
  const isRoyal = theme === 'royal-accent';

  return (
    <div className="relative flex flex-col items-center w-full overflow-x-auto p-4 md:p-0 print:overflow-visible print:p-0">
      
      {/* Explicit style tokens ensuring total control over typography without relying on global framework defaults */}
      <style>{`
        .style-serif {
          font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", Times, Georgia, serif !important;
        }
        .style-sans {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
        }
        .style-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        }
        /* Overriding any upstream layout constraints affecting font-headings */
        .resume-canvas h1, .resume-canvas h2, .resume-canvas h3, .resume-canvas h4 {
          font-family: inherit !important;
        }
      `}</style>

      {/* SCREEN ONLY: A4 Page Break Guide Overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-start print:hidden mx-auto hidden md:flex">
        <div className="w-[210mm] h-[297mm] border-b-2 border-dashed border-red-500/40 relative">
          <span className="absolute bottom-1 right-2 text-[10px] font-mono text-red-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
            PAGE 1 CUTOFF (297mm)
          </span>
        </div>
        <div className="w-[210mm] h-[297mm] border-b-2 border-dashed border-red-500/40 relative">
          <span className="absolute bottom-1 right-2 text-[10px] font-mono text-red-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
            PAGE 2 CUTOFF (594mm)
          </span>
        </div>
      </div>

      {/* Actual A4 Document Canvas Wrapper Layer */}
      <div className="w-full max-w-full md:w-[210mm] overflow-x-auto md:overflow-visible print:overflow-visible">
        <div className={`resume-canvas w-[210mm] min-h-[297mm] bg-white text-neutral-900 shadow-2xl p-6 sm:p-12 relative flex flex-col justify-between border border-neutral-200 print:shadow-none print:border-none print:p-0 ${themeClasses[theme]}`}>
          
          <div className={`flex-1 ${isSlateSidebar ? 'grid grid-cols-[1fr_2.5fr] gap-4 sm:gap-8 -mx-2 sm:-mx-4' : 'flex flex-col gap-5'}`}>
            
            {/* SIDEBAR BLOCK */}
            {isSlateSidebar && (
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl print:bg-slate-100 flex flex-col gap-5 h-full">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{data.personalInfo.fullName || "YOUR NAME"}</h2>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wider">{data.personalInfo.title || "Headline"}</p>
                </div>
                
                <div className="flex flex-col gap-2 text-[11px] sm:text-[12px] text-slate-600 break-all">
                  {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                  {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="hover:underline text-slate-800">{data.personalInfo.email}</a>}
                  {data.personalInfo.phone && <a href={`tel:${cleanPhone}`} className="hover:underline text-slate-800">{data.personalInfo.phone}</a>}
                  {data.personalInfo.website && <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">{data.personalInfo.website}</a>}
                </div>

                {data.personalInfo.links.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-200 text-[10px] sm:text-[11px]">
                    {data.personalInfo.links.map((link) => link.platform && link.url && (
                      <a key={link.id} href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noreferrer" className="hover:underline text-slate-600 truncate">
                        <span className="font-bold text-slate-700">{link.platform}:</span> {link.url}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MAIN COLUMN BODY ZONE */}
            <div className="w-full flex flex-col gap-5">
              {!isSlateSidebar && (
                <div 
                  className={`pb-4 border-b ${
                    isColorful ? 'border-indigo-200 bg-indigo-50/30 px-4 sm:px-12 pt-4' : 
                    isEmerald ? 'border-emerald-600 border-b-2' :
                    isWarmEditorial ? 'border-amber-900/20' :
                    isTechMinimal ? 'border-neutral-900 border-b-2' :
                    isRoyal ? 'border-b border-sky-100 bg-gradient-to-r from-sky-50/40 via-white to-transparent pt-2' :
                    'border-neutral-300'
                  } ${isCentered ? 'text-center' : 'text-left'}`}
                  style={isColorful ? { marginLeft: '-3rem', marginRight: '-3rem' } : undefined}
                >
                  <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight uppercase m-0 ${
                    isColorful ? 'text-indigo-900' : 
                    isEmerald ? 'text-emerald-800 normal-case' :
                    isWarmEditorial ? 'text-amber-950 normal-case tracking-normal' :
                    isTechMinimal ? 'text-neutral-900 tracking-tighter' :
                    isRoyal ? 'text-slate-900 border-l-4 border-sky-600 pl-3' :
                    'text-neutral-900'
                  }`}>
                    {data.personalInfo.fullName || "YOUR NAME"}
                  </h1>
                  
                  <p className={`text-xs sm:text-sm font-semibold tracking-wider mt-1 uppercase ${
                    isColorful ? 'text-indigo-600' : 
                    isEmerald ? 'text-emerald-600 tracking-wide' :
                    isWarmEditorial ? 'text-stone-600 italic normal-case' :
                    isTechMinimal ? 'text-neutral-500 text-xs' :
                    isRoyal ? 'text-sky-700 tracking-wide pl-4' :
                    'text-neutral-600'
                  }`}>
                    {data.personalInfo.title || "Target Professional Headline"}
                  </p>
                  
                  <div className={`flex flex-wrap items-center gap-x-2 text-[12px] sm:text-[13px] mt-2.5 ${isCentered ? 'justify-center' : 'justify-start'} ${isColorful ? 'text-slate-600' : 'text-neutral-500'}`}>
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.email && (
                      <>
                        {data.personalInfo.location && <span>•</span>}
                        <a href={`mailto:${data.personalInfo.email}`} className="hover:underline font-medium print:no-underline">{data.personalInfo.email}</a>
                      </>
                    )}
                    {data.personalInfo.phone && (
                      <>
                        {(data.personalInfo.location || data.personalInfo.email) && <span>•</span>}
                        <a href={`tel:${cleanPhone}`} className="hover:underline font-medium print:no-underline">{data.personalInfo.phone}</a>
                      </>
                    )}
                    {data.personalInfo.website && (
                      <>
                        {(data.personalInfo.location || data.personalInfo.email || data.personalInfo.phone) && <span>•</span>}
                        <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline font-medium print:no-underline">{data.personalInfo.website}</a>
                      </>
                    )}
                  </div>

                  {data.personalInfo.links.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-x-2 text-[11px] sm:text-[11.5px] mt-1.5 ${isCentered ? 'justify-center' : 'justify-start'}`}>
                      {data.personalInfo.links.map((link, idx) => link.platform && link.url && (
                        <React.Fragment key={link.id}>
                          {idx > 0 && <span className="text-neutral-300">|</span>}
                          <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noreferrer" className="hover:underline font-medium print:no-underline text-neutral-500">
                            <span className="font-semibold text-neutral-600">{link.platform}:</span> {link.url}
                          </a>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Executive Summary Block */}
              {data.summary && (
                <div className="print:break-inside-avoid">
                  <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase mb-1.5 pb-0.5 border-b print:break-after-avoid ${
                    isColorful ? 'text-indigo-900 border-indigo-200' : 
                    isEmerald ? 'text-emerald-800 border-emerald-100' :
                    isWarmEditorial ? 'text-amber-950 border-amber-900/20 normal-case italic' :
                    isTechMinimal ? 'text-neutral-900 border-neutral-900' :
                    isRoyal ? 'text-slate-900 border-sky-100' :
                    'text-neutral-900 border-neutral-100'
                  }`}>
                    Professional Summary
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-neutral-700 leading-relaxed text-justify block">
                    {data.summary}
                  </p>
                </div>
              )}

              {/* Main Content Sections */}
              {data.sections.map((section) => section.items.length > 0 && (
                <div key={section.id} className="print:break-inside-auto">
                  <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 pb-0.5 border-b print:break-after-avoid ${
                    isColorful ? 'text-indigo-900 border-indigo-200' : 
                    isEmerald ? 'text-emerald-800 border-emerald-100' :
                    isWarmEditorial ? 'text-amber-950 border-amber-900/20 normal-case' :
                    isTechMinimal ? 'text-neutral-900 border-neutral-900' :
                    isRoyal ? 'text-slate-900 border-sky-200' :
                    'text-neutral-900 border-neutral-200'
                  }`}>
                    {section.title}
                  </h3>
                  
                  <div className="space-y-3.5">
                    {section.items.map((item) => (
                      <div key={item.id} className="break-inside-avoid print:break-inside-avoid mt-2">
                        <div className="flex justify-between items-baseline font-bold text-neutral-800 flex-wrap gap-1">
                          <span className={`text-[12.5px] sm:text-[13.5px] ${isColorful ? 'text-slate-900' : isEmerald ? 'text-emerald-950' : ''}`}>
                            {item.title || "Entry Title / Group Header"}
                          </span>
                          {(item.startDate || item.endDate) && (
                            <span className="font-normal text-neutral-500 text-[10.5px] sm:text-[11.5px] whitespace-nowrap">
                              {item.startDate} {item.endDate ? `— ${item.endDate}` : ''}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-baseline text-neutral-600 font-medium text-[11.5px] sm:text-[12.5px] mt-0.5 flex-wrap gap-1">
                          <span className={isColorful ? 'text-indigo-900/80' : isEmerald ? 'text-emerald-800/90' : isWarmEditorial ? 'text-amber-900' : ''}>
                            {item.subtitle}
                          </span>
                          {item.location && <span className="font-normal italic text-neutral-500 text-[10px] sm:text-[11px] whitespace-nowrap">{item.location}</span>}
                        </div>

                        {item.description && (
                          item.formatMode === 'bullets' ? (
                            <ul className="list-disc list-outside pl-4 mt-1.5 text-neutral-600 leading-relaxed text-justify space-y-1">
                              {item.description.split('\n').map((line, lIdx) => line.trim() && (
                                <li key={lIdx} className="text-[12px] sm:text-[13px] pl-1">
                                  {line.replace(/^[•\-\*]\s*/, '')}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-neutral-600 mt-1.5 leading-relaxed text-justify whitespace-pre-wrap text-[12px] sm:text-[13px]">
                              {item.description}
                            </p>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* HIDDEN METADATA CAPTURE PORT */}
          <div 
            className="absolute bottom-0 left-0 pointer-events-none select-none print:block"
            style={{ 
              fontSize: '1px', 
              color: 'transparent', 
              backgroundColor: 'transparent',
              opacity: 0,
              width: '0px',
              height: '0px',
              overflow: 'hidden',
              zIndex: -9999,
              lineHeight: 0
            }}
            aria-hidden="true"
          >
            {`APNRSMSTART${btoa(unescape(encodeURIComponent(JSON.stringify(data))))}_END`}
          </div>
        </div>
      </div>
    </div>
  );
};