// components/steps/EducationStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, GraduationCap, BookOpen, Calendar } from 'lucide-react';

const EducationStep = ({ setEmployeeId, employeeId, onSuccess, onClose, onBack, setCurrentStep }) => {
  const [educations, setEducations] = useState([{
    degree: '',
    institute: '',
    passingYear: ''
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

  const addEducationField = () => {
    setEducations(prev => [
      ...prev,
      { degree: '', institute: '', passingYear: '' }
    ]);
  };

  const removeEducationField = (index) => {
    if (educations.length > 1) {
      setEducations(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasValidEducations = educations.every(edu => 
      edu.degree.trim() && edu.institute.trim() && edu.passingYear
    );

    if (!hasValidEducations) {
      toast.error('Please fill all required education fields');
      return;
    }

    setLoading(true);

    try {
      // Get current employee data first to avoid overwriting
      const currentEmployeeResponse = await employeeAPI.getEmployeeById(employeeId);
      if (!currentEmployeeResponse.success) {
        throw new Error('Failed to load employee data');
      }

      const currentEmployee = currentEmployeeResponse.data;
      
      // Merge new educations with existing ones
      const updatedEducations = [
        ...(currentEmployee.educations || []),
        ...educations.map(edu => ({
          degree: edu.degree.trim(),
          institute: edu.institute.trim(),
          passingYear: edu.passingYear
        }))
      ];

      // Update only the educations field
      const response = await employeeAPI.updateEmployee(employeeId, {
        educations: updatedEducations
      });
      
      if (response.success) {
        toast.success('Education information added successfully');
        setEmployeeId(response.data._id);
        setCurrentStep(3)
      } else {
        toast.error(response.message || 'Failed to update education information');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error(error.message || 'Error updating education information');
    } finally {
      setLoading(false);
    }
  };

  const removeExistingEducation = async (index) => {
    try {
      const updatedEducations = existingEducations.filter((_, i) => i !== index);
      const response = await employeeAPI.updateEmployee(employeeId, {
        educations: updatedEducations
      });
      
      if (response.success) {
        setExistingEducations(updatedEducations);
        toast.success('Education record removed successfully');
      } else {
        toast.error('Failed to remove education record');
      }
    } catch (error) {
      console.error('Error removing education:', error);
      toast.error('Error removing education record');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Education Information</h2>
                <p className="text-blue-100 mt-1">Add educational qualifications and background</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Existing Education Records */}
            {existingEducations.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={20} className="text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Existing Education Records</h4>
                </div>
                <div className="space-y-4">
                  {existingEducations.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <GraduationCap size={16} className="text-blue-600" />
                          </div>
                          <h5 className="font-semibold text-gray-900 text-lg">{edu.degree}</h5>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {edu.institute}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {edu.passingYear}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingEducation(index)}
                        className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove education record"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Education */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus size={20} className="text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {existingEducations.length > 0 ? 'Add More Education' : 'Add Education'}
                    </h4>
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                    {educations.length} {educations.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add new educational qualifications and achievements
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {educations.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCap size={18} className="text-blue-600" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h5>
                      </div>
                      {educations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducationField(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Degree */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                          <GraduationCap size={16} className="text-blue-600" />
                          Degree/Qualification <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., Bachelor of Science in Computer Science"
                          required
                        />
                      </div>

                      {/* Institute */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                          <BookOpen size={16} className="text-blue-600" />
                          Institute/University <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.institute}
                          onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., University of Oxford"
                          required
                        />
                      </div>

                      {/* Passing Year */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600" />
                          Passing Year <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={edu.passingYear}
                          onChange={(e) => handleEducationChange(index, 'passingYear', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                          required
                        >
                          <option value="">Select Year</option>
                          {Array.from({ length: 50 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Empty div to maintain grid layout */}
                      <div></div>
                    </div>
                  </div>
                ))}

                {/* Add Another Education Button */}
                <button
                  type="button"
                  onClick={addEducationField}
                  className="flex items-center gap-3 px-6 py-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border-2 border-dashed border-blue-300 transition-all duration-200 w-full justify-center group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Plus size={18} className="text-blue-600" />
                  </div>
                  <span className="font-semibold">Add Another Education</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
            >
              <X size={18} />
              Cancel
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving Education...
                  </>
                ) : (
                  <>
                    <GraduationCap size={18} />
                    Save Education & Continue
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationStep;