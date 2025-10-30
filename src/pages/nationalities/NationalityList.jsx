import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, Save, X, ChevronLeft, ChevronRight, Users, Globe } from 'lucide-react';
import axios from 'axios';

const NationalityList = () => {
  const [nationalities, setNationalities] = useState([]);
  const [filteredNationalities, setFilteredNationalities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Check if there's already a default nationality (only one allowed globally)
  const hasDefault = nationalities.some(nat => nat.isDefault);
  const currentDefault = nationalities.find(nat => nat.isDefault);

  // Fetch nationalities from backend
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/nationalities`);
        setNationalities(res.data);
        setFilteredNationalities(res.data);
      } catch (err) {
        console.error("Error loading nationalities:", err);
      }
    };
    fetchNationalities();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = nationalities.filter(nat =>
      nat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNationalities(filtered);
    setCurrentPage(1);
  }, [searchTerm, nationalities]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCitizens, setShowCitizens] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 1,
    isDefault: false,
    order: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  const totalPages = Math.ceil(filteredNationalities.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedData = filteredNationalities.slice(indexOfFirst, indexOfLast);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = async () => {
    if (!formData.name) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/nationalities`, {
        name: formData.name,
        status: formData.status ? 1 : 0,
        isDefault: formData.isDefault,
        order: formData.order
      });

      setNationalities([...nationalities, res.data]);
      setFormData({
        name: '',
        status: 1,
        isDefault: false,
        order: 0
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save nationality!");
    }
  };

  const handleEdit = (nationality) => {
    setEditingId(nationality._id);
    setFormData({
      name: nationality.name,
      status: nationality.status,
      isDefault: nationality.isDefault,
      order: nationality.order
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/nationalities/${editingId}`,
        {
          name: formData.name,
          status: formData.status ? 1 : 0,
          isDefault: formData.isDefault,
          order: formData.order
        }
      );

      setNationalities(prev =>
        prev.map(n => n._id === editingId ? res.data : n)
      );
      setEditingId(null);
      setFormData({
        name: '',
        status: 1,
        isDefault: false,
        order: 0
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating nationality");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this nationality?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/nationalities/${id}`);
      setNationalities(nationalities.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete nationality");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/nationalities/${id}/toggle-status`);
      setNationalities(prev =>
        prev.map(n => n._id === id ? res.data : n)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      status: 1,
      isDefault: false,
      order: 0
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      name: '',
      status: 1,
      isDefault: false,
      order: 0
    });
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
        Inactive
      </span>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
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
            Nationality Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize all nationalities in the system</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search nationalities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
              />
            </div>

            {/* Records Per Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Add Nationality
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredNationalities.length} of {nationalities.length} nationalities
          </div>
        </div>

        {/* Add Nationality Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Nationality</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter nationality name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Order"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                    disabled={hasDefault && !formData.isDefault}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Set as Default
                    {hasDefault && !formData.isDefault && (
                      <span className="text-xs text-red-500 block">
                        {currentDefault?.name} is already set as default
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Nationality
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Nationality Form */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#FFC400]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Edit Nationality</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter nationality name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Order"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                    disabled={hasDefault && !formData.isDefault && currentDefault?._id !== editingId}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Set as Default
                    {hasDefault && !formData.isDefault && currentDefault?._id !== editingId && (
                      <span className="text-xs text-red-500 block">
                        {currentDefault?.name} is already set as default
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <Save size={16} className="inline mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nationalities Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Order</th>
                  <th className="p-4 text-left font-semibold">Nationality</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Citizens</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((nat, index) => (
                  <React.Fragment key={nat._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      nat.isDefault ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}>
                      {/* Serial Number */}
                      <td className="p-4 font-medium">
                        {indexOfFirst + index + 1}
                      </td>

                      {/* Order */}
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {nat.order}
                        </span>
                      </td>

                      {/* Nationality Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{nat.name}</span>
                          {nat.isDefault && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              ⭐ Default
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {getStatusBadge(nat.status)}
                      </td>

                      {/* Default */}
                      <td className="p-4 text-center">
                        {nat.isDefault ? (
                          <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>

                      {/* Citizens */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {nat.citizens?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setShowCitizens(showCitizens === nat._id ? null : nat._id)}
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="View Citizens"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(nat)}
                            className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(nat._id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                              nat.status === 1
                                ? 'bg-gray-500 hover:bg-gray-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                            title={nat.status === 1 ? 'Deactivate' : 'Activate'}
                          >
                            {nat.status === 1 ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(nat._id)}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete"
                            disabled={nat.citizens?.length > 0 || nat.isDefault}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* 👥 Citizen List (View) */}
                    {showCitizens === nat._id && (
                      <tr>
                        <td colSpan="7" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Citizens with {nat.name} nationality
                              {nat.isDefault && (
                                <span className="ml-2 text-yellow-600 text-sm">⭐ Default Nationality</span>
                              )}
                            </h4>
                            <button
                              onClick={() => setShowCitizens(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          {nat.citizens?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {nat.citizens.map((citizen, i) => (
                                <div
                                  key={i}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {citizen.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{citizen}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Users size={48} className="mx-auto mb-3 text-gray-300" />
                              No citizens with this nationality.
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {paginatedData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No nationalities found matching your search.' : 'No nationalities available.'}
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {filteredNationalities.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredNationalities.length)} of {filteredNationalities.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>

                {/* Previous Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Page */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>

                {/* Last Page */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NationalityList;