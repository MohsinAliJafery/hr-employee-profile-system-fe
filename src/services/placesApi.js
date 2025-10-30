const API_BASE_URL = 'http://localhost:5000/api';

export const placesApi = {
  // Get address suggestions
  getAutocompleteSuggestions: async (input) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/places/autocomplete?input=${encodeURIComponent(input)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      throw error;
    }
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/places/details?placeId=${encodeURIComponent(placeId)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch place details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }
};