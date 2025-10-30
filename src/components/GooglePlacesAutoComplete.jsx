import { useState, useEffect, useRef } from 'react';
import { placesApi } from '@/services/placesApi';

const GooglePlacesAutocomplete = ({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Start typing your address...',
  required = false,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch address suggestions from our backend API
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await placesApi.getAutocompleteSuggestions(input);
      
      if (data.status === 'OK' && data.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      } else if (data.status === 'ZERO_RESULTS') {
        setSuggestions([]);
        setShowSuggestions(true);
      } else {
        setError('Unable to fetch addresses. Please try again.');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setError('Failed to load addresses. Please check your connection.');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Get place details when an address is selected
  const fetchPlaceDetails = async (placeId) => {
    try {
      const data = await placesApi.getPlaceDetails(placeId);
      
      if (data.status === 'OK' && data.result) {
        return data.result;
      } else {
        throw new Error(data.error_message || 'Failed to get place details');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  };

  // Debounced input handler
  const handleInputChange = (e) => {
    const { value } = e.target;
    
    // Call parent's onChange immediately for form state update
    onChange(e);
    setError('');

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce (500ms delay)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  // Handle address selection
  const handleSuggestionClick = async (suggestion) => {
    try {
      const placeDetails = await fetchPlaceDetails(suggestion.place_id);
      
      if (placeDetails) {
        // Update the input with the formatted address
        const addressInputEvent = {
          target: {
            name: 'address',
            value: placeDetails.formatted_address
          }
        };
        onChange(addressInputEvent);

        // Extract address components
        const addressData = {
          formattedAddress: placeDetails.formatted_address,
          placeId: suggestion.place_id,
          mainText: suggestion.structured_formatting.main_text,
          secondaryText: suggestion.structured_formatting.secondary_text,
          addressComponents: placeDetails.address_components
        };

        // Extract postcode
        const postcodeComponent = placeDetails.address_components?.find(component =>
          component.types.includes('postal_code')
        );
        
        if (postcodeComponent) {
          addressData.postcode = postcodeComponent.long_name;
        }

        // Extract city
        const cityComponent = placeDetails.address_components?.find(component =>
          component.types.includes('postal_town') || 
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2')
        );
        
        if (cityComponent) {
          addressData.city = cityComponent.long_name;
        }

        // Extract country
        const countryComponent = placeDetails.address_components?.find(component =>
          component.types.includes('country')
        );
        
        if (countryComponent) {
          addressData.country = countryComponent.long_name;
        }

        // Call parent's onSelect callback with all the details
        if (onSelect) {
          onSelect(addressData);
        }
      }

      setShowSuggestions(false);
      setSuggestions([]);
    } catch (error) {
      console.error('Error selecting address:', error);
      setError('Failed to select address. Please try again.');
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        name="address"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : ''
        } ${className}`}
        autoComplete="off"
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading addresses...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {suggestion.structured_formatting.main_text}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              No addresses found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;