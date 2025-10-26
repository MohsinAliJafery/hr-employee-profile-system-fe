import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TitlesList = () => {
  const [titles, setTitles] = useState([
    { id: 1, title: 'Mr.' },
    { id: 2, title: 'Mrs.' },
    { id: 3, title: 'Miss' },
    { id: 4, title: 'Dr.' },
    { id: 5, title: 'Prof.' },
    { id: 6, title: 'Engr.' },
    { id: 7, title: 'Sir' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Pagination logic
  const totalPages = Math.ceil(titles.length / pageSize);
  const paginatedData = titles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!formData.title) return alert('Please enter a title');
    const newTitle = { id: Date.now(), title: formData.title };
    setTitles([...titles, newTitle]);
    setFormData({ title: '' });
  };

  const handleEdit = (id) => {
    const t = titles.find((x) => x.id === id);
    setEditingId(id);
    setFormData({ title: t.title });
  };

  const handleSave = () => {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === editingId ? { ...t, title: formData.title } : t
      )
    );
    setEditingId(null);
    setFormData({ title: '' });
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
      <div className="flex items-center gap-2 mb-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Title (e.g. Mr., Dr.)"
          className="border p-2 rounded w-1/3"
        />

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
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((t, index) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {index + 1 + (currentPage - 1) * pageSize}
              </td>
              <td className="border p-2">{t.title}</td>
              <td className="border p-2 text-center flex justify-center gap-2">
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
