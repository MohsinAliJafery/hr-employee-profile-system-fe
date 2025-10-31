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
import {
  getTitles,
  getCountries,
  getCities,
  getVisaTypes,
  getNationalities,
  getDepartments,
  getDesignations,
  getQualifications,
  getEmployeeStatuses,
} from '@/utils/EmployeeUtils';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [currentStep, setCurrentStep] = useState(1);
  const [employeeId, setEmployeeId] = useState(null);
  const [fullEmployeeData, setFullEmployeeData] = useState(null);

  // Dropdown data
  const [titles, setTitles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [employeeStatuses, setEmployeeStatuses] = useState([]);

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadFormData = async () => {
    try {
      const [
        titlesData,
        countriesData,
        citiesData,
        visaTypesData,
        nationalitiesData,
        departmentsData,
        designationsData,
        qualificationsData,
        employeeStatusesData,
      ] = await Promise.all([
        getTitles(),
        getCountries(),
        getCities(),
        getVisaTypes(),
        getNationalities(),
        getDepartments(),
        getDesignations(),
        getQualifications(),
        getEmployeeStatuses(),
      ]);

      setTitles(titlesData);
      setCountries(countriesData);
      setCities(citiesData);
      setVisaTypes(visaTypesData);
      setNationalities(nationalitiesData);
      setDepartments(departmentsData);
      setDesignations(designationsData);
      setQualifications(qualificationsData);
      setEmployeeStatuses(employeeStatusesData);
    } catch (error) {
      console.error('Error loading form data:', error);
      toast.error('Failed to load dropdown data');
    }
  };

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

  // Load full employee data for editing
  const loadEmployeeData = async (employeeId) => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success) {
        setFullEmployeeData(response.data);
        return response.data;
      } else {
        toast.error('Failed to load employee data');
        return null;
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
      toast.error('Error loading employee data');
      return null;
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFullEmployeeData(null);
    setIsModalOpen(true);
    setCurrentStep(1);
    setEmployeeId(null);
  };

  const handleEditEmployee = async (employee) => {
    try {
      setSelectedEmployee(employee);
      setEmployeeId(employee._id);
      setIsModalOpen(true);
      setCurrentStep(1);
      
      // Load full employee data for editing
      const fullData = await loadEmployeeData(employee._id);
      if (fullData) {
        setFullEmployeeData(fullData);
      }
    } catch (error) {
      console.error('Error setting up edit mode:', error);
      toast.error('Error loading employee data');
    }
  };

  const handleViewEmployee = async (employee) => {
    try {
      setSelectedEmployee(employee);
      setIsModalOpen(true);
      setCurrentStep(1);
      
      // Load full employee data for viewing
      const fullData = await loadEmployeeData(employee._id);
      if (fullData) {
        setFullEmployeeData(fullData);
      }
    } catch (error) {
      console.error('Error setting up view mode:', error);
      toast.error('Error loading employee data');
    }
  };

  const handleDeleteEmployee = async (employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) return;

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
    console.log('Employee created with ID:', id);
    setEmployeeId(id);
    setCurrentStep((prev) => prev + 1);
  };

  const handleModalSuccess = () => {
    toast.success('Employee setup completed successfully!');
    setIsModalOpen(false);
    setEmployeeId(null);
    setFullEmployeeData(null);
    setSelectedEmployee(null);
    loadEmployees();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFullEmployeeData(null);
    setEmployeeId(null);
    setCurrentStep(1);
  };

  // Get profile picture URL with better error handling
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return '/default-avatar.png';
    return `${BASE_URL}/uploads/profile-pictures/${profilePicture}`;
  };

  // Image error handler with state management per employee
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (employeeId) => {
    setImageErrors(prev => ({
      ...prev,
      [employeeId]: true
    }));
  };

  const getImageSrc = (employee) => {
    if (imageErrors[employee._id] || !employee.profilePicture) {
      return '/default-avatar.png';
    }
    return getProfilePictureUrl(employee.profilePicture);
  };

  // Filters
  const filteredEmployees = employees.filter((employee) => {
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
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
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  // 🧭 Step Titles
  const steps = [
    { id: 1, label: 'Personal Info' },
    { id: 2, label: 'Education' },
    { id: 3, label: 'Employment' },
    { id: 4, label: 'Documents' },
    { id: 5, label: 'Next of Kin' },
  ];

  // 🧠 Step Progress UI Component
  const StepHeader = () => (
    <div className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${currentStep === step.id ? 'ring-4 ring-purple-100' : ''}`}
              >
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm font-medium mt-3 ${
                  currentStep >= step.id ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-purple-600 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-2">Manage your organization's employees efficiently</p>
          </div>
          <button
            onClick={handleAddEmployee}
            className="mt-4 sm:mt-0 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add New Employee
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="sm:w-48 w-full">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="px-6 pb-8">
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={48} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No employees found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {employees.length === 0
                  ? 'Get started by adding your first employee to the system.'
                  : 'No employees match your search criteria. Try adjusting your filters.'}
              </p>
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Employee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-75">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Visa Expiry</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredEmployees.map((employee) => (
                    <tr 
                      key={employee._id} 
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-25 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              className="h-12 w-12 rounded-xl object-cover mr-4 border-2 border-white shadow-sm group-hover:border-purple-100 transition-all duration-300"
                              src={getImageSrc(employee)}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              onError={() => handleImageError(employee._id)}
                              loading="lazy"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              employee.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.title?.title || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{employee.email}</div>
                        <div className="text-gray-500 text-sm">{employee.contactNo || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">
                          {employee.city?.name || 'N/A'}, {employee.country?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-medium ${
                          employee.visaExpiry && new Date(employee.visaExpiry) < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-900'
                        }`}>
                          {formatDate(employee.visaExpiry)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(employee.isActive)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleViewEmployee(employee)} 
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                            title="View Employee"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditEmployee(employee)} 
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                            title="Edit Employee"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee)} 
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                            title="Delete Employee"
                          >
                            <Trash2 size={18} />
                          </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 overflow-auto">
          <StepHeader />

          {currentStep === 1 && (
            <PersonalInfoStep
              employeeId={employeeId}
              initialData={fullEmployeeData}
              isEditing={!!selectedEmployee}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(2)}
              onClose={handleModalClose}
              titles={titles}
              nationalities={nationalities}
              countries={countries}
              cities={cities}
              visaTypes={visaTypes}
              employeeStatuses={employeeStatuses}
            />
          )}

          {currentStep === 2 && (
            <EducationStep
              employeeId={employeeId}
              initialData={fullEmployeeData?.education}
              isEditing={!!selectedEmployee}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(3)}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(1)}
              qualifications={qualifications}
            />
          )}

          {currentStep === 3 && (
            <EmploymentStep
              employeeId={employeeId}
              initialData={fullEmployeeData?.employment}
              isEditing={!!selectedEmployee}
              setEmployeeId={setEmployeeId}
              setCurrentStep={setCurrentStep}
              onSuccess={() => setCurrentStep(4)}
              onClose={handleModalClose}
              onBack={() => setCurrentStep(2)}
              departments={departments}
              designations={designations}
            />
          )}

          {currentStep === 4 && (
            <DocumentsStep
              employeeId={employeeId}
              initialData={fullEmployeeData?.documents}
              isEditing={!!selectedEmployee}
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
              initialData={fullEmployeeData?.nextOfKin}
              isEditing={!!selectedEmployee}
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