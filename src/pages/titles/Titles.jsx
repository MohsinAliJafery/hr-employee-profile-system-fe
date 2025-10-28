import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TitlesList = () => {
  const [titles, setTitles] = useState([
    { id: 1, title: 'Mr.', isActive: true, isDefault: true },
    { id: 2, title: 'Mrs.', isActive: true, isDefault: false },
    { id: 3, title: 'Miss', isActive: false, isDefault: false },
    { id: 4, title: 'Dr.', isActive: true, isDefault: false },
    { id: 5, title: 'Prof.', isActive: true, isDefault: false },
    { id: 6, title: 'Engr.', isActive: false, isDefault: false },
    { id: 7, title: 'Sir', isActive: true, isDefault: false },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    isActive: false,
    isDefault: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(titles.length / pageSize);
  const paginatedData = titles.slice(
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

  const handleAdd = () => {
    if (!formData.title) return alert('Please enter a title');
    const newTitle = {
      id: Date.now(),
      title: formData.title,
      isActive: formData.isActive,
      isDefault: formData.isDefault,
    };
    setTitles([...titles, newTitle]);
    setFormData({ title: '', isActive: false, isDefault: false });
  };

  const handleEdit = (id) => {
    const t = titles.find((x) => x.id === id);
    setEditingId(id);
    setFormData({
      title: t.title,
      isActive: t.isActive,
      isDefault: t.isDefault,
    });
  };

  const handleSave = () => {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              title: formData.title,
              isActive: formData.isActive,
              isDefault: formData.isDefault,
            }
          : t
      )
    );
    setEditingId(null);
    setFormData({ title: '', isActive: false, isDefault: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this title?')) {
      setTitles(titles.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">🎓 Title Management</h2>

      {/* Add / Edit Section */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Title (e.g. Mr., Dr.)"
          className="border p-2 rounded w-1/4"
        />

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 accent-blue-600 cursor-pointer"
          />
          Active
        </label>

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-5 w-5 accent-green-600 cursor-pointer"
          />
          Default
        </label>

        {editingId ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            💾 Save
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="border p-2">#</th>
            <th className="border p-2">Title</th>
            <th className="border p-2 text-center">Active</th>
            <th className="border p-2 text-center">Default</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((t, index) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {index + 1 + (currentPage - 1) * pageSize}
              </td>

              {/* Editable title */}
              <td className="border p-2">
                {editingId === t.id ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  t.title
                )}
              </td>

              {/* isActive checkbox */}
              <td className="border p-2 text-center">
                {editingId === t.id ? (
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                ) : t.isActive ? (
                  '✅'
                ) : (
                  '❌'
                )}
              </td>

              {/* isDefault checkbox */}
              <td className="border p-2 text-center">
                {editingId === t.id ? (
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-5 w-5 accent-green-600 cursor-pointer"
                  />
                ) : t.isDefault ? (
                  '⭐'
                ) : (
                  '-'
                )}
              </td>

              {/* Actions */}
              <td className="border p-2 text-center flex justify-center gap-2">
                {editingId === t.id ? (
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    💾 Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(t.id)}
                      className="text-yellow-600 hover:underline flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TitlesList;
