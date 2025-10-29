import React, { useState } from 'react';
import axios from "axios";
import { useEffect } from "react";
import { Search, Edit, Trash2, Eye, Plus, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';

const VisaTypeList = () => {
  const [visaTypes, setVisaTypes] = useState([]);
  const [filteredVisaTypes, setFilteredVisaTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchVisaTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/visa-types`);
        setVisaTypes(res.data);
        setFilteredVisaTypes(res.data);
      } catch (err) {
        console.error("Error loading visa types");
      }
    };
    fetchVisaTypes();
  }, []);

  const [newType, setNewType] = useState({
    type: '',
    active: 1,
    isDefault: 0,
  });

  const [editingType, setEditingType] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Search functionality
  useEffect(() => {
    const filtered = visaTypes.filter(visa =>
      visa.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVisaTypes(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, visaTypes]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredVisaTypes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVisaTypes.length / recordsPerPage);

  // Add Visa Type
  const handleAddType = async () => {
    if (!newType.type.trim()) {
      alert("Please enter visa type name.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/visa-types`, {
        type: newType.type,
        active: newType.active,
        isDefault: newType.isDefault,
      });

      setVisaTypes([...visaTypes, res.data]);
      setNewType({ type: "", active: 1, isDefault: 0 });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save visa type!");
    }
  };

  // Edit Visa Type
  const handleEdit = (visa) => {
    setEditingType({
      _id: visa._id,
      type: visa.type,
      active: visa.active,
      isDefault: visa.isDefault
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/visa-types/${editingType._id}`,
        {
          type: editingType.type,
          active: editingType.active,
          isDefault: editingType.isDefault,
        }
      );

      setVisaTypes((prev) =>
        prev.map((v) => (v._id === editingType._id ? res.data : v))
      );
      setEditingType(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating visa type");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visa type?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/visa-types/${id}`);
      setVisaTypes((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleCancelEdit = () => {
    setEditingType(null);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewType({ type: "", active: 1, isDefault: 0 });
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
        Inactive
      </span>
    );
  };

  const getDefaultBadge = (isDefault) => {
    return isDefault === 1 ? (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
        Default
      </span>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            🛂 Visa Type Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize all visa types in your system</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search visa types..."
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
              Add Visa Type
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredVisaTypes.length} of {visaTypes.length} visa types
          </div>
        </div>

        {/* Add Visa Type Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Visa Type</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visa Type Name
                </label>
                <input
                  type="text"
                  placeholder="Enter visa type name"
                  value={newType.type}
                  onChange={(e) => setNewType({ ...newType, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  checked={newType.active === 1}
                  onChange={(e) =>
                    setNewType({ ...newType, active: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  checked={newType.isDefault === 1}
                  onChange={(e) =>
                    setNewType({ ...newType, isDefault: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="text-sm font-medium text-gray-700">Default</label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddType}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Type
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visa Types Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">Visa Type</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((visa, index) => (
                  <React.Fragment key={visa._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}>
                      {/* Visa Type */}
                      <td className="p-4">
                        {editingType?._id === visa._id ? (
                          <input
                            type="text"
                            value={editingType.type}
                            onChange={(e) =>
                              setEditingType({ ...editingType, type: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                          />
                        ) : (
                          <div className="font-medium text-gray-900">{visa.type}</div>
                        )}
                      </td>

                      {/* Employees Count */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {visa.employees.length}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="p-4 text-center">
                        {editingType?._id === visa._id ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                            checked={editingType.active === 1}
                            onChange={(e) =>
                              setEditingType({
                                ...editingType,
                                active: e.target.checked ? 1 : 0,
                              })
                            }
                          />
                        ) : (
                          getStatusBadge(visa.active)
                        )}
                      </td>

                      {/* Default Status */}
                      <td className="p-4 text-center">
                        {editingType?._id === visa._id ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                            checked={editingType.isDefault === 1}
                            onChange={(e) =>
                              setEditingType({
                                ...editingType,
                                isDefault: e.target.checked ? 1 : 0,
                              })
                            }
                          />
                        ) : (
                          getDefaultBadge(visa.isDefault)
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {editingType?._id === visa._id ? (
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
                                    showEmployees === visa._id ? null : visa._id
                                  )
                                }
                                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                title="View Employees"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(visa)}
                                className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(visa._id)}
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

                    {/* Employees Under Visa Type */}
                    {showEmployees === visa._id && (
                      <tr>
                        <td colSpan="5" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Employees under {visa.type}
                            </h4>
                            <button
                              onClick={() => setShowEmployees(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          {visa.employees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {visa.employees.map((emp, i) => (
                                <div
                                  key={i}
                                  className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                                >
                                  {emp}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No employees under this visa type.
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
                {searchTerm ? 'No visa types found matching your search.' : 'No visa types available.'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredVisaTypes.length)} of {filteredVisaTypes.length} entries
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

export default VisaTypeList;