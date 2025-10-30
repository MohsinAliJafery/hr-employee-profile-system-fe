// components/steps/EducationStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, Upload, FileText } from 'lucide-react';

const EducationStep = ({ employeeId, onSuccess, onClose }) => {
  const [educations, setEducations] = useState([{
    degree: '',
    institute: '',
    passingYear: '',
    file: null
  }]);
  const [loading, setLoading] = useState(false);
  const [existingEducations, setExistingEducations] = useState([]);

  useEffect(() => {
    if (employeeId) {
      loadEducations();
    }
  }, [employeeId]);

  const loadEducations = async () => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success && response.data.educations) {
        setExistingEducations(response.data.educations);
      }
    } catch (error) {
      console.error('Error loading educations:', error);
    }
  };

  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value
    };
    setEducations(newEducations);
  };

  const handleFileUpload = (index, file) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      file: file
    };
    setEducations(newEducations);
  };

  const addEducationField = () => {
    setEducations(prev => [
      ...prev,
      { degree: '', institute: '', passingYear: '', file: null }
    ]);
  };

  const removeEducationField = (index) => {
    setEducations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasValidEducations = educations.every(edu => 
      edu.degree && edu.institute && edu.passingYear
    );

    if (!hasValidEducations) {
      toast.error('Please fill all required education fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      const eduJson = educations.map(edu => ({
        degree: edu.degree,
        institute: edu.institute,
        passingYear: edu.passingYear,
      }));
      submitData.append('educations', JSON.stringify(eduJson));

      educations.forEach((edu, idx) => {
        if (edu.file) {
          submitData.append(`educationFiles[${idx}]`, edu.file);
        }
      });

      const response = await employeeAPI.updateEmployee(employeeId, submitData);
      
      if (response.success) {
        toast.success('Education information updated successfully');
        onSuccess(employeeId);
      } else {
        toast.error(response.message || 'Failed to update education information');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error('Error updating education information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Education Information</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {existingEducations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Education</h4>
                {existingEducations.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                        <p className="text-sm text-gray-600">{edu.institute} ({edu.passingYear})</p>
                      </div>
                      {edu.documentPath && (
                        <a 
                          href={`http://localhost:5000/uploads/${edu.documentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FileText size={14} />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {existingEducations.length > 0 ? 'Add More Education' : 'Add Education'}
              </h4>
              
              {educations.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-medium text-gray-900">Education #{index + 1}</h5>
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducationField(index)}
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
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
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
                        value={edu.institute}
                        onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., University of Oxford"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year *</label>
                      <select
                        value={edu.passingYear}
                        onChange={(e) => handleEducationChange(index, 'passingYear', e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate (Optional)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                          <Upload size={16} />
                          {edu.file ? 'Change File' : 'Choose File'}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(index, file);
                              }
                            }}
                          />
                        </label>
                        {edu.file && (
                          <span className="text-sm text-blue-600">
                            {edu.file.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEducationField}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
              >
                <Plus size={16} />
                Add Another Education
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Education'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationStep;