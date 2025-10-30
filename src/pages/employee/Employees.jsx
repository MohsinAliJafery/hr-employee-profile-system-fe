// components/EmployeeMultiStepForm.jsx
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import PersonalInfoStep from '@/components/PersonalInfoStep';
import EducationStep from '@/components/EducationStep';
import EmploymentStep from '@/components/EmployementStep';
import DocumentsStep from '@/components/DocumentsStep';
import NextOfKinStep from '@/components/NextOfKinStep';

const EmployeeList = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [savedData, setSavedData] = useState({});
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  const steps = [
    { 
      name: 'personal', 
      title: 'Personal Information',
      component: PersonalInfoStep 
    },
    { 
      name: 'education', 
      title: 'Education',
      component: EducationStep 
    },
    { 
      name: 'employment', 
      title: 'Employment History',
      component: EmploymentStep 
    },
    { 
      name: 'documents', 
      title: 'Documents',
      component: DocumentsStep
    },
    { 
      name: 'nextOfKin', 
      title: 'Next of Kin',
      component: NextOfKinStep 
    },
  ];

  const handleStepSuccess = (employeeId, stepData) => {
    // Save the data from this step
    setSavedData(prev => ({
      ...prev,
      [steps[currentStep].name]: stepData
    }));
    
    // Set employee ID if this is the first step
    if (!currentEmployeeId && employeeId) {
      setCurrentEmployeeId(employeeId);
    }

    // Move to next step if not the last one
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All steps completed
      onSuccess(employeeId);
      onClose();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderCurrentStep = () => {
    const StepComponent = steps[currentStep].component;
    
    return (
      <StepComponent
        employeeId={currentEmployeeId}
        initialData={savedData[steps[currentStep].name]}
        onSuccess={handleStepSuccess}
        onClose={onClose}
        isLastStep={currentStep === steps.length - 1}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
              <p className="text-gray-600 mt-1">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <button
              onClick={onClose}
              type='button'
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6"> 
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.name} className="flex items-center">
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

        {/* Step Content */}
        <div className="p-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleStepBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;