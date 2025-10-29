import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, Save, X, ChevronLeft, ChevronRight, Users, Briefcase } from 'lucide-react';
import axios from 'axios';

const DesignationList = () => {
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch designations and departments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [desigRes, deptRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/designations`),
          axios.get(`${API_BASE_URL}/departments`)
        ]);
        setDesignations(desigRes.data);
        setFilteredDesignations(desigRes.data);
        setDepartments(deptRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = designations.filter(desig =>
      desig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desig.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDesignations(filtered);
    setCurrentPage(1);
  }, [searchTerm, designations]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    title: '',
    isActive: true,
    isDefault: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(filteredDesignations.length / pageSize);
  const paginatedData = filteredDesignations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = async () => {
    if (!formData.department || !formData.title) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/designations`, {
        department: formData.department,
        title: formData.title,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
      });

      setDesignations([...designations, res.data]);
      setFormData({
        department: '',
        title: '',
        isActive: true,
        isDefault: false,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save designation!");
    }
  };

  const handleEdit = (designation) => {
    setEditingId(designation._id);
    setFormData({
      department: designation.department,
      title: designation.title,
      isActive: designation.isActive,
      isDefault: designation.isDefault,
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/designations/${editingId}`,
        {
          department: formData.department,
          title: formData.title,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
        }
      );

      setDesignations(prev =>
        prev.map(d => d._id === editingId ? res.data : d)
      );
      setEditingId(null);
      setFormData({
        department: '',
        title: '',
        isActive: true,
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating designation");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this designation?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/designations/${id}`);
      setDesignations(designations.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete designation");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/designations/${id}/toggle-status`);
      setDesignations(prev =>
        prev.map(d => d._id === id ? res.data : d)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      department: '',
      title: '',
      isActive: true,
      isDefault: false,
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      department: '',
      title: '',
      isActive: true,
      isDefault: false,
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
              <Briefcase className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            Designation Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize all designations across departments</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search designations..."
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
              Add Designation
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDesignations.length} of {designations.length} designations
          </div>
        </div>

        {/* Add Designation Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Designation</h3>
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
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter designation title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex items-center gap-4">
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
                  />
                  <label className="text-sm font-medium text-gray-700">Default</label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Designation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Designation Form */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#FFC400]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Edit Designation</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter designation title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex items-center gap-4">
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
                  />
                  <label className="text-sm font-medium text-gray-700">Default</label>
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

        {/* Designations Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Department</th>
                  <th className="p-4 text-left font-semibold">Designation</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((desig, index) => (
                  <tr key={desig._id} className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}>
                    <td className="p-4 text-gray-600">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{desig.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{desig.title}</div>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      {getStatusBadge(desig.isActive)}
                    </td>

                    {/* Default */}
                    <td className="p-4 text-center">
                      {getDefaultBadge(desig.isDefault)}
                    </td>

                    {/* Employees */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {desig.employees || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => alert(`Viewing employees for ${desig.title}`)}
                          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          title="View Employees"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(desig)}
                          className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(desig._id)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                            desig.isActive
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                          title={desig.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {desig.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(desig._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
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
                {searchTerm ? 'No designations found matching your search.' : 'No designations available.'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredDesignations.length)} of {filteredDesignations.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
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
                  onClick={() => setCurrentPage(p => p + 1)}
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

export default DesignationList;