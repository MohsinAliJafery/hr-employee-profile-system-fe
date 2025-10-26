'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { employeeAPI } from '../../services/employee';
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Step 1 Component - Personal Information
const PersonalInfoStep = ({
  formData,
  onInputChange,
  visaFile,
  setVisaFile,
  ukCities
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600 mb-6">Basic details about the employee</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            name="country"
            value={formData.country || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Country</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <select
            name="city"
            value={formData.city || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select City</option>
            {ukCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., British"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={onInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Visa Information</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type *</label>
            <select
              name="visaType"
              value={formData.visaType || ''}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Visa Type</option>
              <option value="Tier 2 (General)">Tier 2 (General)</option>
              <option value="Tier 2 (Intra-company Transfer)">Tier 2 (Intra-company Transfer)</option>
              <option value="Skilled Worker Visa">Skilled Worker Visa</option>
              <option value="Global Talent Visa">Global Talent Visa</option>
              <option value="Start-up Visa">Start-up Visa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visa Expiry Date *</label>
            <input
              type="date"
              name="visaExpiry"
              value={formData.visaExpiry || ''}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">Visa Document Upload</label>
  <div className="flex items-center gap-3">
    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
      <Upload size={16} />
      {formData.visaDocumentPath ? 'Change Visa Document' : 'Choose Visa Document'}
      <input
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setVisaFile(file);
            onInputChange({ 
              target: { 
                name: 'visaDocument', 
                value: file.name 
              } 
            });
          }
        }}
      />
    </label>
    
    {/* Show current visa document from database with download link */}
    {!visaFile && formData.visaDocumentPath && (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <FileText size={16} />
          <span>Current file: </span>
        </div>
        <a 
          href={`http://localhost:5000/uploads/${formData.visaDocumentPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Download
        </a>
      </div>
    )}
    
    {/* Show newly selected file */}
    {visaFile && (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <FileText size={16} />
        <span>New file: {visaFile.name}</span>
      </div>
    )}
  </div>
  <p className="text-xs text-gray-500 mt-1">
    {formData.visaDocumentPath ? 'Current file will be kept if no new file is selected' : 'Upload visa copy (PDF, DOC, JPG, PNG - Max 5MB)'}
  </p>
</div>

        </div>
      </div>
    </div>
  );
};

// Step 2 Component - Education & Qualifications
const EducationStep = ({
  formData,
  onEducationChange,
  onFileUpload,
  onAddEducation,
  onRemoveEducation
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Education & Qualifications</h3>
        <p className="text-gray-600 mb-6">Add educational background and upload certificates</p>
      </div>

      {formData.educations.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Education #{index + 1}</h4>
            {formData.educations.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree/Qualification *
              </label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bachelor of Science in Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institute/University *
              </label>
              <input
                type="text"
                value={edu.institute || ''}
                onChange={(e) => onEducationChange(index, 'institute', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., University of Oxford"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year *</label>
              <select
                value={edu.passingYear || ''}
                onChange={(e) => onEducationChange(index, 'passingYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Year</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

           <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate</label>
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
        <Upload size={16} />
        {edu.documentPath ? 'Change File' : 'Choose File'}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileUpload(index, file);
            }
          }}
        />
      </label>
      
      {/* Show current certificate from database with download link */}
      {!edu.file && edu.documentPath && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FileText size={16} />
            <span>Current: </span>
          </div>
          <a 
            href={`http://localhost:5000/uploads/${edu.documentPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
          >
            <FileText size={14} />
            Download
          </a>
        </div>
      )}
      
      {/* Show newly selected file */}
      {edu.file && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <FileText size={16} />
          <span>New: {edu.file.name}</span>
        </div>
      )}
    </div>
    <p className="text-xs text-gray-500">
      {edu.documentPath ? 'Current file will be kept if no new file is selected' : 'Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)'}
    </p>
  </div>
</div>

          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddEducation}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus size={16} />
        Add Another Education
      </button>
    </div>
  );
};

