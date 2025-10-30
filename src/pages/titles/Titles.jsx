import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Save, X, ChevronLeft, ChevronRight, User, Award, Users, Eye } from 'lucide-react';
import axios from 'axios';

const TitlesList = () => {
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Check if there's already a default title
  const hasDefault = titles.some(title => title.isDefault);
  const currentDefault = titles.find(title => title.isDefault);

  // Fetch titles from backend
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/titles`);
        setTitles(res.data);
        setFilteredTitles(res.data);
      } catch (err) {
        console.error("Error loading titles");
      }
    };
    fetchTitles();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = titles.filter(title =>
      title.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTitles(filtered);
    setCurrentPage(1);
  }, [searchTerm, titles]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 1,
    isDefault: false,
    order: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  const totalPages = Math.ceil(filteredTitles.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const paginatedData = filteredTitles.slice(indexOfFirst, indexOfLast);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = async () => {
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/titles`, {
        title: formData.title,
        status: formData.status ? 1 : 0,
        isDefault: formData.isDefault,
        order: formData.order
      });

      setTitles([...titles, res.data]);
      setFormData({ title: '', status: 1, isDefault: false, order: 0 });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save title!");
    }
  };

  const handleEdit = (title) => {
    setEditingId(title._id);
    setFormData({
      title: title.title,
      status: title.status,
      isDefault: title.isDefault,
      order: title.order
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/titles/${editingId}`,
        {
          title: formData.title,
          status: formData.status ? 1 : 0,
          isDefault: formData.isDefault,
          order: formData.order
        }
      );

      setTitles(prev =>
        prev.map(t => t._id === editingId ? res.data : t)
      );
      setEditingId(null);
      setFormData({ title: '', status: 1, isDefault: false, order: 0 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating title");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this title?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/titles/${id}`);
      setTitles(titles.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete title");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/titles/${id}/toggle-status`);
      setTitles(prev =>
        prev.map(t => t._id === id ? res.data : t)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', status: 1, isDefault: false, order: 0 });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({ title: '', status: 1, isDefault: false, order: 0 });
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#450693] to-[#8C00FF] rounded-2xl">
              <Award className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
            Title Management
          </h1>
          <p className="text-gray-600 mt-2">Manage honorific titles and prefixes for your organization</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search titles..."
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
              Add Title
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredTitles.length} of {titles.length} titles
          </div>
        </div>

        {/* Add Title Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#8C00FF]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Add New Title</h3>
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
                  Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title (e.g., Mr., Dr., Prof.)"
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
                        {currentDefault?.title} is already set as default
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
                  Add Title
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Title Form */}
        {editingId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#FFC400]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#450693]">Edit Title</h3>
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
                  Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title (e.g., Mr., Dr., Prof.)"
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
                        {currentDefault?.title} is already set as default
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

        {/* Titles Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Order</th>
                  <th className="p-4 text-left font-semibold">Title</th>
                  <th className="p-4 text-center font-semibold">Employees</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((t, index) => (
                  <React.Fragment key={t._id}>
                    <tr className={`border-b hover:bg-gray-50 transition-colors ${
                      t.isDefault ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}>
                      {/* Serial Number */}
                      <td className="p-4 font-medium">
                        {indexOfFirst + index + 1}
                      </td>

                      {/* Order */}
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {t.order}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white font-medium">
                            <User size={16} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{t.title}</span>
                            {t.isDefault && (
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                ⭐ Default
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Employees */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {t.employees?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {getStatusBadge(t.status)}
                      </td>

                      {/* Default */}
                      <td className="p-4 text-center">
                        {t.isDefault ? (
                          <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setShowEmployees(showEmployees === t._id ? null : t._id)}
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="View Employees"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(t)}
                            className="flex items-center gap-1 bg-[#FFC400] text-white px-3 py-2 rounded-lg hover:bg-[#E6B000] transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(t._id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors ${
                              t.status === 1
                                ? 'bg-gray-500 hover:bg-gray-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                            title={t.status === 1 ? 'Deactivate' : 'Activate'}
                          >
                            {t.status === 1 ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete"
                            disabled={t.employees?.length > 0 || t.isDefault}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* 👥 Employee List (View) */}
                    {showEmployees === t._id && (
                      <tr>
                        <td colSpan="7" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-[#450693]">
                              Employees with {t.title} title
                              {t.isDefault && (
                                <span className="ml-2 text-yellow-600 text-sm">⭐ Default Title</span>
                              )}
                            </h4>
                            <button
                              onClick={() => setShowEmployees(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          {t.employees?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {t.employees.map((emp, i) => (
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
                              No employees with this title.
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
                {searchTerm ? 'No titles found matching your search.' : 'No titles available.'}
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {filteredTitles.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTitles.length)} of {filteredTitles.length} entries
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

export default TitlesList;