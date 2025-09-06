import { useState } from 'react';

export const CompanyInput = ({ value, onChange, suggestions = [], disabled = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      s.toLowerCase() !== inputValue.toLowerCase()
  );

  const handleSelect = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
          setShowSuggestions(e.target.value.length > 0);
        }}
        onFocus={() => setShowSuggestions(inputValue.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Ej: Acme Corp"
        disabled={disabled}
        className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] text-[#263238]"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#E3F2FD] rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)]">
          <div className="p-2 text-xs text-[#546E7A] border-b border-[#F8FAFC]">Sugerencias:</div>
          {filteredSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s)}
              className="w-full px-3 py-2 text-left text-sm text-[#263238] hover:bg-[#F8FAFC] flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#00E676] rounded-full"></span>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};