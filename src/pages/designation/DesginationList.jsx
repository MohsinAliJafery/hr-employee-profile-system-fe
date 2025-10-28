import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const DesignationList = () => {
  const departments = useMemo(
    () => ['IT', 'HR', 'Finance', 'Marketing', 'Operations'],
    []
  );

  const [designations, setDesignations] = useState([
    {
      id: 1,
      department: 'IT',
      title: 'Frontend Developer',
      employees: 5,
      isActive: true,
      isDefault: false,
    },
    {
      id: 2,
      department: 'IT',
      title: 'Backend Developer',
      employees: 3,
      isActive: true,
      isDefault: false,
    },
    {
      id: 3,
      department: 'HR',
      title: 'Recruiter',
      employees: 2,
      isActive: false,
      isDefault: false,
    },
    {
      id: 4,
      department: 'Finance',
      title: 'Accountant',
      employees: 4,
      isActive: true,
      isDefault: true,
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    title: '',
    isActive: false,
    isDefault: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const totalPages = Math.ceil(designations.length / pageSize);
  const paginatedData = designations.slice(
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

  const handleAdd = () => {
    if (!formData.department || !formData.title)
      return alert('Please fill all fields!');
    const newDesignation = {
      id: Date.now(),
      department: formData.department,
      title: formData.title,
      employees: 0,
      isActive: formData.isActive,
      isDefault: formData.isDefault,
    };
    setDesignations([...designations, newDesignation]);
    setFormData({
      department: '',
      title: '',
      isActive: false,
      isDefault: false,
    });
  };

  const handleEdit = (id) => {
    const desig = designations.find((d) => d.id === id);
    setEditingId(id);
    setFormData({
      department: desig.department,
      title: desig.title,
      isActive: desig.isActive,
      isDefault: desig.isDefault,
    });
  };

  const handleSave = () => {
    setDesignations((prev) =>
      prev.map((d) =>
        d.id === editingId
          ? {
              ...d,
              department: formData.department,
              title: formData.title,
              isActive: formData.isActive,
              isDefault: formData.isDefault,
            }
          : d
      )
    );
    setEditingId(null);
    setFormData({
      department: '',
      title: '',
      isActive: false,
      isDefault: false,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      setDesignations(designations.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">🏷️ Designation Management</h2>

      {/* Add or Edit Section */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="border p-2 rounded w-1/5"
        >
          <option value="">Select Department</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Designation Title"
          className="border p-2 rounded w-1/5"
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
            <th className="border p-2">Department</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2 text-center">Active</th>
            <th className="border p-2 text-center">Default</th>
            <th className="border p-2">Employees</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((desig, index) => (
            <tr key={desig.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {index + 1 + (currentPage - 1) * pageSize}
              </td>
              <td className="border p-2">{desig.department}</td>
              <td className="border p-2">{desig.title}</td>

              {/* Active Checkbox */}
              <td className="border p-2 text-center">
                {editingId === desig.id ? (
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                  />
                ) : desig.isActive ? (
                  '✅'
                ) : (
                  '❌'
                )}
              </td>

              {/* Default Checkbox */}
              <td className="border p-2 text-center">
                {editingId === desig.id ? (
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-5 w-5 accent-green-600 cursor-pointer"
                  />
                ) : desig.isDefault ? (
                  '⭐'
                ) : (
                  '-'
                )}
              </td>

              <td className="border p-2">{desig.employees}</td>

              <td className="border p-2 text-center flex justify-center gap-2">
                <button
                  onClick={() => alert(`Viewing employees for ${desig.title}`)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => handleEdit(desig.id)}
                  className="text-yellow-600 hover:underline flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(desig.id)}
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

export default DesignationList;
