import React, { useState } from 'react';

const ResidencyStatus = () => {
  // 🧠 Dummy Data
  const [statuses, setStatuses] = useState([
    {
      id: 1,
      employeeId: 101,
      employeeName: 'Ali Khan',
      visaType: 'Work Visa',
      nationality: 'Pakistan',
      validUntil: '2026-05-18',
      proof: 'residency_ali.pdf',
    },
    {
      id: 2,
      employeeId: 101,
      employeeName: 'Ali Khan',
      visaType: 'Business Visa',
      nationality: 'UAE',
      validUntil: '2025-08-09',
      proof: 'business_ali.pdf',
    },
    {
      id: 3,
      employeeId: 102,
      employeeName: 'Sara Ahmed',
      visaType: 'Family Visa',
      nationality: 'Canada',
      validUntil: '2026-02-11',
      proof: 'family_sara.pdf',
    },
  ]);

  const [newStatus, setNewStatus] = useState({
    employeeId: '',
    employeeName: '',
    visaType: '',
    nationality: '',
    validUntil: '',
    proof: null,
  });

  const [editingStatus, setEditingStatus] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Dummy dropdown data
  const employees = [
    { id: 101, name: 'Ali Khan' },
    { id: 102, name: 'Sara Ahmed' },
    { id: 103, name: 'Bilal Hussain' },
  ];

  const visaTypes = [
    'Work Visa',
    'Business Visa',
    'Family Visa',
    'Student Visa',
  ];
  const nationalities = ['Pakistan', 'UAE', 'Canada', 'Saudi Arabia'];

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentStatuses = statuses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(statuses.length / perPage);

  // 🧩 Add or Update Residency
  const handleSave = () => {
    if (
      !newStatus.employeeId ||
      !newStatus.visaType ||
      !newStatus.nationality ||
      !newStatus.validUntil
    ) {
      alert('⚠️ Please fill in all required fields.');
      return;
    }

    if (editingStatus) {
      setStatuses((prev) =>
        prev.map((s) =>
          s.id === editingStatus.id
            ? {
                ...newStatus,
                id: editingStatus.id,
                employeeName:
                  employees.find((e) => e.id === parseInt(newStatus.employeeId))
                    ?.name || '',
                proof: newStatus.proof?.name || editingStatus.proof,
              }
            : s
        )
      );
      setEditingStatus(null);
    } else {
      setStatuses([
        ...statuses,
        {
          id: Date.now(),
          ...newStatus,
          employeeName:
            employees.find((e) => e.id === parseInt(newStatus.employeeId))
              ?.name || '',
          proof: newStatus.proof?.name || 'N/A',
        },
      ]);
    }

    setNewStatus({
      employeeId: '',
      employeeName: '',
      visaType: '',
      nationality: '',
      validUntil: '',
      proof: null,
    });
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setNewStatus({
      employeeId: status.employeeId,
      visaType: status.visaType,
      nationality: status.nationality,
      validUntil: status.validUntil,
      proof: null,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setStatuses(statuses.filter((s) => s.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingStatus(null);
    setNewStatus({
      employeeId: '',
      employeeName: '',
      visaType: '',
      nationality: '',
      validUntil: '',
      proof: null,
    });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        🪪 Residency Status Management
      </h2>

      {/* ➕ Add / Edit Residency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <select
          className="border p-2 rounded"
          value={newStatus.employeeId}
          onChange={(e) =>
            setNewStatus({ ...newStatus, employeeId: e.target.value })
          }
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={newStatus.visaType}
          onChange={(e) =>
            setNewStatus({ ...newStatus, visaType: e.target.value })
          }
        >
          <option value="">Select Visa Type</option>
          {visaTypes.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={newStatus.nationality}
          onChange={(e) =>
            setNewStatus({ ...newStatus, nationality: e.target.value })
          }
        >
          <option value="">Select Nationality</option>
          {nationalities.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <input
          type="date"
          value={newStatus.validUntil}
          onChange={(e) =>
            setNewStatus({ ...newStatus, validUntil: e.target.value })
          }
          className="border p-2 rounded col-span-1 sm:col-span-2 md:col-span-1"
        />

        <input
          type="file"
          onChange={(e) =>
            setNewStatus({ ...newStatus, proof: e.target.files[0] })
          }
          className="border p-2 rounded col-span-1 sm:col-span-2 md:col-span-1"
        />
      </div>

      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingStatus ? '💾 Update' : '➕ Add'}
        </button>
        {editingStatus && (
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 📋 Residency Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3">Employee</th>
            <th className="border p-3">Visa Type</th>
            <th className="border p-3">Nationality</th>
            <th className="border p-3">Valid Until</th>
            <th className="border p-3 text-center">Proof</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStatuses.map((s) => (
            <tr key={s.id} className="hover:bg-blue-50">
              <td className="border p-3">{s.employeeName}</td>
              <td className="border p-3">{s.visaType}</td>
              <td className="border p-3">{s.nationality}</td>
              <td className="border p-3">{s.validUntil}</td>
              <td className="border p-3 text-center">
                {s.proof !== 'N/A' ? (
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => setPreviewFile(s.proof)}
                    >
                      Preview
                    </button>
                    <a
                      href="#"
                      download={s.proof}
                      className="text-green-600 underline"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-400">No file</span>
                )}
              </td>
              <td className="border p-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 👁️ File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">📄 Document Preview</h3>
            <iframe
              src={URL.createObjectURL(new Blob())}
              title="Preview"
              className="w-full h-96 border"
            ></iframe>
            <div className="text-right mt-3">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setPreviewFile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidencyStatus;
