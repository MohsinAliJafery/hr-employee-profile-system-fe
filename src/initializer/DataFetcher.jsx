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
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">📊 Data Fetcher</h2>
      
      {loading && (
        <div className="text-center text-blue-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading all data...
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="text-green-600 text-center mb-4 p-2 bg-green-50 rounded">
          ✅ All data loaded successfully!
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {/* Data Summary */}
      {!loading && (
        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Stored Data:</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>Visa Types: {JSON.parse(localStorage.getItem('visaTypes') || '[]').length}</div>
            <div>Departments: {JSON.parse(localStorage.getItem('departments') || '[]').length}</div>
            <div>Designations: {JSON.parse(localStorage.getItem('designations') || '[]').length}</div>
            <div>Titles: {JSON.parse(localStorage.getItem('titles') || '[]').length}</div>
            <div>Countries: {JSON.parse(localStorage.getItem('countries') || '[]').length}</div>
            <div>Cities: {JSON.parse(localStorage.getItem('cities') || '[]').length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFetcher;