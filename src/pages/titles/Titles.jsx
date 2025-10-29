import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Save, X, ChevronLeft, ChevronRight, User, Award } from 'lucide-react';
import axios from 'axios';

const TitlesList = () => {
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  const [formData, setFormData] = useState({
    title: '',
    isActive: true,
    isDefault: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(filteredTitles.length / pageSize);
  const paginatedData = filteredTitles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
        isActive: formData.isActive,
        isDefault: formData.isDefault,
      });

      setTitles([...titles, res.data]);
      setFormData({ title: '', isActive: true, isDefault: false });
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
      isActive: title.isActive,
      isDefault: title.isDefault,
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/titles/${editingId}`,
        {
          title: formData.title,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
        }
      );

      setTitles(prev =>
        prev.map(t => t._id === editingId ? res.data : t)
      );
      setEditingId(null);
      setFormData({ title: '', isActive: true, isDefault: false });
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
    setFormData({ title: '', isActive: true, isDefault: false });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({ title: '', isActive: true, isDefault: false });
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
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title (e.g., Mr., Dr., Prof.)"
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
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title (e.g., Mr., Dr., Prof.)"
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

        {/* Titles Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#450693] to-[#8C00FF] text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Title</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Default</th>
                  <th className="p-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((t, index) => (
                  <tr key={t._id} className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}>
                    <td className="p-4 text-gray-600">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>

                    {/* Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] rounded-full flex items-center justify-center text-white font-medium">
                          <User size={16} />
                        </div>
                        <div className="font-medium text-gray-900">{t.title}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      {getStatusBadge(t.isActive)}
                    </td>

                    {/* Default */}
                    <td className="p-4 text-center">
                      {getDefaultBadge(t.isDefault)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === t._id ? (
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Save size={16} />
                            Save
                          </button>
                        ) : (
                          <>
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
                                t.isActive
                                  ? 'bg-gray-500 hover:bg-gray-600'
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                              title={t.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {t.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(t._id)}
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
                ))}
              </tbody>
            </table>

            {paginatedData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No titles found matching your search.' : 'No titles available.'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTitles.length)} of {filteredTitles.length} entries
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

export default TitlesList;