// Utility functions to get data from localStorage with sorting

// Generic function to get active items with default first
export const getActiveWithDefaultFirst = (data, activeField = 'isActive', defaultField = 'isDefault') => {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(item => {
      // Handle different active field types (boolean vs number)
      const isActive = typeof item[activeField] === 'number' 
        ? item[activeField] === 1 
        : Boolean(item[activeField]);
      return isActive;
    })
    .sort((a, b) => {
      // Put default items first
      const aIsDefault = Boolean(a[defaultField]);
      const bIsDefault = Boolean(b[defaultField]);
      
      if (aIsDefault && !bIsDefault) return -1;
      if (!aIsDefault && bIsDefault) return 1;
      return 0;
    });
};

// Specific getter functions for each data type
export const getVisaTypes = () => {
  const data = JSON.parse(localStorage.getItem('visaTypes') || '[]');
  return getActiveWithDefaultFirst(data, 'active', 'isDefault');
};

export const getDepartments = () => {
  const data = JSON.parse(localStorage.getItem('departments') || '[]');
  return getActiveWithDefaultFirst(data, 'status', 'isDefault');
};

export const getDesignations = () => {
  const data = JSON.parse(localStorage.getItem('designations') || '[]');
  return getActiveWithDefaultFirst(data, 'isActive', 'isDefault');
};

export const getTitles = () => {
  const data = JSON.parse(localStorage.getItem('titles') || '[]');
  return getActiveWithDefaultFirst(data, 'isActive', 'isDefault');
};

export const getCountries = () => {
  const data = JSON.parse(localStorage.getItem('countries') || '[]');
  return getActiveWithDefaultFirst(data, 'isActive', 'isDefault');
};

export const getCities = () => {
  const data = JSON.parse(localStorage.getItem('cities') || '[]');
  return getActiveWithDefaultFirst(data, 'isActive', 'isDefault');
};

// Get cities by country
export const getCitiesByCountry = (countryId) => {
  const cities = JSON.parse(localStorage.getItem('cities') || '[]');
  return getActiveWithDefaultFirst(
    cities.filter(city => city.countryId?._id === countryId || city.countryId === countryId),
    'isActive',
    'isDefault'
  );
};

// Check if data exists in localStorage
export const hasData = () => {
  return localStorage.getItem('visaTypes') !== null &&
         localStorage.getItem('departments') !== null &&
         localStorage.getItem('designations') !== null &&
         localStorage.getItem('titles') !== null &&
         localStorage.getItem('countries') !== null &&
         localStorage.getItem('cities') !== null;
};

// Get last fetch time
export const getLastFetchTime = () => {
  return localStorage.getItem('lastDataFetch');
};