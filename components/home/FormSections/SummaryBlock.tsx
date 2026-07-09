import React from 'react';

interface SummaryBlockProps {
  summary: string;
  onChange: (value: string) => void;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary, onChange }) => {
  return (
    <div className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-3">
      <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
        Executive Target Summary
      </h3>
      <textarea 
        rows={4}
        placeholder="Write a clear, metrics-driven professional summary focusing on core technical proficiencies..."
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border-2 border-foreground/10 rounded-xl p-3 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none font-body leading-relaxed text-justify"
      />
    </div>
  );
};