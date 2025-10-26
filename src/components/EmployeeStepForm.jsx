// components/EmployeeStepForm.jsx
import { useEffect } from 'react';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PersonalInfoStep from './PersonalInfoStep';
import EducationStep from './EducationStep';
import EmploymentStep from './EmploymentStep';

// Constants (could be moved to a separate file)
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
  currentStep,
  setCurrentStep,
}) => {
  useEffect(() => {
    console.log('EmployeeStepForm: formData prop updated', formData);
  }, [formData]);

  const steps = [
    { 
      title: 'Personal & Visa', 
      component: PersonalInfoStep 
    },
    { 
      title: 'Education', 
      component: EducationStep 
    },
    { 
      title: 'Employment', 
      component: EmploymentStep 
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

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
    const props = {
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
        return <PersonalInfoStep {...props} ukCities={UK_CITIES} />;
      case 1:
        return <EducationStep {...props} />;
      case 2:
        return <EmploymentStep {...props} departments={DEPARTMENTS} jobTitles={JOB_TITLES} />;
      default:
        return null;
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

        <form onSubmit={onSubmit} className="p-6">
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
                onClick={() => {
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

export default EmployeeStepForm;