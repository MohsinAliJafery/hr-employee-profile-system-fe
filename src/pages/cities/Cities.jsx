import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Trash2, Eye, Plus, X, Save, ChevronLeft, ChevronRight, Users, MapPin, Building2, UserPlus, UserMinus } from 'lucide-react';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch cities and countries from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, countriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/cities`),
          axios.get(`${API_BASE_URL}/cities/countries`)
        ]);
        setCities(citiesRes.data);
        setFilteredCities(citiesRes.data);
        setCountries(countriesRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.countryId?.name && city.countryId.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCities(filtered);
    setCurrentPage(1);
  }, [searchTerm, cities]);

  const [newCity, setNewCity] = useState({
    name: '',
    countryId: '',
    isActive: true,
    isDefault: false,
  });

  const [editingCity, setEditingCity] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);
  const [newEmployee, setNewEmployee] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredCities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCities.length / recordsPerPage);

  // ➕ Add City
  const handleAddCity = async () => {
    if (!newCity.name.trim() || !newCity.countryId) {
      alert('⚠️ Please fill in both City Name and Country.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/cities`, {
        name: newCity.name,
        countryId: newCity.countryId,
        isActive: newCity.isActive,
        isDefault: newCity.isDefault
      });

      setCities([...cities, res.data]);
      setNewCity({ name: '', countryId: '', isActive: true, isDefault: false });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save city!");
    }
  };

  // ✏️ Edit City
  const handleEdit = (city) => setEditingCity({ ...city });

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cities/${editingCity._id}`,
        {
          name: editingCity.name,
          countryId: editingCity.countryId,
          isActive: editingCity.isActive,
          isDefault: editingCity.isDefault
        }
      );

      setCities(prev =>
        prev.map(c => c._id === editingCity._id ? res.data : c)
      );
      setEditingCity(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating city");
    }
  };

  const handleCancelEdit = () => setEditingCity(null);

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewCity({ name: '', countryId: '', isActive: true, isDefault: false });
  };

  // ❌ Delete City
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/cities/${id}`);
      setCities(cities.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete city");
    }
  };

  // 🔁 Toggle City Status
  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/cities/${id}/toggle-status`);
      setCities(prev =>
        prev.map(c => c._id === id ? res.data : c)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
    }
  };

  // 👥 Add Employee to City
  const handleAddEmployee = async (cityId) => {
    if (!newEmployee.trim()) {
      alert('Please enter employee name.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/cities/${cityId}/employees`, {
        employeeName: newEmployee
      });

      setCities(prev =>
        prev.map(c => c._id === cityId ? res.data : c)
      );
      setNewEmployee('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add employee");
    }
  };

  // 👥 Remove Employee from City
  const handleRemoveEmployee = async (cityId, employeeName) => {
    if (!window.confirm(`Remove ${employeeName} from this city?`)) return;

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/cities/${cityId}/employees/${encodeURIComponent(employeeName)}`
      );

      setCities(prev =>
        prev.map(c => c._id === cityId ? res.data : c)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to remove employee");
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
        Inactive
      </span>
    );
  };

  const getDefaultBadge = (isDefault) => {
    return isDefault ? (
      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
        Default
      </span>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#450693] to-[#8C00FF] rounded-2xl">
              <Building2 className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            City Management
          </h1>
          <p className="text-gray-600 mt-2">Manage cities and their employee assignments across countries</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Add City
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCities.length} of {cities.length} cities
          </div>
        </div>

        {/* Add City Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New City</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={newCity.countryId}
                  onChange={(e) =>
                    setNewCity({ ...newCity, countryId: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCity.isActive}
                    onChange={(e) =>
                      setNewCity({ ...newCity, isActive: e.target.checked })
                    }
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCity.isDefault}
                    onChange={(e) =>
                      setNewCity({ ...newCity, isDefault: e.target.checked })
                    }
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Default</label>
                </div>
              </div>

              <div className="lg:col-span-2 flex gap-2">
                <button
                  onClick={handleAddCity}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add City
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit City Form */}
        {editingCity && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#FFC400]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Edit City</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={editingCity.name}
                  onChange={(e) =>
                    setEditingCity({ ...editingCity, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={editingCity.countryId}
                  onChange={(e) =>
                    setEditingCity({
                      ...editingCity,
                      countryId: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingCity.isActive}
                    onChange={(e) =>
                      setEditingCity({
                        ...editingCity,
                        isActive: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingCity.isDefault}
                    onChange={(e) =>
                      setEditingCity({
                        ...editingCity,
                        isDefault: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Default</label>
                </div>
              </div>

              <div className="lg:col-span-2 flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <Save size={16} className="inline mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cities Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">City</th>
                  <th className="p-4 text-left font-semibold">Country</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((city, index) => (
                  <React.Fragment key={city._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}>
                      {/* City Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white">
                            <MapPin size={16} />
                          </div>
                          <div className="font-medium text-gray-900">{city.name}</div>
                        </div>
                      </td>

                      {/* Country */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {city.countryId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {getStatusBadge(city.isActive)}
                      </td>

                      {/* Default */}
                      <td className="p-4 text-center">
                        {getDefaultBadge(city.isDefault)}
                      </td>

                      {/* Employees Count */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {city.employees.length}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              setShowEmployees(
                                showEmployees === city._id ? null : city._id
                              )
                            }
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="View Employees"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(city)}
                            className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(city._id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                              city.isActive
                                ? 'bg-gray-500 hover:bg-gray-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                            title={city.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {city.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(city._id)}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* 👥 Employees Under City */}
                    {showEmployees === city._id && (
                      <tr>
                        <td colSpan="6" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Employees in {city.name}
                            </h4>
                            <button
                              onClick={() => setShowEmployees(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          
                          {/* Add Employee Form */}
                          <div className="flex gap-2 mb-6">
                            <div className="relative flex-1">
                              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="text"
                                placeholder="Enter employee name"
                                value={newEmployee}
                                onChange={(e) => setNewEmployee(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                              />
                            </div>
                            <button
                              onClick={() => handleAddEmployee(city._id)}
                              className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <UserPlus size={16} />
                              Add Employee
                            </button>
                          </div>

                          {city.employees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {city.employees.map((emp, i) => (
                                <div
                                  key={i}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      {emp.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-900">{emp}</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveEmployee(city._id, emp)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Remove Employee"
                                  >
                                    <UserMinus size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Users size={48} className="mx-auto mb-3 text-gray-300" />
                              No employees in this city.
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {currentRecords.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No cities found matching your search.' : 'No cities available.'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredCities.length)} of {filteredCities.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white rounded-lg font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityList;