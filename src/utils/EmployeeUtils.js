import axios from "axios";

/**
 * Utility functions for fetching employee-related form data
 * from backend APIs — always fetch fresh data (no cache).
 */

// Base API URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Generic function to fetch data directly from an API endpoint (no cache)
 */
const fetchData = async (endpoint) => {
  try {
    const { data } = await axios.get(`${API_BASE}/${endpoint}`, {
      headers: { "Cache-Control": "no-cache" },
    });

    if (data && data.success !== false) {
      return data.data || data;
    }

    console.warn(`⚠️ Unexpected response from ${endpoint}`, data);
    return [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${endpoint}:`, error);
    return [];
  }
};

/**
 * Exported fetcher functions — always hit the backend
 */
export const getVisaTypes = () => fetchData("visa-types");
export const getDepartments = () => fetchData("departments");
export const getDesignations = () => fetchData("designations");
export const getTitles = () => fetchData("titles");
export const getCountries = () => fetchData("countries");
export const getCities = () => fetchData("cities");
export const getNationalities = () => fetchData("nationalities");
export const getQualifications = () => fetchData("qualifications");
export const getEmployeeStatuses = () => fetchData("employee-status");

/**
 * Optional: Manual refresh helper if you ever want it later
 */
export const refreshAllEmployeeFormData = async () => {
  return Promise.all([
    getTitles(),
    getCountries(),
    getCities(),
    getVisaTypes(),
    getNationalities(),
    getDepartments(),
    getDesignations(),
    getQualifications(),
    getEmployeeStatuses(),
  ]);
};
