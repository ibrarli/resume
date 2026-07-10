import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select Option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Reset search filter query when dropdown visibility changes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  // Memoize filtered items to prevent computation overhead during typing loops
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter(opt =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <div ref={containerRef} className="relative w-full font-body text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full bg-background border-2 border-foreground/10 rounded-xl px-3 text-foreground/80 hover:text-foreground text-left transition-colors cursor-pointer focus:outline-none focus:border-primary ${className}`}
      >
        <span className={!selectedOption ? "text-foreground/40" : "text-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-background border-2 border-foreground/10 rounded-xl shadow-xl z-[60] flex flex-col overflow-hidden max-h-56">
          
          {/* Integrated Search Inline Header */}
          <div className="p-1 border-b border-foreground/5 sticky top-0 bg-background z-10 flex items-center gap-1.5 px-2">
            <Search size={12} className="text-foreground/40 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full py-1.5 bg-transparent text-xs text-foreground placeholder:text-foreground/30 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-foreground/40 hover:text-foreground p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <ul className="overflow-y-auto p-1 space-y-0.5 flex-1 max-h-40">
            {/* Unselect / Clear Selection Action Trigger */}
            {value && !searchQuery && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Clear Selection</span>
                </button>
              </li>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer font-medium ${
                      value === opt.value ? 'bg-foreground/5 text-primary' : 'text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center py-3 text-foreground/40 font-medium">
                No matches found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};