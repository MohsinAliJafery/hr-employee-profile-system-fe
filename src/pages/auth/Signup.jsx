import { useState } from 'react';
import authAPI from '../../services/auth';

const Signup = ({ onSignupSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
    mobileNumber: '',
    companyEmailId: '',
    website: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append logo file if exists
      if (logoFile) {
        submitData.append('logo', logoFile);
      }

      const response = await authAPI.signup(submitData);

      if (response.success) {
        // Save token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log("Signup successful:", response.user);
        alert("Company profile created successfully!");
        
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          companyName: '',
          phoneNumber: '',
          mobileNumber: '',
          companyEmailId: '',
          website: '',
          address: '',
          password: '',
          confirmPassword: ''
        });
        setPreview(null);
        setLogoFile(null);
        
        if (onSignupSuccess) onSignupSuccess();
      } else {
        setErrors([response.message]);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex py-[70px]">
      <div className="w-3/5 mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Create Company Profile</h2>
          <p className="text-white/90 mt-1">Complete your company information to get started</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSignUpSubmit} encType="multipart/form-data">
            {errors?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800 font-semibold mb-2">Please fix the following errors:</div>
                {errors.map((err, i) => (
                  <div key={i} className="text-red-700 text-sm">• {err}</div>
                ))}
              </div>
            )}

            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#450693] mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="middleName"
                    name="middleName"
                    placeholder="Enter your middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#450693] mb-4 pb-2 border-b border-gray-200">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="companyEmailId" className="block text-sm font-medium text-gray-700 mb-2">Company Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="companyEmailId"
                    name="companyEmailId"
                    placeholder="company@example.com"
                    value={formData.companyEmailId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="+1 (555) 123-4567"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Address & Logo Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#450693] mb-4 pb-2 border-b border-gray-200">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8C00FF] transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      id="logo"
                      name="logo"
                      onChange={handleChangeLogo}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="logo" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Click to upload logo</span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                      </div>
                    </label>
                  </div>
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <img
                        src={preview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Company Address *</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors h-40 resize-none"
                    id="address"
                    name="address"
                    placeholder="Enter complete company address..."
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#450693] mb-4 pb-2 border-b border-gray-200">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum 8 characters with letters and numbers</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent transition-colors"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] hover:from-[#7A00E0] hover:to-[#E0366F] disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </span>
                ) : (
                  "Create Company Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;