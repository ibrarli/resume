import React from 'react';

interface SummaryBlockProps {
  summary: string;
  onChange: (value: string) => void;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary, onChange }) => {
  return (
    <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-3">
      <h3 className="text-xs font-mono tracking-wider text-neutral-400 uppercase">02 / Executive Target Summary</h3>
      <textarea 
        rows={4}
        placeholder="Write a clear, metrics-driven professional summary focusing on core technical proficiencies..."
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none leading-relaxed text-justify"
      />
    </div>
  );
};