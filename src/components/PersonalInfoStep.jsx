// components/steps/PersonalInfoStep.jsx
import { useState, useEffect, useRef } from 'react';
import AddressAutocomplete from '@/components/AddressAutoComplete';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Upload, FileText, X, Camera } from 'lucide-react';

const PersonalInfoStep = ({ 
  employeeId, 
  setEmployeeId,
  onSuccess, 
  onClose,
  setCurrentStep,
  titles,
  cities,
  nationalities,
  visaTypes,
  countries,
  employeeStatuses,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    bloodGroup: '',
    employeeStatus: '',
    maritalStatus: '',
    contactNo: '',
    email: '',
    country: '',
    city: '',
    nationality: '',
    address: '',
    postCode: '',
    visaType: '',
    visaExpiry: '',
    nationalInsuranceNumber: '',
    isActive: true,
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  const fileInputRef = useRef(null);

  const NATIONALITIES = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 
    'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 
    'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 
    'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 
    'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 
    'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 
    'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean', 
    'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 
    'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 
    'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 
    'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 
    'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 
    'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 
    'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 
    'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 
    'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 
    'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 
    'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 
    'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 
    'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 
    'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 
    'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 
    'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 
    'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 
    'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 
    'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'
  ];

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  const GENDERS = ['Male', 'Female', 'Other'];
  const today = new Date().toISOString().split("T")[0];

  // Get the correct image source
  const getImageSrc = () => {
    if (imageError || !profilePicture) {
      return '/default-avatar.png';
    }
    
    // If it's a blob URL (from file upload), use it directly
    if (profilePicture.startsWith('blob:')) {
      return profilePicture;
    }
    
    // If it's a server URL, construct it properly
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return profilePicture.startsWith('http') 
      ? profilePicture 
      : `${BASE_URL}/uploads/profile-pictures/${profilePicture}`;
  };

  const loadEmployeeData = async () => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success) {
        const employee = response.data;
        setFormData({
          title: employee.title || '',
          firstName: employee.firstName || '',
          middleName: employee.middleName || '',
          lastName: employee.lastName || '',
          dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
          placeOfBirth: employee.placeOfBirth || '',
          gender: employee.gender || '',
          bloodGroup: employee.bloodGroup || '',
          maritalStatus: employee.maritalStatus || '',
          employeeStatus: employee.employeeStatus || '',
          contactNo: employee.contactNo || '',
          email: employee.email || '',
          country: employee.country || '',
          city: employee.city || '',
          nationality: employee.nationality || '',
          address: employee.address || '',
          postCode: employee.postCode || '',
          visaType: employee.visaType || '',
          visaExpiry: employee.visaExpiry ? employee.visaExpiry.split('T')[0] : '',
          nationalInsuranceNumber: employee.nationalInsuranceNumber || '',
          isActive: employee.isActive ?? true,
        });

        if (employee.profilePicture) {
          setProfilePicture(employee.profilePicture);
          setImageError(false); // Reset error state when loading new image
        } else {
          setProfilePicture(null);
          setImageError(false);
        }
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    handleInputChange(e);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleAddressSelect = (suggestion) => {
    console.log('Selected address:', suggestion);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      setProfilePictureFile(file);
      const objectUrl = URL.createObjectURL(file);
      setProfilePicture(objectUrl);
      setImageError(false); // Reset error state for new image
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePictureFile(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Append files if they exist
      if (profilePictureFile) {
        submitData.append('profilePicture', profilePictureFile);
      }

      let response;
      if (employeeId) {
        response = await employeeAPI.updateEmployee(employeeId, submitData);
      } else {
        response = await employeeAPI.createEmployee(submitData);
      }

      if (response.success) {
        toast.success(`Employee ${employeeId ? 'updated' : 'created'} successfully`);
        setEmployeeId(response.data._id);
        setCurrentStep(2)
        console.log("Personal Form Submit:", response.data._id)
      } else {
        toast.error(response.message || `Failed to ${employeeId ? 'update' : 'create'} employee`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profilePicture && profilePicture.startsWith('blob:')) {
        URL.revokeObjectURL(profilePicture);
      }
    };
  }, [profilePicture]);

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  return (
    <div className="bg-black bg-opacity-50 relative backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {employeeId ? 'Edit Personal Information' : 'Personal Information'}
              </h2>
              <p className="text-purple-100 mt-1">
                {employeeId ? 'Update employee personal details' : 'Add new employee personal details'}
              </p>
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
            {/* Profile Picture Upload */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera size={20} className="text-purple-600" />
                Profile Picture
              </h4>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0 relative">
                  <div className="relative">
                    <img 
                      src={getImageSrc()}
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-200"></div>
                    
                    {/* Remove button for uploaded images */}
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <label className="flex items-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 cursor-pointer transition-all duration-200 w-fit shadow-md hover:shadow-lg">
                    <Upload size={18} />
                    {profilePicture ? 'Change Picture' : 'Upload Picture'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                  <p className="text-sm text-gray-600">
                    Recommended: Square image, 500x500px, Max 2MB
                    <br />
                    <span className="text-xs text-gray-500">JPEG, PNG, WebP formats supported</span>
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive || false}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-900">Active Employee</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Personal Details</h4>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Title</option>
                      {titles.map(title => (
                        <option key={title._id} value={title._id}>
                          {title.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={today}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth *</label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., London, UK"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Gender</option>
                      {GENDERS.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="">Select Blood Group</option>
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Marital Status</option>
                      {MARITAL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Status</label>
                    <select
                      name="employeeStatus"
                      value={formData.employeeStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Employee Status</option>
                      <option value="Active">Active</option>
                      <option value="Resigned">Hired</option>
                      <option value="On Leave">Fired</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Nationality</option>
                      {nationalities.map((nationality) => (
                        <option key={nationality._id} value={nationality.name}>
                          {nationality.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* National Insurance Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">National Insurance Number *</label>
                    <input
                      type="text"
                      name="nationalInsuranceNumber"
                      value={formData.nationalInsuranceNumber || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., john.doe@company.com"
                      required
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <span>⚠</span> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Contact No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact No. *</label>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., +44 20 7946 0958"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <AddressAutocomplete
                      value={formData.address}
                      onChange={handleInputChange}
                      onSelect={handleAddressSelect}
                      placeholder="Start typing your address..."
                      required={true}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Start typing your address and select from suggestions
                    </p>
                  </div>

                  {/* Post Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Post Code *</label>
                    <input
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., SPA 7DE"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country._id} value={country._id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Visa Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Visa Information</h4>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type *</label>
                    <select
                      name="visaType"
                      value={formData.visaType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Visa Type</option>
                      {visaTypes.map(visaType => (
                        <option key={visaType._id} value={visaType._id}>
                          {visaType.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visa Expiry Date *</label>
                    <input
                      type="date"
                      name="visaExpiry"
                      value={formData.visaExpiry}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {employeeId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {employeeId ? 'Update & Continue' : 'Save & Continue'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoStep;