import { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Start typing your address...",
  required = false,
  className = "",
  name = "address" // Add name prop
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Search address using OpenStreetMap Nominatim API
  const searchAddress = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gb&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const addressSuggestions = data.map(item => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address
      }));
      
      setSuggestions(addressSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      searchAddress(query);
    }, 300),
    [searchAddress]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Create proper event for parent
    const event = {
      target: {
        name: name,
        value: value
      }
    };
    
    onChange(event); // Pass the proper event to parent
    
    // Trigger search for suggestions
    debouncedSearch(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    // Create a proper event for the parent
    const event = {
      target: {
        name: name,
        value: suggestion.display_name
      }
    };
    
    onChange(event); // Update the input value
    onSelect?.(suggestion); // Call optional onSelect callback with full suggestion data
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && value && value.length >= 3) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Use setTimeout to allow click event on suggestions to fire first
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    const event = {
      target: {
        name: name,
        value: ''
      }
    };
    onChange(event);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value || ''}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Clear button when not loading */}
      {!isLoading && value && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={handleClear}
        >
          ✕
        </button>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="text-sm font-medium text-gray-800 mb-1">
                {suggestion.address?.road || suggestion.address?.house_number ? 
                  `${suggestion.address.house_number || ''} ${suggestion.address.road || ''}`.trim() 
                  : suggestion.display_name.split(',')[0]
                }
              </div>
              <div className="text-xs text-gray-500">
                {suggestion.display_name.split(',').slice(1).join(',').trim()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && !isLoading && value && value.length >= 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            No addresses found. Please try a different search term.
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;