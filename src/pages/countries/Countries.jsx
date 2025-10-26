import React, { useState } from 'react';

const CountryList = () => {
  const [countries, setCountries] = useState([
    { id: 1, name: 'Saudi Arabia', employees: ['Ali Khan', 'Bilal Hussain'] },
    { id: 2, name: 'Pakistan', employees: ['Sara Ahmed', 'Zara Shah'] },
    { id: 3, name: 'UAE', employees: ['Hamza Iqbal'] },
    { id: 4, name: 'Qatar', employees: [] },
    { id: 5, name: 'Oman', employees: ['Fatima Tariq'] },
  ]);

  const [newCountry, setNewCountry] = useState('');
  const [editingCountry, setEditingCountry] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = countries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(countries.length / recordsPerPage);

  // Add Country
  const handleAddCountry = () => {
    if (!newCountry.trim()) return alert('Please enter country name.');
    const exists = countries.find(
      (c) => c.name.toLowerCase() === newCountry.toLowerCase()
    );
    if (exists) {
      alert('⚠️ Country already exists!');
      return;
    }
    setCountries([
      ...countries,
      { id: Date.now(), name: newCountry, employees: [] },
    ]);
    setNewCountry('');
  };

  // Edit Country
  const handleEdit = (id, name) => {
    setEditingCountry({ id, name });
  };

  const handleSaveEdit = () => {
    setCountries((prev) =>
      prev.map((c) =>
        c.id === editingCountry.id ? { ...c, name: editingCountry.name } : c
      )
    );
    setEditingCountry(null);
  };

  const handleCancelEdit = () => {
    setEditingCountry(null);
  };

  // Delete Country
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      setCountries(countries.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🌍 Country Management
      </h2>

      {/* ➕ Add New Country */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter country name"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddCountry}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 🧾 Country Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3 text-left">Country</th>
            <th className="border p-3 text-center">Employees</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((country) => (
            <React.Fragment key={country.id}>
              <tr
                className={`hover:bg-blue-50 ${
                  showEmployees === country.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="border p-3">
                  {editingCountry?.id === country.id ? (
                    <input
                      type="text"
                      value={editingCountry.name}
                      onChange={(e) =>
                        setEditingCountry({
                          ...editingCountry,
                          name: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    country.name
                  )}
                </td>
                <td className="border p-3 text-center">
                  {country.employees.length}
                </td>
                <td className="border p-3 text-center space-x-2">
                  {editingCountry?.id === country.id ? (
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
                            showEmployees === country.id ? null : country.id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(country.id, country.name)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(country.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* 👥 Employees Under Country */}
              {showEmployees === country.id && (
                <tr>
                  <td colSpan="3" className="border p-3 bg-gray-50">
                    <h4 className="font-semibold mb-2">
                      Employees in {country.name}
                    </h4>
                    {country.employees.length > 0 ? (
                      <ul className="list-disc pl-6">
                        {country.employees.map((emp, i) => (
                          <li key={i}>{emp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No employees in this country.
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

export default CountryList;
