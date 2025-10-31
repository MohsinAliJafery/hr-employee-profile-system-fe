import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Save, X, ChevronLeft, ChevronRight, Users, Briefcase } from 'lucide-react';

const EmployeeStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Check if there's already a default status (only one allowed globally)
  const hasDefault = statuses.some(status => status.isDefault);
  const currentDefault = statuses.find(status => status.isDefault);

  // Fetch statuses from backend
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employee-status`);
        const data = await res.json();
        setStatuses(data.statuses || []);
        setFilteredStatuses(data.statuses || []);
      } catch (err) {
        console.error("Error loading employee statuses:", err);
      }
    };
    fetchStatuses();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = statuses.filter(status =>
      status.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatuses(filtered);
    setCurrentPage(1);
  }, [searchTerm, statuses]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    isActive: true,
    isDefault: false,
    order: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  const totalPages = Math.ceil(filteredStatuses.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedData = filteredStatuses.slice(indexOfFirst, indexOfLast);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = async () => {
    if (!formData.status) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/employee-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
          order: formData.order
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatuses(prev => {
          let updated = [...prev];
          if (data.isDefault) {
            updated = updated.map(s => ({ ...s, isDefault: false }));
          }
          return [data, ...updated];
        });
        setFormData({
          status: '',
          isActive: true,
          isDefault: false,
          order: 0
        });
        setShowAddForm(false);
      } else {
        alert(data.error || "Failed to save employee status!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save employee status!");
    }
  };

  const handleEdit = (status) => {
    setEditingId(status._id);
    setFormData({
      status: status.status,
      isActive: status.isActive,
      isDefault: status.isDefault,
      order: status.order
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employee-status/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
          order: formData.order
        }),
      });

      const updated = await res.json();

      if (res.ok) {
        setStatuses(prev =>
          prev.map(s =>
            s._id === editingId
              ? updated
              : { ...s, isDefault: updated.isDefault ? false : s.isDefault }
          )
        );
        setEditingId(null);
        setFormData({
          status: '',
          isActive: true,
          isDefault: false,
          order: 0
        });
      } else {
        alert(updated.error || "Error updating employee status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating employee status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee status?')) return;

    try {
      await fetch(`${API_BASE_URL}/employee-status/${id}`, { method: 'DELETE' });
      setStatuses(statuses.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee status");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employee-status/${id}/toggle-status`, {
        method: 'PATCH'
      });
      const updated = await res.json();
      setStatuses(prev =>
        prev.map(s => s._id === id ? updated : s)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      status: '',
      isActive: true,
      isDefault: false,
      order: 0
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      status: '',
      isActive: true,
      isDefault: false,
      order: 0
    });
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
              <Briefcase className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            Employee Status Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize all employee status types in the system</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employee statuses..."
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
              Add Status
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStatuses.length} of {statuses.length} employee statuses
          </div>
        </div>

        {/* Add Status Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Employee Status</h3>
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
                  Status Name *
                </label>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Enter status name"
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
                    name="isActive"
                    checked={formData.isActive}
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
                        {currentDefault?.status} is already set as default
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
                  Add Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Form */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#FFC400]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Edit Employee Status</h3>
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
                  Status Name *
                </label>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Enter status name"
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
                    name="isActive"
                    checked={formData.isActive}
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
                        {currentDefault?.status} is already set as default
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

        {/* Status Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Order</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Active</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((status, index) => (
                  <tr key={status._id} className={`border-b hover:bg-gray-50 transition-colors ${
                    status.isDefault ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                  }`}>
                    {/* Serial Number */}
                    <td className="p-4 font-medium">
                      {indexOfFirst + index + 1}
                    </td>

                    {/* Order */}
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {status.order}
                      </span>
                    </td>

                    {/* Status Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{status.status}</span>
                        {status.isDefault && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            ⭐ Default
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Active Status */}
                    <td className="p-4 text-center">
                      {getStatusBadge(status.isActive)}
                    </td>

                    {/* Default */}
                    <td className="p-4 text-center">
                      {status.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>

                    {/* Employees Count */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {status.totalEmployees || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(status)}
                          className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(status._id)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                            status.isActive
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                          title={status.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {status.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(status._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
                          disabled={status.totalEmployees > 0 || status.isDefault}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No employee statuses found matching your search.' : 'No employee statuses available.'}
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {filteredStatuses.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredStatuses.length)} of {filteredStatuses.length} entries
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

export default EmployeeStatus;