// Step 3 Component - Employment Details
const EmploymentStep = ({
  formData,
  onInputChange,
  departments,
  jobTitles
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Employment Details</h3>
        <p className="text-gray-600 mb-6">Company position and compensation information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
          <select
            name="department"
            value={formData.department || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
          <select
            name="jobTitle"
            value={formData.jobTitle || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!formData.department}
          >
            <option value="">Select Job Title</option>
            {formData.department &&
              jobTitles[formData.department]?.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary (£) *</label>
          <input
            type="number"
            name="salary"
            value={formData.salary || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 45000"
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={onInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Active Employee</label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Step Form Component
const EmployeeStepForm = ({
  isEdit = false,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  onEducationChange,
  onFileUpload,
  onAddEducation,
  onRemoveEducation,
  visaFile,
  setVisaFile,
  formLoading,
}) => {

  const [currentStep, setCurrentStep] = useState(0);

  const UK_CITIES = [
    'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 
    'Bristol', 'Leeds', 'Sheffield', 'Edinburgh', 'Cardiff', 
    'Belfast', 'Newcastle', 'Nottingham', 'Southampton', 'Brighton'
  ];

  const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Engineering'];

  const JOB_TITLES = {
    IT: ['Software Developer', 'System Administrator', 'IT Support', 'DevOps Engineer', 'Database Administrator'],
    HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'Training Specialist', 'Compensation Analyst'],
    Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Auditor', 'Bookkeeper'],
    Marketing: ['Marketing Manager', 'Digital Marketer', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
    Operations: ['Operations Manager', 'Logistics Coordinator', 'Supply Chain Specialist', 'Operations Analyst'],
    Sales: ['Sales Manager', 'Account Executive', 'Sales Representative', 'Business Development Manager'],
    Engineering: ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Project Engineer'],
  };

  const steps = [
    { title: 'Personal & Visa', component: PersonalInfoStep },
    { title: 'Education', component: EducationStep },
    { title: 'Employment', component: EmploymentStep },
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.country &&
          formData.city &&
          formData.nationality &&
          formData.address &&
          formData.visaType &&
          formData.visaExpiry
        );
      case 1:
        return formData.educations.every(
          (edu) => edu.degree && edu.institute && edu.passingYear
        );
      case 2:
        return formData.department && formData.jobTitle && formData.startDate && formData.salary;
      default:
        return false;
    }
  };

  const renderStepComponent = () => {
    const commonProps = {
      formData,
      onInputChange,
      onEducationChange,
      onFileUpload,
      onAddEducation,
      onRemoveEducation,
      visaFile,
      setVisaFile,
    };

    switch (currentStep) {
      case 0:
        return <PersonalInfoStep {...commonProps} ukCities={UK_CITIES} />;
      case 1:
        return <EducationStep {...commonProps} />;
      case 2:
        return <EmploymentStep {...commonProps} departments={DEPARTMENTS} jobTitles={JOB_TITLES} />;
      default:
        return null;
    }
  };

 const handleFinalSubmit = (e) => {
  e.preventDefault();
  console.log('Form submitted - Current Step:', currentStep, 'Is Valid:', isStepValid());
  
  if (currentStep === steps.length - 1 && isStepValid()) {
    console.log('Calling onSubmit...');
    onSubmit(e);
  } else {
    console.log('Submission blocked - not on final step or not valid');
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button
              onClick={onClose}
              type='button'
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      idx <= currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${
                        idx < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleFinalSubmit} 
               className="p-6">
          {renderStepComponent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                  onClick={(e) => {
                  e.preventDefault();
                  if (isStepValid()) {
                    setCurrentStep((prev) => prev + 1);
                  }
                }}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || formLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEdit ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {isEdit ? 'Update Employee' : 'Add Employee'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [visaFile, setVisaFile] = useState(null);

  const recordsPerPage = 5;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'United Kingdom',
    city: '',
    nationality: '',
    address: '',
    visaType: '',
    visaExpiry: '',
    visaDocument: '',
    department: '',
    jobTitle: '',
    startDate: '',
    salary: '',
    isActive: true,
    educations: [{ degree: '', institute: '', passingYear: '', file: null }],
  });

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getEmployees();
      if (response.success){
        setEmployees(response.data);
        console.log("Employee Record in Fetch Employees", response.data);
      } 
      else toast.error('Failed to fetch employees');
    } catch (err) {
      console.error(err);
      toast.error('Error loading employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Form Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  }, []);

  const handleEducationChange = useCallback((idx, field, value) => {
    setFormData(prev => {
      const newEducations = [...prev.educations];
      newEducations[idx] = {
        ...newEducations[idx],
        [field]: value
      };
      return {
        ...prev,
        educations: newEducations
      };
    });
  }, []);

  const handleFileUpload = useCallback((idx, file) => {
  console.log(`Uploading file for education ${idx}:`, file.name);
  setFormData(prev => {
    const newEducations = [...prev.educations];
    // Ensure the education entry exists
    if (!newEducations[idx]) {
      newEducations[idx] = { degree: '', institute: '', passingYear: '', file: null };
    }
    newEducations[idx] = {
      ...newEducations[idx],
      file: file
    };
    
    console.log('Updated educations array:', newEducations);
    return {
      ...prev,
      educations: newEducations
    };
  });
}, []);

  const addEducationField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        { degree: '', institute: '', passingYear: '', file: null }
      ]
    }));
  }, []);

  const removeEducationField = useCallback((idx) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== idx)
    }));
  }, []);

  // Add/Edit Handlers
  const handleAddEmployee = async (e) => {
  e.preventDefault();
  setFormLoading(true);
  try {
     // ✅ Validate that educations have required fields
    const hasValidEducations = formData.educations.every(edu => 
      edu.degree && edu.institute && edu.passingYear
    );
    
    if (!hasValidEducations) {
      toast.error('Please fill all required education fields');
      return;
    }

    // ✅ Log education files for debugging
    console.log('Education files to upload:');
    formData.educations.forEach((edu, idx) => {
      console.log(`Education ${idx}:`, {
        degree: edu.degree,
        hasFile: !!edu.file,
        fileName: edu.file?.name
      });
    });

    const submitData = new FormData();

    // Add basic fields
    Object.keys(formData).forEach(key => {
      if (key !== 'educations') {
        submitData.append(key, formData[key]);
      }
    });

    // Add educations as JSON
    const eduJson = formData.educations.map(edu => ({
      degree: edu.degree,
      institute: edu.institute,
      passingYear: edu.passingYear,
    }));
    submitData.append('educations', JSON.stringify(eduJson));

    // ✅ FIX: Use indexed fieldnames for education files
    formData.educations.forEach((edu, idx) => {
      if (edu.file) {
        submitData.append(`educationFiles[${idx}]`, edu.file); // Indexed fieldnames
      }
    });

    // Add visa file
    if (visaFile) {
      submitData.append('visaFile', visaFile);
    }

    // Debug: Log what's being sent
    console.log('=== SUBMITTING FORM DATA ===');
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const res = await employeeAPI.createEmployee(submitData);
    if (res.success) {
      toast.success('Employee added successfully');
      setShowAddForm(false);
      resetForm();
      fetchEmployees();
    } else {
      toast.error(res.message || 'Failed to add employee');
    }
  } catch (err) {
    console.error('Error adding employee:', err);
    toast.error('Error adding employee');
  } finally {
    setFormLoading(false);
  }
};

