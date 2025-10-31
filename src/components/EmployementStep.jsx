// components/steps/EmploymentStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, ChevronLeft, ChevronRight, Building, Calendar, DollarSign, Briefcase, MapPin, Clock } from 'lucide-react';

const EmploymentStep = ({ setEmployeeId, employeeId, onSuccess, onClose, onBack, setCurrentStep, departments, designations }) => {
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
  const [existingEmployments, setExistingEmployments] = useState([]);

  

  const EMPLOYMENT_TYPES = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 
    'Self-employed', 'Temporary', 'Seasonal', 'Volunteer', 'Other'
  ];

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);


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
      // Get current employee data first
      const currentEmployeeResponse = await employeeAPI.getEmployeeById(employeeId);
      if (!currentEmployeeResponse.success) {
        throw new Error('Failed to load employee data');
      }

      const currentEmployee = currentEmployeeResponse.data;
      
      // Merge employment history
      const updatedEmployments = [
        ...(currentEmployee.employments || []),
        ...employments.map(emp => ({
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
        }))
      ];

      // Update both current employment and employment history
      const updateData = {
        ...formData, // Current employment data
        employments: updatedEmployments
      };

      const response = await employeeAPI.updateEmployee(employeeId, updateData);
      
      if (response.success) {
        toast.success('Employment information updated successfully');
        setEmployeeId(response.data._id);
        setCurrentStep(4)
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
    <div className="bg-black relative bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Employment Information</h2>
                <p className="text-purple-100 mt-1">Add current employment and work history</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Current Employment */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-6">
                <Building size={20} className="text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Current Employment</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Building size={16} className="text-purple-600" />
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase size={16} className="text-purple-600" />
                    Job Title *
                  </label>
                  <select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Job Title</option>
                    {designations.map(designation => (
                      <option key={designation._id} value={designation._id}>
                        {designation.title}
                      </option>
                    ))}
                  </select>


                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-purple-600" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-600" />
                    Salary *
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="e.g., 50000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment History */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Employment History</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                      {employments.length} {employments.length === 1 ? 'entry' : 'entries'}
                    </span>
                    <button
                      type="button"
                      onClick={addEmploymentField}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Plus size={16} />
                      Add New
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add previous employment records and work experience
                </p>
              </div>

              <div className="p-6">
                {/* Existing Employment History */}
                {existingEmployments.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building size={18} className="text-green-600" />
                      Existing Employment History
                    </h4>
                    <div className="space-y-4">
                      {existingEmployments.map((emp, index) => (
                        <div key={index} className="border border-green-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-white">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Briefcase size={16} className="text-green-600" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 text-lg">{emp.jobTitle}</h5>
                                  <p className="text-green-700 font-medium">{emp.employerName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {emp.startDate ? new Date(emp.startDate).toLocaleDateString() : ''} - 
                                  {emp.endDate === 'Present' ? ' Present' : (emp.endDate ? new Date(emp.endDate).toLocaleDateString() : '')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {emp.employmentType}
                                </span>
                                {emp.duration && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {emp.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Employment History Entries */}
                <div className="space-y-6">
                  {employments.map((employment, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white hover:shadow-sm transition-all duration-200">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Building size={18} className="text-purple-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">Employment #{index + 1}</h4>
                        </div>
                        {employments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmploymentField(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>

                      {/* Employment Details */}
                      <div className="mb-8">
                        <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Briefcase size={18} className="text-purple-600" />
                          Employment Details
                        </h5>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Building size={16} className="text-purple-600" />
                              Employer Name *
                            </label>
                            <input
                              type="text"
                              value={employment.employerName}
                              onChange={(e) => handleEmploymentChange(index, 'employerName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="e.g., Google Inc."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Briefcase size={16} className="text-purple-600" />
                              Job Title / Position Held *
                            </label>
                            <input
                              type="text"
                              value={employment.jobTitle}
                              onChange={(e) => handleEmploymentChange(index, 'jobTitle', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="e.g., Senior Software Engineer"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Clock size={16} className="text-purple-600" />
                              Employment Type *
                            </label>
                            <select
                              value={employment.employmentType}
                              onChange={(e) => handleEmploymentChange(index, 'employmentType', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <MapPin size={16} className="text-purple-600" />
                              Company Address / Location *
                            </label>
                            <input
                              type="text"
                              value={employment.companyAddress}
                              onChange={(e) => handleEmploymentChange(index, 'companyAddress', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="e.g., San Francisco, CA, USA"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Building size={16} className="text-purple-600" />
                              Department / Division (optional)
                            </label>
                            <input
                              type="text"
                              value={employment.department}
                              onChange={(e) => handleEmploymentChange(index, 'department', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="e.g., Engineering Department"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dates of Employment */}
                      <div className="mb-8">
                        <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar size={18} className="text-purple-600" />
                          Dates of Employment
                        </h5>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date (Month/Year) *
                            </label>
                            <input
                              type="month"
                              value={employment.startDate}
                              onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Date (Month/Year) *
                            </label>
                            <div className="space-y-3">
                              <input
                                type="month"
                                value={employment.endDate === 'Present' ? '' : employment.endDate}
                                onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                                disabled={employment.endDate === 'Present'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:bg-gray-100"
                                required={employment.endDate !== 'Present'}
                              />
                              <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={employment.endDate === 'Present'}
                                  onChange={(e) => 
                                    handleDateChange(index, 'endDate', e.target.checked ? 'Present' : '')
                                  }
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-purple-700">Currently working here (Present)</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Clock size={16} className="text-purple-600" />
                              Total Duration
                            </label>
                            <input
                              type="text"
                              value={employment.duration}
                              onChange={(e) => handleEmploymentChange(index, 'duration', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50"
                              placeholder="Auto-calculated"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Briefcase size={18} className="text-purple-600" />
                          Additional Information (Optional)
                        </h5>
                        <div className="grid gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Job Description / Responsibilities
                            </label>
                            <textarea
                              value={employment.jobDescription}
                              onChange={(e) => handleEmploymentChange(index, 'jobDescription', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="e.g., Career growth, Company restructuring, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {employments.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <div className="p-3 bg-gray-200 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <Briefcase size={24} className="text-gray-500" />
                      </div>
                      <p className="text-gray-500 mb-4 text-lg">No employment history added yet</p>
                      <button
                        type="button"
                        onClick={addEmploymentField}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 mx-auto shadow-sm hover:shadow-md"
                      >
                        <Plus size={18} />
                        Add First Employment
                      </button>
                    </div>
                  )}
                </div>
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
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving Employment...
                  </>
                ) : (
                  <>
                    <Briefcase size={18} />
                    Save Employment & Continue
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

export default EmploymentStep;