import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Trash2, Eye, Plus, X, Save, ChevronLeft, ChevronRight, Users, Globe, MapPin, UserPlus, UserMinus } from 'lucide-react';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/countries`);
        setCountries(res.data);
        setFilteredCountries(res.data);
      } catch (err) {
        console.error("Error loading countries");
      }
    };
    fetchCountries();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
    setCurrentPage(1);
  }, [searchTerm, countries]);

  const [newCountry, setNewCountry] = useState({
    name: '',
    isActive: true,
    isDefault: false,
  });
  const [editingCountry, setEditingCountry] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);
  const [newEmployee, setNewEmployee] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredCountries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCountries.length / recordsPerPage);

  // ➕ Add Country
  const handleAddCountry = async () => {
    if (!newCountry.name.trim()) {
      alert('Please enter country name.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/countries`, {
        name: newCountry.name,
        isActive: newCountry.isActive,
        isDefault: newCountry.isDefault
      });

      setCountries([...countries, res.data]);
      setNewCountry({ name: '', isActive: true, isDefault: false });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save country!");
    }
  };

  // ✏️ Edit Country
  const handleEdit = (country) => {
    setEditingCountry({ ...country });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/countries/${editingCountry._id}`,
        {
          name: editingCountry.name,
          isActive: editingCountry.isActive,
          isDefault: editingCountry.isDefault
        }
      );

      setCountries(prev =>
        prev.map(c => c._id === editingCountry._id ? res.data : c)
      );
      setEditingCountry(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating country");
    }
  };

  const handleCancelEdit = () => setEditingCountry(null);

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewCountry({ name: '', isActive: true, isDefault: false });
  };

  // 🗑️ Delete Country
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this country?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/countries/${id}`);
      setCountries(countries.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete country");
    }
  };

  // 👥 Add Employee to Country
  const handleAddEmployee = async (countryId) => {
    if (!newEmployee.trim()) {
      alert('Please enter employee name.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/countries/${countryId}/employees`, {
        employeeName: newEmployee
      });

      setCountries(prev =>
        prev.map(c => c._id === countryId ? res.data : c)
      );
      setNewEmployee('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add employee");
    }
  };

  // 👥 Remove Employee from Country
  const handleRemoveEmployee = async (countryId, employeeName) => {
    if (!window.confirm(`Remove ${employeeName} from this country?`)) return;

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/countries/${countryId}/employees/${encodeURIComponent(employeeName)}`
      );

      setCountries(prev =>
        prev.map(c => c._id === countryId ? res.data : c)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to remove employee");
    }
  };

  // 🔁 Toggle Country Status
  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/countries/${id}/toggle-status`);
      setCountries(prev =>
        prev.map(c => c._id === id ? res.data : c)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
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
              <Globe className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            Country Management
          </h1>
          <p className="text-gray-600 mt-2">Manage countries and their employee assignments</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search countries..."
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
              Add Country
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCountries.length} of {countries.length} countries
          </div>
        </div>

        {/* Add Country Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Country</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Name
                </label>
                <input
                  type="text"
                  placeholder="Enter country name"
                  value={newCountry.name}
                  onChange={(e) =>
                    setNewCountry({ ...newCountry, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                    checked={newCountry.isActive}
                    onChange={(e) =>
                      setNewCountry({ ...newCountry, isActive: e.target.checked })
                    }
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                    checked={newCountry.isDefault}
                    onChange={(e) =>
                      setNewCountry({ ...newCountry, isDefault: e.target.checked })
                    }
                  />
                  <label className="text-sm font-medium text-gray-700">Default</label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddCountry}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Country
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Countries Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">Country</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((country, index) => (
                  <React.Fragment key={country._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}>
                      {/* Country Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white">
                            <MapPin size={16} />
                          </div>
                          <div>
                            {editingCountry?._id === country._id ? (
                              <input
                                type="text"
                                value={editingCountry.name}
                                onChange={(e) =>
                                  setEditingCountry({
                                    ...editingCountry,
                                    name: e.target.value,
                                  })
                                }
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                              />
                            ) : (
                              <div className="font-medium text-gray-900">{country.name}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {editingCountry?._id === country._id ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                            checked={editingCountry.isActive}
                            onChange={(e) =>
                              setEditingCountry({
                                ...editingCountry,
                                isActive: e.target.checked,
                              })
                            }
                          />
                        ) : (
                          getStatusBadge(country.isActive)
                        )}
                      </td>

                      {/* Default */}
                      <td className="p-4 text-center">
                        {editingCountry?._id === country._id ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                            checked={editingCountry.isDefault}
                            onChange={(e) =>
                              setEditingCountry({
                                ...editingCountry,
                                isDefault: e.target.checked,
                              })
                            }
                          />
                        ) : (
                          getDefaultBadge(country.isDefault)
                        )}
                      </td>

                      {/* Employees Count */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {country.employees.length}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {editingCountry?._id === country._id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  setShowEmployees(
                                    showEmployees === country._id ? null : country._id
                                  )
                                }
                                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                title="View Employees"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(country)}
                                className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(country._id)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                                  country.isActive
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                                title={country.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {country.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(country._id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* 👥 Employees List */}
                    {showEmployees === country._id && (
                      <tr>
                        <td colSpan="5" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Employees in {country.name}
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
                              onClick={() => handleAddEmployee(country._id)}
                              className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <UserPlus size={16} />
                              Add Employee
                            </button>
                          </div>

                          {country.employees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {country.employees.map((emp, i) => (
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
                                    onClick={() => handleRemoveEmployee(country._id, emp)}
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
                              No employees in this country.
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
                {searchTerm ? 'No countries found matching your search.' : 'No countries available.'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredCountries.length)} of {filteredCountries.length} entries
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

export default CountryList;