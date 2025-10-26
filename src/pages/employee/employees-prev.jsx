import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const EmployeeList2 = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const recordsPerPage = 5;

  useEffect(() => {
    setEmployees([
      {
        id: 1,
        name: 'Ali Raza',
        department: 'IT',
        jobTitle: 'Frontend Developer',
        visaExpiry: '2025-12-30',
        nationality: 'Pakistani',
        visaType: 'Work Visa',
        validUntil: '2025-12-30',
        address: 'Lahore, Pakistan',
        educations: [
          { degree: 'BS Computer Science', document: 'bs_degree.pdf' },
          { degree: 'ReactJS Certification', document: 'react_cert.pdf' },
        ],
      },
      {
        id: 2,
        name: 'John Smith',
        department: 'HR',
        jobTitle: 'HR Manager',
        visaExpiry: '2024-12-01',
        nationality: 'British',
        visaType: 'Residence Permit',
        validUntil: '2024-12-01',
        address: 'London, UK',
        educations: [{ degree: 'MBA Human Resource', document: 'mba_hr.pdf' }],
      },
      {
        id: 3,
        name: 'Ahmed Khan',
        department: 'Finance',
        jobTitle: 'Accountant',
        visaExpiry: '2024-10-25',
        nationality: 'Pakistani',
        visaType: 'Employment Visa',
        validUntil: '2024-10-25',
        address: 'Karachi, Pakistan',
        educations: [
          { degree: 'M.Com', document: 'mcom.pdf' },
          { degree: 'Taxation Diploma', document: 'tax_diploma.pdf' },
        ],
      },
    ]);
  }, []);

  const getVisaStatusColor = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const diffDays = expiry.diff(today, 'day');

    if (diffDays > 90) return 'text-green-600 font-semibold';
    if (diffDays > 14) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // 🔍 Filtering
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === 'All' || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, departmentFilter]);

  // 🔽 Sorting
  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'visaExpiry') {
        valA = dayjs(a.visaExpiry);
        valB = dayjs(b.visaExpiry);
      }

      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      else return valA < valB ? 1 : -1;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  // 📄 Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sortedEmployees.length / recordsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const departments = ['All', ...new Set(employees.map((e) => e.department))];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-bold text-blue-800">Employee List</h2>
        <Link
          to="/dashboard/employee/add"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border rounded px-3 py-2 w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full md:w-1/4"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 border-b">#</th>
              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b">Job Title</th>
              <th className="p-3 border-b">Nationality</th>
              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => handleSort('visaExpiry')}
              >
                Visa Expiry{' '}
                {sortField === 'visaExpiry' &&
                  (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {indexOfFirstRecord + index + 1}
                  </td>
                  <td className="p-3 border-b">{emp.name}</td>
                  <td className="p-3 border-b">{emp.department}</td>
                  <td className="p-3 border-b">{emp.jobTitle}</td>
                  <td className="p-3 border-b">{emp.nationality}</td>
                  <td
                    className={`p-3 border-b ${getVisaStatusColor(
                      emp.visaExpiry
                    )}`}
                  >
                    {dayjs(emp.visaExpiry).format('DD MMM YYYY')}
                  </td>
                  <td className="p-3 border-b text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      View
                    </button>
                    <button className="text-green-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing {indexOfFirstRecord + 1}–
          {Math.min(indexOfLastRecord, sortedEmployees.length)} of{' '}
          {sortedEmployees.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* 🧩 Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-blue-800 mb-3">
              {selectedEmployee.name} — {selectedEmployee.jobTitle}
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Department:</strong> {selectedEmployee.department}
                </p>
                <p>
                  <strong>Address:</strong> {selectedEmployee.address}
                </p>
                <p>
                  <strong>Nationality:</strong> {selectedEmployee.nationality}
                </p>
                <p>
                  <strong>Visa Type:</strong> {selectedEmployee.visaType}
                </p>
                <p>
                  <strong>Visa Expiry:</strong>{' '}
                  <span
                    className={getVisaStatusColor(selectedEmployee.visaExpiry)}
                  >
                    {dayjs(selectedEmployee.visaExpiry).format('DD MMM YYYY')}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  <strong>Educations:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  {selectedEmployee.educations.map((edu, idx) => (
                    <li key={idx}>
                      {edu.degree} –{' '}
                      <a
                        href={`#${edu.document}`}
                        className="text-blue-600 underline"
                      >
                        {edu.document}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList2;
