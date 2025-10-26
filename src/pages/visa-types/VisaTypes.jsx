import React, { useState } from 'react';

const VisaTypeList = () => {
  const [visaTypes, setVisaTypes] = useState([
    { id: 1, type: 'Employment Visa', employees: ['Ali Khan', 'Sara Ahmed'] },
    { id: 2, type: 'Business Visa', employees: ['Bilal Hussain'] },
    { id: 3, type: 'Visit Visa', employees: ['Zara Shah', 'Ayesha Noor'] },
    { id: 4, type: 'Student Visa', employees: [] },
    { id: 5, type: 'Family Visa', employees: ['Hamza Iqbal'] },
  ]);

  const [newType, setNewType] = useState('');
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
    if (!newType.trim()) return alert('Please enter visa type name.');
    const exists = visaTypes.find(
      (v) => v.type.toLowerCase() === newType.toLowerCase()
    );
    if (exists) {
      alert('⚠️ Visa Type already exists!');
      return;
    }
    setVisaTypes([
      ...visaTypes,
      { id: Date.now(), type: newType, employees: [] },
    ]);
    setNewType('');
  };

  // Edit Visa Type
  const handleEdit = (id, type) => {
    setEditingType({ id, type });
  };

  const handleSaveEdit = () => {
    setVisaTypes((prev) =>
      prev.map((v) =>
        v.id === editingType.id ? { ...v, type: editingType.type } : v
      )
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
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🛂 Visa Type Management
      </h2>

      {/* ➕ Add New Visa Type */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter visa type name"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border p-2 rounded w-full"
        />
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
                        onClick={() => handleEdit(visa.id, visa.type)}
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
                  <td colSpan="3" className="border p-3 bg-gray-50">
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
