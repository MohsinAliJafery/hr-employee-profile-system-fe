import React, { useState } from 'react';

const DepartmentList = () => {
  // 🧠 Dummy Data
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'IT',
      employees: ['Ali Khan', 'Sara Ahmed'],
      status: 1,
      isDefault: true,
    },
    {
      id: 2,
      name: 'HR',
      employees: ['Bilal Hussain'],
      status: 1,
      isDefault: false,
    },
    {
      id: 3,
      name: 'Finance',
      employees: ['Ayesha Noor'],
      status: 0,
      isDefault: false,
    },
    {
      id: 4,
      name: 'Marketing',
      employees: ['Zara Shah'],
      status: 1,
      isDefault: false,
    },
    {
      id: 5,
      name: 'Support',
      employees: ['Kashif Ali'],
      status: 0,
      isDefault: false,
    },
  ]);

  const [newDept, setNewDept] = useState('');
  const [newDefault, setNewDefault] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);

  // 🧭 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const paginatedDepartments = departments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ➕ Add Department
  const handleAddDepartment = () => {
    if (!newDept.trim()) return;
    const exists = departments.find(
      (d) => d.name.toLowerCase() === newDept.toLowerCase()
    );
    if (exists) {
      alert('⚠️ Department already exists!');
      return;
    }

    // if default selected, make others false
    const updatedDepartments = newDefault
      ? departments.map((d) => ({ ...d, isDefault: false }))
      : departments;

    setDepartments([
      ...updatedDepartments,
      {
        id: Date.now(),
        name: newDept,
        employees: [],
        status: 1,
        isDefault: newDefault,
      },
    ]);
    setNewDept('');
    setNewDefault(false);
  };

  // ✏️ Edit Department
  const handleEditDepartment = (dept) => {
    setEditingDept({ ...dept });
  };

  const handleSaveEdit = () => {
    // if editing marked as default, make others false
    let updatedDepartments = departments;
    if (editingDept.isDefault) {
      updatedDepartments = departments.map((d) =>
        d.id === editingDept.id
          ? { ...editingDept }
          : { ...d, isDefault: false }
      );
    } else {
      updatedDepartments = departments.map((d) =>
        d.id === editingDept.id ? editingDept : d
      );
    }
    setDepartments(updatedDepartments);
    setEditingDept(null);
  };

  const handleCancelEdit = () => {
    setEditingDept(null);
  };

  // 🔁 Toggle Status
  const toggleStatus = (id) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
  };

  // ❌ Delete Department
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🏢 Department Management
      </h2>

      {/* ➕ Add New Department */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Enter department name"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newDefault}
            onChange={() => setNewDefault(!newDefault)}
          />
          <span>Set as Default</span>
        </label>
        <button
          onClick={handleAddDepartment}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 🧮 Department Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3 text-left">Department</th>
            <th className="border p-3 text-center">Employees</th>
            <th className="border p-3 text-center">Status</th>
            <th className="border p-3 text-center">Is Default</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDepartments.map((dept) => (
            <React.Fragment key={dept.id}>
              <tr
                className={`hover:bg-blue-50 ${
                  showEmployees === dept.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="border p-3">
                  {editingDept?.id === dept.id ? (
                    <input
                      type="text"
                      value={editingDept.name}
                      onChange={(e) =>
                        setEditingDept({ ...editingDept, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    dept.name
                  )}
                </td>

                <td className="border p-3 text-center">
                  {dept.employees.length}
                </td>

                <td className="border p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded text-white text-sm ${
                      dept.status === 1 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {dept.status === 1 ? 'Active' : 'In-Active'}
                  </span>
                </td>

                <td className="border p-3 text-center">
                  {editingDept?.id === dept.id ? (
                    <input
                      type="checkbox"
                      checked={editingDept.isDefault}
                      onChange={() =>
                        setEditingDept({
                          ...editingDept,
                          isDefault: !editingDept.isDefault,
                        })
                      }
                    />
                  ) : dept.isDefault ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>

                <td className="border p-3 text-center space-x-2">
                  {editingDept?.id === dept.id ? (
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
                            showEmployees === dept.id ? null : dept.id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        {showEmployees === dept.id ? 'Hide' : 'View'}
                      </button>
                      <button
                        onClick={() => handleEditDepartment(dept)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(dept.id)}
                        className={`${
                          dept.status === 1
                            ? 'bg-gray-500 hover:bg-gray-600'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white px-3 py-1 rounded`}
                      >
                        {dept.status === 1 ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* 👥 Employee List (View) */}
              {showEmployees === dept.id && (
                <tr>
                  <td colSpan="5" className="border p-3 bg-gray-50">
                    <h4 className="font-semibold mb-2">
                      Employees in {dept.name}
                    </h4>
                    {dept.employees.length > 0 ? (
                      <ul className="list-disc pl-6">
                        {dept.employees.map((emp, i) => (
                          <li key={i}>{emp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No employees in this department.
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

      {/* 📄 Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DepartmentList;