const handleEditEmployee = async (e) => {
  e.preventDefault();
  
  setFormLoading(true);
  try {
    const submitData = new FormData();

    // Add basic fields - preserve existing document paths
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && key !== 'educations') {
        submitData.append(key, formData[key]);
      }
    });

    // ✅ FIX: Preserve existing document paths when no new file is uploaded
    const eduJson = formData.educations.map(edu => ({
      degree: edu.degree,
      institute: edu.institute,
      passingYear: edu.passingYear,
      documentPath: edu.documentPath || '', // Preserve existing document path
    }));
    submitData.append('educations', JSON.stringify(eduJson));

    // ✅ FIX: Use indexed fieldnames for education files
    formData.educations.forEach((edu, idx) => {
      if (edu.file) {
        submitData.append(`educationFiles[${idx}]`, edu.file);
      }
    });

    // ✅ FIX: Handle visa document path properly
    if (visaFile) {
      submitData.append('visaFile', visaFile);
    } else if (formData.visaDocumentPath) {
      // Preserve existing visa document path if no new file uploaded
      submitData.append('visaDocumentPath', formData.visaDocumentPath);
    }

    // Debug: Log what's being sent
    console.log('=== EDITING EMPLOYEE DATA ===');
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const res = await employeeAPI.updateEmployee(editingEmployee._id, submitData);
    if (res.success) {
      toast.success('Employee updated successfully');
      setShowEditForm(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } else {
      toast.error(res.message || 'Failed to update employee');
    }
  } catch (err) {
    console.error('Error updating employee:', err);
    toast.error('Error updating employee');
  } finally {
    setFormLoading(false);
  }
};

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      setIsDeleteLoading(id);
      const res = await employeeAPI.deleteEmployee(id);
      if (res.success) {
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } else {
        toast.error(res.message || 'Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Error deleting employee');
    } finally {
      setIsDeleteLoading(null);
    }
  };

  // Form Helpers
  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      country: 'United Kingdom',
      city: '',
      nationality: '',
      address: '',
      visaType: '',
      visaExpiry: '',
      visaDocument: '',
      department: '',
      jobTitle: '',
      startDate: '',
      salary: '',
      isActive: true,
      educations: [{ degree: '', institute: '', passingYear: '', file: null }],
    });
    setVisaFile(null);
  }, []);

  const openEditForm = useCallback((emp) => {
  setEditingEmployee(emp);
  const newFormData = {
    firstName: emp.firstName || '',
    lastName: emp.lastName || '',
    country: emp.country || 'United Kingdom',
    city: emp.city || '',
    nationality: emp.nationality || '',
    address: emp.address || '',
    visaType: emp.visaType || '',
    visaExpiry: emp.visaExpiry ? dayjs(emp.visaExpiry).format('YYYY-MM-DD') : '',
    visaDocumentPath: emp.visaDocumentPath || '', // Use visaDocumentPath from model
    department: emp.department || '',
    jobTitle: emp.jobTitle || '',
    startDate: emp.startDate ? dayjs(emp.startDate).format('YYYY-MM-DD') : '',
    salary: emp.salary || '',
    isActive: emp.isActive ?? true,
    educations: emp.educations?.length > 0
      ? emp.educations.map(e => ({
          degree: e.degree || '',
          institute: e.institute || '',
          passingYear: e.passingYear || '',
          file: null, // For new uploads
          documentPath: e.documentPath || '', // Use documentPath from model
        }))
      : [{ degree: '', institute: '', passingYear: '', file: null, documentPath: '' }],
  };
  setFormData(newFormData);
  setVisaFile(null);
  setShowEditForm(true);
}, []);

  // Visa Status Helpers
  const getVisaStatusColor = (expiry) => {
    const diff = dayjs(expiry).diff(dayjs(), 'day');
    if (diff > 90) return 'text-green-600 bg-green-50 px-2 py-1 rounded';
    if (diff > 14) return 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded';
    return 'text-red-600 bg-red-50 px-2 py-1 rounded';
  };

  const getVisaStatusText = (expiry) => {
    const diff = dayjs(expiry).diff(dayjs(), 'day');
    if (diff > 90) return 'Valid';
    if (diff > 14) return 'Expiring Soon';
    return 'Expired';
  };

  // Filter / Sort / Pagination
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchSearch = name.includes(searchTerm.toLowerCase());
      const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
      return matchSearch && matchDept;
    });
  }, [employees, searchTerm, departmentFilter]);

  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees;
    return [...filteredEmployees].sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (sortField === 'visaExpiry' || sortField === 'startDate') {
        va = dayjs(va);
        vb = dayjs(vb);
      }
      return sortOrder === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = sortedEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedEmployees.length / recordsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const availableDepartments = ['All', ...new Set(employees.map((e) => e.department))];

  // Render
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">Manage your team members and their details</p>
        </div>
        <button
        type='button'
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mt-4 lg:mt-0"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Employees</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Department
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nationality
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('visaExpiry')}
                >
                  <div className="flex items-center gap-1">
                    Visa Status
                    {sortField === 'visaExpiry' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.length > 0 ? (
                currentRecords.map((emp, i) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {indexOfFirst + i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emp.city}, {emp.country}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emp.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={getVisaStatusColor(emp.visaExpiry)}>
                          {getVisaStatusText(emp.visaExpiry)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {dayjs(emp.visaExpiry).format('DD MMM YYYY')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                        type='button'
                          onClick={() => openEditForm(emp)}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                        type='button'
                          onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                          disabled={isDeleteLoading === emp._id}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleteLoading === emp._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLast, sortedEmployees.length)}
                </span>{' '}
                of <span className="font-medium">{sortedEmployees.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  type='button'
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                type='button'
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <EmployeeStepForm
          isEdit={false}
          onClose={() => {
            setShowAddForm(false);
            resetForm();
          }}
          onSubmit={handleAddEmployee}
          formData={formData}
          onInputChange={handleInputChange}
          onEducationChange={handleEducationChange}
          onFileUpload={handleFileUpload}
          onAddEducation={addEducationField}
          onRemoveEducation={removeEducationField}
          visaFile={visaFile}
          setVisaFile={setVisaFile}
          formLoading={formLoading}
        />
      )}

      {/* EDIT FORM */}
      {showEditForm && (
        <EmployeeStepForm
          isEdit={true}
          onClose={() => {
            setShowEditForm(false);
            setEditingEmployee(null);
            resetForm();
          }}
          onSubmit={handleEditEmployee}
          formData={formData}
          onInputChange={handleInputChange}
          onEducationChange={handleEducationChange}
          onFileUpload={handleFileUpload}
          onAddEducation={addEducationField}
          onRemoveEducation={removeEducationField}
          visaFile={visaFile}
          setVisaFile={setVisaFile}
          formLoading={formLoading}

        />
      )}

      {/* DETAIL MODAL */}
      {selectedEmployee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <button
            onClick={() => setSelectedEmployee(null)}
            type='button'
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* ... other details ... */}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visa Information
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Visa Type</dt>
                  <dd className="text-sm text-gray-900">{selectedEmployee.visaType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Visa Expiry</dt>
                  <dd className={`text-sm ${getVisaStatusColor(selectedEmployee.visaExpiry)}`}>
                    {dayjs(selectedEmployee.visaExpiry).format('DD MMM YYYY')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Visa Document</dt>
                  <dd className="text-sm text-gray-900">
                    {selectedEmployee.visaDocumentPath ? (
                      <a 
                        href={`http://localhost:5000/uploads/${selectedEmployee.visaDocumentPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        <FileText size={16} />
                        Download Visa Document
                      </a>
                    ) : (
                      <span className="text-gray-500">No document uploaded</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="text-sm text-gray-900">{selectedEmployee.address}</dd>
                </div>
              </dl>
            </div>

            {selectedEmployee.educations?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                <ul className="space-y-3">
                  {selectedEmployee.educations.map((edu, idx) => (
                    <li key={idx} className="text-sm text-gray-700 border-l-4 border-blue-200 pl-3 py-1">
                      <div className="font-medium">{edu.degree}</div>
                      <div>{edu.institute} ({edu.passingYear})</div>
                      {edu.documentPath && (
                        <a 
                          href={`http://localhost:5000/uploads/${edu.documentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-1"
                        >
                          <FileText size={12} />
                          Download Certificate
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex justify-end gap-3">
          <button
            type='button'
            onClick={() => setSelectedEmployee(null)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployeeList;