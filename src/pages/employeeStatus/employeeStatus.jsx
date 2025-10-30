import React, { useState, useEffect } from 'react';

const EmployeeStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState({
    status: '',
    isActive: true,
    isDefault: false,
    order: '',
  });
  const [search, setSearch] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const apiUrl = 'http://localhost:5000/api/employee-status';

  // ✅ Fetch all employee statuses
  const fetchStatuses = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setStatuses(data.statuses || []);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // ✅ Add new status
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus),
      });

      const data = await res.json();

      if (res.ok) {
        setStatuses((prevStatuses) => {
          let updated = [...prevStatuses];

          // If new one isDefault, set all others to false
          if (data.isDefault) {
            updated = updated.map((s) => ({ ...s, isDefault: false }));
          }

          // Add new record on top
          return [data, ...updated];
        });

        setNewStatus({
          status: '',
          isActive: true,
          isDefault: false,
          order: '',
        });
      } else {
        if (!res.ok) {
          window.alert(newStatus.status + ' status is already exists.');
          return;
        }
      }
    } catch (err) {
      console.error('Error adding status:', err);
    }
  };

  // ✅ Update existing status
  const handleUpdate = async () => {
    const response = await fetch(
      `http://localhost:5000/api/employee-status/${editingStatus._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStatus),
      }
    );

    const updated = await response.json();

    // 👇 Update the frontend state to reflect backend behavior
    if (!response.ok) {
      window.alert(editingStatus.status + ' is already exists.');
      return;
    }
    setStatuses((prev) =>
      prev.map((s) =>
        s._id === updated._id
          ? updated
          : { ...s, isDefault: updated.isDefault ? false : s.isDefault }
      )
    );

    setEditingStatus(null);
  };

  // ✅ Delete a status
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        setStatuses(statuses.filter((s) => s._id !== id));
      } catch (err) {
        console.error('Error deleting status:', err);
      }
    }
  };

  // ✅ Filter and paginate data
  const filteredStatuses = statuses.filter((s) =>
    s.status.toLowerCase().includes(search.toLowerCase())
  );
  const startIndex = (page - 1) * recordsPerPage;
  const paginatedStatuses = filteredStatuses.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  const totalPages = Math.ceil(filteredStatuses.length / recordsPerPage);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee Status Management</h2>

      {/* ➕ Add New Status Form */}
      <form
        onSubmit={handleAdd}
        className="mb-6 grid grid-cols-6 gap-3 items-center"
      >
        <input
          type="text"
          placeholder="Status Name"
          value={newStatus.status}
          onChange={(e) =>
            setNewStatus({ ...newStatus, status: e.target.value })
          }
          className="border p-2 rounded col-span-2"
          required
        />
        <input
          type="number"
          placeholder="Order"
          value={newStatus.order}
          onChange={(e) =>
            setNewStatus({ ...newStatus, order: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newStatus.isActive}
            onChange={(e) =>
              setNewStatus({ ...newStatus, isActive: e.target.checked })
            }
          />
          Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newStatus.isDefault}
            onChange={(e) =>
              setNewStatus({ ...newStatus, isDefault: e.target.checked })
            }
          />
          Default
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Status
        </button>
      </form>

      {/* 🔍 Search + Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <div className="flex items-center gap-2">
          <label>Show</label>
          <select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
          <label>per page</label>
        </div>
      </div>

      {/* 📋 Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border text-left">Status</th>
            <th className="p-2 border">Order</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Default</th>
            <th className="p-2 border">Total Employees</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStatuses.map((status, index) => (
            <tr key={status._id} className="hover:bg-gray-100">
              <td className="p-2 border text-center">
                {startIndex + index + 1}
              </td>

              {/* Editable Status */}
              <td className="p-2 border">
                {editingStatus?._id === status._id ? (
                  <input
                    value={editingStatus.status}
                    onChange={(e) =>
                      setEditingStatus({
                        ...editingStatus,
                        status: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  status.status
                )}
              </td>

              {/* Editable Order */}
              <td className="p-2 border text-center">
                {editingStatus?._id === status._id ? (
                  <input
                    type="number"
                    value={editingStatus.order}
                    onChange={(e) =>
                      setEditingStatus({
                        ...editingStatus,
                        order: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-16 text-center"
                  />
                ) : (
                  status.order
                )}
              </td>

              {/* Editable Active */}
              <td className="p-2 border text-center">
                {editingStatus?._id === status._id ? (
                  <input
                    type="checkbox"
                    checked={editingStatus.isActive}
                    onChange={(e) =>
                      setEditingStatus({
                        ...editingStatus,
                        isActive: e.target.checked,
                      })
                    }
                  />
                ) : status.isActive ? (
                  '✅'
                ) : (
                  '❌'
                )}
              </td>

              {/* Editable Default */}
              <td className="p-2 border text-center">
                {editingStatus?._id === status._id ? (
                  <input
                    type="checkbox"
                    checked={editingStatus.isDefault}
                    onChange={(e) =>
                      setEditingStatus({
                        ...editingStatus,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                ) : status.isDefault ? (
                  '✅'
                ) : (
                  '❌'
                )}
              </td>

              {/* Total Employees */}
              <td className="p-2 border text-center">
                {status.totalEmployees || 0}
              </td>

              {/* Actions */}
              <td className="p-2 border text-center">
                {editingStatus?._id === status._id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingStatus(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingStatus(status)}
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(status._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="py-1 px-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeStatus;
