import React, { useState, useMemo } from 'react';
import { Edit, Trash2, X } from 'lucide-react';

const NationalityList = () => {
  const [nationalities, setNationalities] = useState([
    { id: 1, name: 'Pakistani', isActive: true, isDefault: true, order: 1 },
    { id: 2, name: 'Indian', isActive: true, isDefault: false, order: 2 },
    { id: 3, name: 'Bangladeshi', isActive: true, isDefault: false, order: 3 },
    { id: 4, name: 'Sri Lankan', isActive: false, isDefault: false, order: 4 },
    { id: 5, name: 'Nepali', isActive: true, isDefault: false, order: 5 },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: false,
    isDefault: false,
    order: '',
  });

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter + Paginate
  const filteredData = useMemo(() => {
    return nationalities.filter((n) =>
      n.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [nationalities, search]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
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
    if (!formData.name.trim()) return alert('Please enter nationality name');
    if (!formData.order) return alert('Please enter order number');

    const newNationality = {
      id: Date.now(),
      name: formData.name.trim(),
      isActive: formData.isActive,
      isDefault: formData.isDefault,
      order: Number(formData.order),
    };

    setNationalities([...nationalities, newNationality]);
    setFormData({ name: '', isActive: false, isDefault: false, order: '' });
  };

  const handleEdit = (id) => {
    const n = nationalities.find((x) => x.id === id);
    setEditingId(id);
    setFormData({
      name: n.name,
      isActive: n.isActive,
      isDefault: n.isDefault,
      order: n.order,
    });
  };

  const handleSave = () => {
    setNationalities((prev) =>
      prev.map((n) =>
        n.id === editingId
          ? {
              ...n,
              name: formData.name,
              isActive: formData.isActive,
              isDefault: formData.isDefault,
              order: Number(formData.order),
            }
          : n
      )
    );
    setEditingId(null);
    setFormData({ name: '', isActive: false, isDefault: false, order: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', isActive: false, isDefault: false, order: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this nationality?')) {
      setNationalities(nationalities.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">🌍 Nationality Management</h2>

      {/* Add / Edit Section */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Nationality (e.g. Pakistani)"
          className="border p-2 rounded w-1/4"
        />

        <input
          name="order"
          value={formData.order}
          onChange={handleChange}
          placeholder="Order"
          type="number"
          className="border p-2 rounded w-20"
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
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              💾 Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add
          </button>
        )}
      </div>

      {/* Search + Page size */}
      <div className="flex justify-between mb-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search nationality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />

        <div className="flex items-center gap-2">
          <label>Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border p-1 rounded"
          >
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="border p-2 text-center">Order</th>
            <th className="border p-2">Nationality</th>
            <th className="border p-2 text-center">Active</th>
            <th className="border p-2 text-center">Default</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((n) => (
            <tr key={n.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">
                {editingId === n.id ? (
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="border p-1 rounded w-16 text-center"
                  />
                ) : (
                  n.order
                )}
              </td>

              <td className="border p-2">
                {editingId === n.id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  n.name
                )}
              </td>

              <td className="border p-2 text-center">
                {editingId === n.id ? (
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                ) : n.isActive ? (
                  '✅'
                ) : (
                  '❌'
                )}
              </td>

              <td className="border p-2 text-center">
                {editingId === n.id ? (
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-5 w-5 accent-green-600 cursor-pointer"
                  />
                ) : n.isDefault ? (
                  '⭐'
                ) : (
                  '-'
                )}
              </td>

              <td className="border p-2 text-center flex justify-center gap-2">
                {editingId === n.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:underline flex items-center gap-1"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(n.id)}
                      className="text-yellow-600 hover:underline flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
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

export default NationalityList;
