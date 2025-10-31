import axios from "axios";

/**
 * Utility functions for fetching and caching employee form data
 * from the backend APIs.
 *
 * Each function first checks localStorage for cached data.
 * If no cached data is found or cache expired, it makes a GET request.
 */

// 🔧 Base API URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic function to fetch data from an API endpoint with caching
 */
const fetchAndCacheData = async (key, endpoint) => {
  try {
    // ✅ 1. Check if data exists in localStorage
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Optional: Expiry check — 1 day
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp < oneDay) {
        return parsed.data;
      }
    }

    // ✅ 2. If no cache, fetch from server
    const { data } = await axios.get(`${API_BASE}/${endpoint}`);

    // ✅ 3. If valid, store in cache with timestamp
    if (data && data.success !== false) {
      localStorage.setItem(
        key,
        JSON.stringify({ data: data.data || data, timestamp: Date.now() })
      );
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
 * All fetcher functions (for different models)
 */
export const getVisaTypes = () => fetchAndCacheData("visaTypes", "visa-types");
export const getDepartments = () => fetchAndCacheData("departments", "departments");
export const getDesignations = () => fetchAndCacheData("designations", "designations");
export const getTitles = () => fetchAndCacheData("titles", "titles");
export const getCountries = () => fetchAndCacheData("countries", "countries");
export const getCities = () => fetchAndCacheData("cities", "cities");
export const getNationalities = () => fetchAndCacheData("nationalities", "nationalities");
export const getQualifications = () => fetchAndCacheData("qualifications", "qualifications");
export const getEmployeeStatuses = () => fetchAndCacheData("employeeStatus", "employee-status");

/**
 * Utility to clear all cached form data
 */
export const clearEmployeeFormCache = () => {
  const keys = [
    "visaTypes",
    "departments",
    "designations",
    "titles",
    "countries",
    "cities",
    "nationalities",
    "qualifications",
    "employeeStatus",
  ];
  keys.forEach((key) => localStorage.removeItem(key));
};
