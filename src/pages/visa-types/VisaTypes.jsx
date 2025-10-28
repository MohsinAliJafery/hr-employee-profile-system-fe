import React, { useState } from 'react';

const VisaTypeList = () => {
  const [visaTypes, setVisaTypes] = useState([
    {
      id: 1,
      type: 'Employment Visa',
      employees: ['Ali Khan', 'Sara Ahmed'],
      active: 1,
      isDefault: 0,
    },
    {
      id: 2,
      type: 'Business Visa',
      employees: ['Bilal Hussain'],
      active: 1,
      isDefault: 1,
    },
    {
      id: 3,
      type: 'Visit Visa',
      employees: ['Zara Shah', 'Ayesha Noor'],
      active: 0,
      isDefault: 0,
    },
  ]);

  const [newType, setNewType] = useState({
    type: '',
    active: 1,
    isDefault: 0,
  });

  const [editingType, setEditingType] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = visaTypes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(visaTypes.length / recordsPerPage);

  // Add Visa Type
  const handleAddType = () => {
    if (!newType.type.trim()) return alert('Please enter visa type name.');
    const exists = visaTypes.find(
      (v) => v.type.toLowerCase() === newType.type.toLowerCase()
    );
    if (exists) {
      alert('⚠️ Visa Type already exists!');
      return;
    }

    setVisaTypes([
      ...visaTypes,
      {
        id: Date.now(),
        type: newType.type,
        employees: [],
        active: newType.active,
        isDefault: newType.isDefault,
      },
    ]);

    setNewType({ type: '', active: 1, isDefault: 0 });
  };

  // Edit Visa Type
  const handleEdit = (visa) => {
    setEditingType({ ...visa });
  };

  const handleSaveEdit = () => {
    setVisaTypes((prev) =>
      prev.map((v) => (v.id === editingType.id ? editingType : v))
    );
    setEditingType(null);
  };

  const handleCancelEdit = () => {
    setEditingType(null);
  };

  // Delete Visa Type
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this visa type?')) {
      setVisaTypes(visaTypes.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🛂 Visa Type Management
      </h2>

      {/* ➕ Add New Visa Type */}
      <div className="flex gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Enter visa type name"
          value={newType.type}
          onChange={(e) => setNewType({ ...newType, type: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-5 w-5 accent-blue-600 cursor-pointer"
            checked={newType.active === 1}
            onChange={(e) =>
              setNewType({ ...newType, active: e.target.checked ? 1 : 0 })
            }
          />
          Active
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-5 w-5 accent-blue-600 cursor-pointer"
            checked={newType.isDefault === 1}
            onChange={(e) =>
              setNewType({ ...newType, isDefault: e.target.checked ? 1 : 0 })
            }
          />
          Default
        </label>

        <button
          onClick={handleAddType}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 🧾 Visa Type Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3 text-left">Visa Type</th>
            <th className="border p-3 text-center">Employees</th>
            <th className="border p-3 text-center">Active</th>
            <th className="border p-3 text-center">Default</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((visa) => (
            <React.Fragment key={visa.id}>
              <tr
                className={`hover:bg-blue-50 ${
                  showEmployees === visa.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="border p-3">
                  {editingType?.id === visa.id ? (
                    <input
                      type="text"
                      value={editingType.type}
                      onChange={(e) =>
                        setEditingType({ ...editingType, type: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    visa.type
                  )}
                </td>

                <td className="border p-3 text-center">
                  {visa.employees.length}
                </td>

                <td className="border p-3 text-center">
                  {editingType?.id === visa.id ? (
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-blue-600 cursor-pointer"
                      checked={editingType.active === 1}
                      onChange={(e) =>
                        setEditingType({
                          ...editingType,
                          active: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                  ) : visa.active === 1 ? (
                    'Active'
                  ) : (
                    'Inactive'
                  )}
                </td>

                <td className="border p-3 text-center">
                  {editingType?.id === visa.id ? (
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-blue-600 cursor-pointer"
                      checked={editingType.isDefault === 1}
                      onChange={(e) =>
                        setEditingType({
                          ...editingType,
                          isDefault: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                  ) : visa.isDefault === 1 ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </td>

                <td className="border p-3 text-center space-x-2">
                  {editingType?.id === visa.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setShowEmployees(
                            showEmployees === visa.id ? null : visa.id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(visa)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(visa.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* 👥 Employees Under Visa Type */}
              {showEmployees === visa.id && (
                <tr>
                  <td colSpan="5" className="border p-3 bg-gray-50">
                    <h4 className="font-semibold mb-2">
                      Employees under {visa.type}
                    </h4>
                    {visa.employees.length > 0 ? (
                      <ul className="list-disc pl-6">
                        {visa.employees.map((emp, i) => (
                          <li key={i}>{emp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No employees under this visa type.
                      </p>
                    )}
                    <div className="text-right mt-2">
                      <button
                        onClick={() => setShowEmployees(null)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Close
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 bg-blue-100 rounded text-blue-800">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VisaTypeList;
