import React from 'react';

interface SummaryBlockProps {
  summary: string;
  onChange: (value: string) => void;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary, onChange }) => {
  const CHARACTER_LIMIT = 500;

  const handleTextChange = (val: string) => {
    let processedText = val;
    // Capitalize the first letter of the paragraph
    if (processedText.length > 0) {
      processedText = processedText.charAt(0).toUpperCase() + processedText.slice(1);
    }
    onChange(processedText);
  };

  const currentLength = summary.length;
  const isOverLimit = currentLength > CHARACTER_LIMIT;

  return (
    <div className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
          Executive Target Summary
        </h3>
        <span className={`text-[10px] font-mono font-medium tracking-wide transition-colors ${
          isOverLimit ? 'text-red-500 font-bold' : currentLength >= CHARACTER_LIMIT * 0.9 ? 'text-amber-500' : 'text-foreground/40'
        }`}>
          {currentLength} / {CHARACTER_LIMIT} characters
        </span>
      </div>
      <textarea 
        rows={4}
        placeholder="Write a clear, metrics-driven professional summary focusing on core technical proficiencies..."
        value={summary}
        onChange={(e) => handleTextChange(e.target.value)}
        className={`w-full bg-background border-2 rounded-xl p-3 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors resize-none font-body leading-relaxed text-justify ${
          isOverLimit ? 'border-red-500/50 focus:border-red-500' : 'border-foreground/10 focus:border-primary'
        }`}
      />
    </div>
  );
};