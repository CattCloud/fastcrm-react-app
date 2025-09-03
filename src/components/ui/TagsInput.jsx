import { useState } from 'react';
import { X } from 'lucide-react';

export const TagsInput = ({ tags, onChange, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  const addTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    console.log('[TagsInput] Intentando agregar etiqueta:', normalizedTag);

    if (normalizedTag && !tags.includes(normalizedTag)) {
      const nuevas = [...tags, normalizedTag];
      console.log('[TagsInput] Etiquetas actualizadas:', nuevas);
      onChange(nuevas);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    console.log('[TagsInput] Eliminando etiqueta:', tagToRemove);
    const nuevas = tags.filter(tag => tag !== tagToRemove);
    console.log('[TagsInput] Etiquetas después de eliminar:', nuevas);
    onChange([...nuevas]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[42px] p-2 border border-[#E3F2FD] rounded-md bg-white flex flex-wrap gap-2 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[#E3F2FD] text-[#0D47A1] rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[#546E7A] hover:text-[#F44336] ml-1"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="flex-1 min-w-[120px] outline-none text-[#263238] placeholder-[#90A4AE]"
          placeholder={tags.length === 0 ? "Agregar etiquetas..." : ""}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#E3F2FD] rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)]">
          <div className="p-2 text-xs text-[#546E7A] border-b border-[#F8FAFC]">Sugerencias:</div>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => addTag(suggestion)}
              className="w-full px-3 py-2 text-left text-sm text-[#263238] hover:bg-[#F8FAFC] flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#00E676] rounded-full"></span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
