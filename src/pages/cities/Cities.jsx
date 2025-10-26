import React, { useState } from 'react';

const CityList = () => {
  // 🌍 Dummy Countries
  const [countries] = useState([
    { id: 1, name: 'Saudi Arabia' },
    { id: 2, name: 'Pakistan' },
    { id: 3, name: 'UAE' },
    { id: 4, name: 'Qatar' },
  ]);

  // 🧠 Dummy City Data
  const [cities, setCities] = useState([
    {
      id: 1,
      name: 'Riyadh',
      countryId: 1,
      employees: ['Ali Khan', 'Fatima Tariq'],
    },
    { id: 2, name: 'Karachi', countryId: 2, employees: ['Sara Ahmed'] },
    {
      id: 3,
      name: 'Dubai',
      countryId: 3,
      employees: ['Bilal Hussain', 'Zara Shah'],
    },
    { id: 4, name: 'Doha', countryId: 4, employees: [] },
  ]);

  const [newCity, setNewCity] = useState({ name: '', countryId: '' });
  const [editingCity, setEditingCity] = useState(null);
  const [showEmployees, setShowEmployees] = useState(null);

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = cities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(cities.length / recordsPerPage);

  // ➕ Add City
  const handleAddCity = () => {
    if (!newCity.name.trim() || !newCity.countryId) {
      alert('⚠️ Please fill in both City Name and Country.');
      return;
    }
    const exists = cities.find(
      (c) => c.name.toLowerCase() === newCity.name.toLowerCase()
    );
    if (exists) {
      alert('⚠️ City already exists!');
      return;
    }
    setCities([
      ...cities,
      {
        id: Date.now(),
        name: newCity.name,
        countryId: Number(newCity.countryId),
        employees: [],
      },
    ]);
    setNewCity({ name: '', countryId: '' });
  };

  // ✏️ Edit City
  const handleEdit = (city) => setEditingCity(city);

  const handleSaveEdit = () => {
    setCities((prev) =>
      prev.map((c) =>
        c.id === editingCity.id
          ? { ...editingCity, countryId: Number(editingCity.countryId) }
          : c
      )
    );
    setEditingCity(null);
  };

  const handleCancelEdit = () => setEditingCity(null);

  // ❌ Delete City
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      setCities(cities.filter((c) => c.id !== id));
    }
  };

  // 🌍 Get Country Name
  const getCountryName = (id) =>
    countries.find((c) => c.id === id)?.name || 'N/A';

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🏙️ City Management
      </h2>

      {/* ➕ Add City */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city name"
          value={newCity.name}
          onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <select
          value={newCity.countryId}
          onChange={(e) =>
            setNewCity({ ...newCity, countryId: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddCity}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 📋 City Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3 text-left">City</th>
            <th className="border p-3 text-left">Country</th>
            <th className="border p-3 text-center">Employees</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((city) => (
            <React.Fragment key={city.id}>
              <tr
                className={`hover:bg-blue-50 ${
                  showEmployees === city.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="border p-3">
                  {editingCity?.id === city.id ? (
                    <input
                      type="text"
                      value={editingCity.name}
                      onChange={(e) =>
                        setEditingCity({ ...editingCity, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    city.name
                  )}
                </td>
                <td className="border p-3">
                  {editingCity?.id === city.id ? (
                    <select
                      value={editingCity.countryId}
                      onChange={(e) =>
                        setEditingCity({
                          ...editingCity,
                          countryId: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getCountryName(city.countryId)
                  )}
                </td>
                <td className="border p-3 text-center">
                  {city.employees.length}
                </td>
                <td className="border p-3 text-center space-x-2">
                  {editingCity?.id === city.id ? (
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
                            showEmployees === city.id ? null : city.id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(city)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* 👥 Employees Under City */}
              {showEmployees === city.id && (
                <tr>
                  <td colSpan="4" className="border p-3 bg-gray-50">
                    <h4 className="font-semibold mb-2">
                      Employees in {city.name}
                    </h4>
                    {city.employees.length > 0 ? (
                      <ul className="list-disc pl-6">
                        {city.employees.map((emp, i) => (
                          <li key={i}>{emp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No employees in this city.
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

export default CityList;
