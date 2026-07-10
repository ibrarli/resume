import React, { useState, useRef, useEffect } from 'react';

interface CommandAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  suggestions?: string[]; // Used for Email domains
  filterOptions?: { label: string; value: string }[]; // Used for Cities
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const CommandAutocomplete: React.FC<CommandAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  suggestions = [],
  filterOptions = [],
  onBlur,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Cleaned Email Autocomplete Parsing
  let dynamicSuggestions: string[] = [];
  if (suggestions.length > 0 && value.trim().length > 0) {
    const atIndex = value.indexOf('@');
    
    if (atIndex === -1) {
      // User hasn't typed @ yet, offer domains appended to current typing
      dynamicSuggestions = suggestions.map(domain => `${value}${domain}`);
    } else {
      // User typed @, filter domains based on what follows the @ symbol
      const localPart = value.substring(0, atIndex);
      const domainPart = value.substring(atIndex); // e.g., "@g"
      
      dynamicSuggestions = suggestions
        .filter(domain => domain.startsWith(domainPart))
        .map(domain => `${localPart}${domain}`);
    }
    // Prevent showing exact match duplicates
    dynamicSuggestions = dynamicSuggestions.filter(s => s !== value);
  }

  // 2. City Search/Filter Parsing
  const filteredDataOptions = filterOptions.filter(opt =>
    opt.label.toLowerCase().includes(value.toLowerCase())
  );

  const hasSuggestions = dynamicSuggestions.length > 0 || (filterOptions.length > 0 && filteredDataOptions.length > 0);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur(e);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onBlur={handleInputBlur}
        className={className}
      />

      {isOpen && hasSuggestions && (
        <ul className="absolute left-0 mt-1 w-full bg-background border-2 border-foreground/10 rounded-xl shadow-xl max-h-48 overflow-y-auto z-[60] p-1 space-y-0.5 font-body text-xs">
          
          {/* Render Email Recommendations */}
          {dynamicSuggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-foreground/5 text-foreground transition-colors cursor-pointer font-medium"
              >
                {suggestion}
              </button>
            </li>
          ))}

          {/* Render Filtered City Options */}
          {filterOptions.length > 0 && filteredDataOptions.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-foreground/5 text-foreground transition-colors cursor-pointer font-medium"
              >
                {opt.label}
              </button>
            </li>
          ))}
          
          {/* No Search Results Fallback State for Cities */}
          {filterOptions.length > 0 && filteredDataOptions.length === 0 && (
            <li className="px-3 py-2 text-foreground/40 select-none italic text-[11px]">
              No matching locations found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};