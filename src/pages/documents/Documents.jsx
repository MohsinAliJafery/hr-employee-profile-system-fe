import React, { useState, useMemo, useEffect } from 'react';

const DocumentsList = () => {
  // 🧠 Dummy Employees
  const employees = useMemo(
    () => [
      { id: 1, name: 'Ali Khan' },
      { id: 2, name: 'Sara Ahmed' },
      { id: 3, name: 'Bilal Hussain' },
      { id: 4, name: 'Zara Shah' },
    ],
    []
  );

  // 🧾 Dummy Document Data
  const [documents, setDocuments] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Ali Khan',
      type: 'Passport',
      file: 'passport_ali.pdf',
      fileUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Sara Ahmed',
      type: 'CNIC',
      file: 'cnic_sara.pdf',
      fileUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Bilal Hussain',
      type: 'Degree',
      file: 'degree_bilal.pdf',
      fileUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // 🔄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔍 Filtered + Paginated Documents
  const filteredDocs = selectedEmployee
    ? documents.filter((doc) => doc.employeeId === parseInt(selectedEmployee))
    : documents;

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const displayedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // reset when filter changes
  }, [selectedEmployee]);

  // 📤 Upload Document
  const handleUpload = () => {
    if (!selectedEmployee || !docType || !file) {
      alert('⚠️ Please select employee, document type, and file.');
      return;
    }
    const employee = employees.find((e) => e.id === parseInt(selectedEmployee));

    const newDoc = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      type: docType,
      file: file.name,
      fileUrl: URL.createObjectURL(file),
    };

    setDocuments([...documents, newDoc]);
    setDocType('');
    setFile(null);
  };

  // ✏️ Edit Document
  const handleSaveEdit = () => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === editingDoc.id
          ? {
              ...d,
              type: editingDoc.type,
              file: editingDoc.file.name || editingDoc.file,
              fileUrl:
                editingDoc.fileUrl || URL.createObjectURL(editingDoc.file),
            }
          : d
      )
    );
    setEditingDoc(null);
  };

  // ❌ Delete Document
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  // ⬇️ Download File
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        📂 Employee Documents
      </h2>

      {/* 🔍 Search Section */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="border p-2 rounded flex-1 min-w-[200px]"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded flex-1 min-w-[200px]"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="">Select Document Type</option>
          <option value="Passport">Passport</option>
          <option value="CNIC">CNIC</option>
          <option value="Visa">Visa</option>
          <option value="Degree">Degree</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📤 Upload
        </button>
      </div>

      {/* 📋 Documents Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-blue-900">
            <th className="border p-3 text-left">Employee</th>
            <th className="border p-3 text-left">Type</th>
            <th className="border p-3 text-left">File</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedDocs.length > 0 ? (
            displayedDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-blue-50">
                <td className="border p-3">{doc.employeeName}</td>
                <td className="border p-3">
                  {editingDoc?.id === doc.id ? (
                    <select
                      className="border p-1 rounded w-full"
                      value={editingDoc.type}
                      onChange={(e) =>
                        setEditingDoc({ ...editingDoc, type: e.target.value })
                      }
                    >
                      <option>Passport</option>
                      <option>CNIC</option>
                      <option>Visa</option>
                      <option>Degree</option>
                      <option>Contract</option>
                    </select>
                  ) : (
                    doc.type
                  )}
                </td>
                <td className="border p-3 text-blue-700 underline cursor-pointer">
                  {editingDoc?.id === doc.id ? (
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditingDoc({
                          ...editingDoc,
                          file: e.target.files[0],
                        })
                      }
                    />
                  ) : (
                    doc.file
                  )}
                </td>
                <td className="border p-3 text-center space-x-2">
                  {editingDoc?.id === doc.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDoc(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(doc.fileUrl, doc.file)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-3 text-center text-gray-500">
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* 👁️ Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
            <h3 className="text-lg font-semibold mb-2">
              Preview: {previewDoc.file}
            </h3>
            <iframe
              src={previewDoc.fileUrl}
              title="Document Preview"
              className="w-full h-[85%] border"
            />
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
