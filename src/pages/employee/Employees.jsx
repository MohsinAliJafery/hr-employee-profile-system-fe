// pages/employees.jsx
import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import PersonalInfoStep from '@/components/PersonalInfoStep';
import EducationStep from '@/components/EducationStep';
import EmploymentStep from '@/components/EmployementStep';
import DocumentsStep from '@/components/DocumentsStep';
import NextOfKinStep from '@/components/NextOfKinStep';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [currentStep, setCurrentStep] = useState(1);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAllEmployees();
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
    setCurrentStep(1);
    setEmployeeId(null);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeId(employee._id);
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const handleDeleteEmployee = async (employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      return;
    }

    try {
      const response = await employeeAPI.deleteEmployee(employee._id);
      if (response.success) {
        toast.success('Employee deleted successfully');
        loadEmployees();
      } else {
        toast.error(response.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error deleting employee');
    }
  };

  // 🧩 Step Management Handlers
  const handleNextStep = (id) => {
    console.log("Employee created with ID:", id);
    setEmployeeId(id);
    setCurrentStep(2);
  };

  const handleModalSuccess = () => {
    toast.success("Employee setup completed successfully!");
    setIsModalOpen(false);
    setEmployeeId(null);
    loadEmployees();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setEmployeeId(null);
    setCurrentStep(1);
  };

  // Filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.contactNo?.includes(searchTerm);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && employee.isActive) ||
      (filterStatus === 'inactive' && !employee.isActive);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🧭 Step Titles
  const steps = [
    { id: 1, label: "Personal Info" },
    { id: 2, label: "Education" },
    { id: 3, label: "Employment" },
    { id: 4, label: "Documents" },
    { id: 5, label: "NextofKin" },
  ];

  // 🧠 Step Progress UI Component
  const StepHeader = () => (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex-1 flex flex-col items-center relative">
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all ${
                currentStep >= step.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-400 border-gray-300'
              }`}
            >
              {step.id}
            </div>
            <span
              className={`text-sm mt-2 ${
                currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
            {step.id < steps.length && (
              <div
                className={`absolute top-5 left-[60%] w-full h-0.5 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">
              Manage your organization's employees
            </p>
          </div>
          <button
            onClick={handleAddEmployee}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="px-6 pb-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Plus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-600 mb-4">
                {employees.length === 0 
                  ? "Get started by adding your first employee."
                  : "No employees match your search criteria."
                }
              </p>
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Employee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visa Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover mr-3"
                            src={employee.profilePicture}
                            alt=""
                          />
                          <div>
                            <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                            <div className="text-sm text-gray-500">{employee.title?.title || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{employee.email}</div>
                        <div className="text-gray-500">{employee.contactNo}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {employee.city?.name || 'N/A'}, {employee.country?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{formatDate(employee.visaExpiry)}</td>
                      <td className="px-6 py-4">{getStatusBadge(employee.isActive)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleViewEmployee(employee)} className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
                          <button onClick={() => handleEditEmployee(employee)} className="text-green-600 hover:text-green-900"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteEmployee(employee)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 🧭 Multi-step Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-auto">
          <StepHeader />

          {currentStep === 1 && (
            <PersonalInfoStep
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(2)}
              onClose={handleModalClose}
            />
          )}

          {currentStep === 2 && (
            <EducationStep
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(3)}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <EmploymentStep
                employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(4)}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <DocumentsStep
                employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(5)}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(3)}
            />
          )}

           {currentStep === 5 && (
            <NextOfKinStep
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={handleModalSuccess}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(4)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
