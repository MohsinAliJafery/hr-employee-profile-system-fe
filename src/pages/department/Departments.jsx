import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Trash2, Eye, Plus, X, Save, ChevronLeft, ChevronRight, Users, Building2 } from 'lucide-react';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/departments`);
        setDepartments(res.data);
        setFilteredDepartments(res.data);
      } catch (err) {
        console.error("Error loading departments");
      }
    };
    fetchDepartments();
  }, []);

  const [newDept, setNewDept] = useState({
    name: '',
    isDefault: false,
    order: 0
  });
  const [editingDept, setEditingDept] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check if there's already a default department
  const hasDefault = departments.some(dept => dept.isDefault === true);
  const currentDefault = departments.find(dept => dept.isDefault === true);

  // Search functionality
  useEffect(() => {
    const filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(filtered);
    setCurrentPage(1);
  }, [searchTerm, departments]);

  // 🧭 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  const totalPages = Math.ceil(filteredDepartments.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedDepartments = filteredDepartments.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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

  // ➕ Add Department
  const handleAddDepartment = async () => {
    if (!newDept.name.trim()) {
      alert("Please enter department name.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/departments`, {
        name: newDept.name,
        isDefault: newDept.isDefault,
        order: newDept.order
      });

      setDepartments([...departments, res.data]);
      setNewDept({
        name: '',
        isDefault: false,
        order: 0
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save department!");
    }
  };

  // ✏️ Edit Department
  const handleEditDepartment = (dept) => {
    setEditingDept({ ...dept });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/departments/${editingDept._id}`,
        {
          name: editingDept.name,
          status: editingDept.status,
          isDefault: editingDept.isDefault,
          order: editingDept.order
        }
      );

      setDepartments(prev => 
        prev.map(d => d._id === editingDept._id ? res.data : d)
      );
      setEditingDept(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating department");
    }
  };

  const handleCancelEdit = () => {
    setEditingDept(null);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewDept({
      name: '',
      isDefault: false,
      order: 0
    });
  };

  // 🔁 Toggle Status
  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/departments/${id}/toggle-status`);
      setDepartments(prev =>
        prev.map(d => d._id === id ? res.data : d)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
    }
  };

  // ❌ Delete Department
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}`);
      setDepartments(departments.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete department");
    }
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
            Department Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize all departments in your organization</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search departments..."
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
              Add Department
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDepartments.length} of {departments.length} departments
          </div>
        </div>

        {/* Add Department Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Department</h3>
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
                  Department Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="Order"
                  min="0"
                  value={newDept.order}
                  onChange={(e) => setNewDept({ ...newDept, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                  checked={newDept.isDefault}
                  onChange={() => setNewDept({ ...newDept, isDefault: !newDept.isDefault })}
                  disabled={hasDefault && !newDept.isDefault}
                />
                <label className="text-sm font-medium text-gray-700">
                  Set as Default
                  {hasDefault && (
                    <span className="text-xs text-gray-500 block">
                      ({currentDefault?.name} is current default)
                    </span>
                  )}
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddDepartment}
                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Department
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Departments Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Order</th>
                  <th className="p-4 text-left font-semibold">Department</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.map((dept, index) => (
                  <React.Fragment key={dept._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      dept.isDefault ? 'bg-yellow-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}>
                      {/* Serial Number */}
                      <td className="p-4 font-medium">
                        {indexOfFirst + index + 1}
                      </td>

                      {/* Order */}
                      <td className="p-4">
                        {editingDept?._id === dept._id ? (
                          <input
                            type="number"
                            min="0"
                            value={editingDept.order}
                            onChange={(e) =>
                              setEditingDept({ ...editingDept, order: parseInt(e.target.value) || 0 })
                            }
                            className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                          />
                        ) : (
                          dept.order
                        )}
                      </td>

                      {/* Department Name */}
                      <td className="p-4">
                        {editingDept?._id === dept._id ? (
                          <input
                            type="text"
                            value={editingDept.name}
                            onChange={(e) =>
                              setEditingDept({ ...editingDept, name: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{dept.name}</span>
                            {dept.isDefault && (
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Employees Count */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {dept.employees?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {editingDept?._id === dept._id ? (
                          <select
                            value={editingDept.status}
                            onChange={(e) =>
                              setEditingDept({ ...editingDept, status: parseInt(e.target.value) })
                            }
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#8C00FF]"
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        ) : (
                          getStatusBadge(dept.status)
                        )}
                      </td>

                      {/* Default */}
                      <td className="p-4 text-center">
                        {editingDept?._id === dept._id ? (
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#8C00FF] cursor-pointer"
                            checked={editingDept.isDefault}
                            onChange={() =>
                              setEditingDept({
                                ...editingDept,
                                isDefault: !editingDept.isDefault,
                              })
                            }
                            disabled={hasDefault && !editingDept.isDefault && currentDefault?._id !== dept._id}
                          />
                        ) : (
                          dept.isDefault ? (
                            <span className="text-purple-600 font-medium">Yes</span>
                          ) : (
                            <span className="text-gray-600">No</span>
                          )
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {editingDept?._id === dept._id ? (
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
                                    showEmployees === dept._id ? null : dept._id
                                  )
                                }
                                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                title="View Employees"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditDepartment(dept)}
                                className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => toggleStatus(dept._id)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                                  dept.status === 1
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                                title={dept.status === 1 ? 'Deactivate' : 'Activate'}
                              >
                                {dept.status === 1 ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(dept._id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                                disabled={dept.employees?.length > 0}
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* 👥 Employee List (View) */}
                    {showEmployees === dept._id && (
                      <tr>
                        <td colSpan="7" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Employees in {dept.name}
                            </h4>
                            <button
                              onClick={() => setShowEmployees(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          {dept.employees?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {dept.employees.map((emp, i) => (
                                <div
                                  key={i}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {emp.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{emp}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Users size={48} className="mx-auto mb-3 text-gray-300" />
                              No employees in this department.
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {paginatedDepartments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No departments found matching your search.' : 'No departments available.'}
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {filteredDepartments.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredDepartments.length)} of {filteredDepartments.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(1)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>

                {/* Previous Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
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
                  onClick={() => goToPage(currentPage + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>

                {/* Last Page */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(totalPages)}
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

export default DepartmentList;