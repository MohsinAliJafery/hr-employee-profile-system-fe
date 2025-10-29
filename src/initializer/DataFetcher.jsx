import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch all data and store in localStorage
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        visaTypesRes,
        departmentsRes,
        designationsRes,
        titlesRes,
        countriesRes,
        citiesRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/visa-types`),
        axios.get(`${API_BASE_URL}/departments`),
        axios.get(`${API_BASE_URL}/designations`),
        axios.get(`${API_BASE_URL}/titles`),
        axios.get(`${API_BASE_URL}/countries`),
        axios.get(`${API_BASE_URL}/cities`)
      ]);

      // Store data in localStorage
      localStorage.setItem('visaTypes', JSON.stringify(visaTypesRes.data));
      localStorage.setItem('departments', JSON.stringify(departmentsRes.data));
      localStorage.setItem('designations', JSON.stringify(designationsRes.data));
      localStorage.setItem('titles', JSON.stringify(titlesRes.data));
      localStorage.setItem('countries', JSON.stringify(countriesRes.data));
      localStorage.setItem('cities', JSON.stringify(citiesRes.data));

      // Store last fetch timestamp
      localStorage.setItem('lastDataFetch', new Date().toISOString());
      
      console.log('All data fetched and stored successfully!');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data manually
  const handleRefresh = () => {
    fetchAllData();
  };

  return (
    <>
    </>
  );
};

export default DataFetcher;