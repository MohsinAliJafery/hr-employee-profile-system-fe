// components/steps/EmploymentStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDepartments, getDesignations } from '@/utils/employeeFormDataUtils';

const EmploymentStep = ({ employeeId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    department: '',
    jobTitle: '',
    startDate: '',
    salary: '',
  });

  const [employments, setEmployments] = useState([{
    employerName: '',
    jobTitle: '',
    employmentType: '',
    companyAddress: '',
    department: '',
    startDate: '',
    endDate: '',
    duration: '',
    jobDescription: '',
    reasonForLeaving: ''
  }]);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [existingEmployments, setExistingEmployments] = useState([]);

  const EMPLOYMENT_TYPES = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 
    'Self-employed', 'Temporary', 'Seasonal', 'Volunteer', 'Other'
  ];

  useEffect(() => {
    loadFormData();
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  const loadFormData = async () => {
    try {
      const [deptsData, designationsData] = await Promise.all([
        getDepartments(),
        getDesignations()
      ]);
      setDepartments(deptsData);
      setDesignations(designationsData);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const loadEmployeeData = async () => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success) {
        const employee = response.data;
        setFormData({
          department: employee.department || '',
          jobTitle: employee.jobTitle || '',
          startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
          salary: employee.salary || '',
        });

        if (employee.employments && employee.employments.length > 0) {
          setExistingEmployments(employee.employments);
        }
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmploymentChange = (index, field, value) => {
    const newEmployments = [...employments];
    newEmployments[index] = {
      ...newEmployments[index],
      [field]: value
    };
    setEmployments(newEmployments);

    // Auto-calculate duration when dates change
    if ((field === 'startDate' || field === 'endDate') && newEmployments[index].startDate) {
      const duration = calculateDuration(
        field === 'startDate' ? value : newEmployments[index].startDate,
        field === 'endDate' ? value : newEmployments[index].endDate
      );
      newEmployments[index].duration = duration;
      setEmployments(newEmployments);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date() : new Date(endDate);
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    if (totalMonths < 0) totalMonths = 0;
    
    const yearsPart = Math.floor(totalMonths / 12);
    const monthsPart = totalMonths % 12;
    
    const parts = [];
    if (yearsPart > 0) parts.push(`${yearsPart} year${yearsPart !== 1 ? 's' : ''}`);
    if (monthsPart > 0) parts.push(`${monthsPart} month${monthsPart !== 1 ? 's' : ''}`);
    
    return parts.join(' ') || '0 months';
  };

  const handleDateChange = (index, field, value) => {
    handleEmploymentChange(index, field, value);
  };

  const addEmploymentField = () => {
    setEmployments(prev => [
      ...prev,
      {
        employerName: '',
        jobTitle: '',
        employmentType: '',
        companyAddress: '',
        department: '',
        startDate: '',
        endDate: '',
        duration: '',
        jobDescription: '',
        reasonForLeaving: ''
      }
    ]);
  };

  const removeEmploymentField = (index) => {
    setEmployments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current employment
    if (!formData.department || !formData.jobTitle || !formData.startDate || !formData.salary) {
      toast.error('Please fill all current employment fields');
      return;
    }

    // Validate employment history
    const hasValidEmployments = employments.every(emp => 
      emp.employerName && emp.jobTitle && emp.employmentType && emp.companyAddress && emp.startDate
    );

    if (!hasValidEmployments) {
      toast.error('Please fill all required employment history fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append current employment data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Append employment history
      const employmentJson = employments.map(emp => ({
        employerName: emp.employerName,
        jobTitle: emp.jobTitle,
        employmentType: emp.employmentType,
        companyAddress: emp.companyAddress,
        department: emp.department,
        startDate: emp.startDate,
        endDate: emp.endDate,
        duration: emp.duration,
        jobDescription: emp.jobDescription,
        reasonForLeaving: emp.reasonForLeaving
      }));
      submitData.append('employments', JSON.stringify(employmentJson));

      const response = await employeeAPI.updateEmployee(employeeId, submitData);
      
      if (response.success) {
        toast.success('Employment information updated successfully');
        onSuccess(employeeId);
      } else {
        toast.error(response.message || 'Failed to update employment information');
      }
    } catch (error) {
      console.error('Error updating employment:', error);
      toast.error('Error updating employment information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Employment Information</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Current Employment */}
            <div className="border-b pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Employment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Job Title</option>
                    {designations.map(designation => (
                      <option key={designation._id} value={designation._id}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment History */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Employment History</h3>
                <button
                  type="button"
                  onClick={addEmploymentField}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              {existingEmployments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Employment History</h4>
                  {existingEmployments.map((emp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{emp.jobTitle} at {emp.employerName}</h5>
                          <p className="text-sm text-gray-600">
                            {emp.startDate ? new Date(emp.startDate).toLocaleDateString() : ''} - 
                            {emp.endDate === 'Present' ? ' Present' : (emp.endDate ? new Date(emp.endDate).toLocaleDateString() : '')}
                          </p>
                          <p className="text-sm text-gray-500">{emp.employmentType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {employments.map((employment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Employment #{index + 1}</h4>
                    {employments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmploymentField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  {/* Employment Details */}
                  <div className="mb-8">
                    <h5 className="text-lg font-medium text-gray-900 mb-4">1. Employment Details</h5>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employer Name *
                        </label>
                        <input
                          type="text"
                          value={employment.employerName}
                          onChange={(e) => handleEmploymentChange(index, 'employerName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Google Inc."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title / Position Held *
                        </label>
                        <input
                          type="text"
                          value={employment.jobTitle}
                          onChange={(e) => handleEmploymentChange(index, 'jobTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Senior Software Engineer"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employment Type *
                        </label>
                        <select
                          value={employment.employmentType}
                          onChange={(e) => handleEmploymentChange(index, 'employmentType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Type</option>
                          {EMPLOYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Address / Location *
                        </label>
                        <input
                          type="text"
                          value={employment.companyAddress}
                          onChange={(e) => handleEmploymentChange(index, 'companyAddress', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., San Francisco, CA, USA"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department / Division (optional)
                        </label>
                        <input
                          type="text"
                          value={employment.department}
                          onChange={(e) => handleEmploymentChange(index, 'department', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Engineering Department"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates of Employment */}
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-4">2. Dates of Employment</h5>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date (Month/Year) *
                        </label>
                        <input
                          type="month"
                          value={employment.startDate}
                          onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date (Month/Year) *
                        </label>
                        <div className="space-y-2">
                          <input
                            type="month"
                            value={employment.endDate === 'Present' ? '' : employment.endDate}
                            onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                            disabled={employment.endDate === 'Present'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            required={employment.endDate !== 'Present'}
                          />
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={employment.endDate === 'Present'}
                              onChange={(e) => 
                                handleDateChange(index, 'endDate', e.target.checked ? 'Present' : '')
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Currently working here (Present)
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Duration
                        </label>
                        <input
                          type="text"
                          value={employment.duration}
                          onChange={(e) => handleEmploymentChange(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Auto-calculated"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-8">
                    <h5 className="text-lg font-medium text-gray-900 mb-4">Additional Information (Optional)</h5>
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description / Responsibilities
                        </label>
                        <textarea
                          value={employment.jobDescription}
                          onChange={(e) => handleEmploymentChange(index, 'jobDescription', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your main responsibilities and achievements..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Leaving (if applicable)
                        </label>
                        <input
                          type="text"
                          value={employment.reasonForLeaving}
                          onChange={(e) => handleEmploymentChange(index, 'reasonForLeaving', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Career growth, Company restructuring, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {employments.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No employment history added yet</p>
                  <button
                    type="button"
                    onClick={addEmploymentField}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus size={16} />
                    Add First Employment
                  </button>
                </div>
              )}
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
                'Save Employment Information'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmploymentStep;