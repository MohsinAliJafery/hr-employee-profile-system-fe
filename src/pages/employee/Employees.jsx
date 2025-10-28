'use client';
import AddressAutocomplete from '@/components/AddressAutoComplete';
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
  profilePicture,
  setProfilePicture,
  ukCities
}) => {
  // List of world nationalities
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
  const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];

  const handleAddressSelect = (suggestion) => {
    // You can use the full suggestion data if needed
    console.log('Selected address:', suggestion);
    // The address value is already updated via onChange in the AddressAutocomplete component
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600 mb-6">Basic details about the employee</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="border-b pb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h4>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            {profilePicture ? (
               <img 
                src={URL.createObjectURL(profilePicture)} 
                alt="Profile preview" 
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
            ) : formData.profilePicturePath ? (
              <img 
                src={`http://localhost:5000/uploads/${formData.profilePicturePath}`}
                alt="Current profile" 
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors w-fit">
              <Upload size={16} />
              {profilePicture || formData.profilePicturePath ? 'Change Picture' : 'Upload Picture'}
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfilePicture(file);
                  }
                }}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, 500x500px, Max 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <select
            name="title"
            value={formData.title || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Title</option>
            {TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
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
            value={formData.firstName || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Last Name */}
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

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth *</label>
          <input
            type="text"
            name="placeOfBirth"
            value={formData.placeOfBirth || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., London, UK"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select
            name="gender"
            value={formData.gender || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            value={formData.bloodGroup || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

             {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <select
            name="nationality"
            value={formData.nationality || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Nationality</option>
            {NATIONALITIES.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., john.doe@company.com"
            required
          />
        </div>

        {/* Contact No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact No. *</label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., +44 20 7946 0958"
            required
          />
        </div>

        {/* Mobile No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No. *</label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., +44 7700 900077"
            required
          />
        </div>

        {/* Country */}
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
            {/* Add more countries if needed */}
          </select>
        </div>

        {/* City */}
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


        {/* Address - Full width */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <AddressAutocomplete
            value={formData.address || ''}
            onChange={onInputChange}
            onSelect={handleAddressSelect}
            placeholder="Start typing your address..."
            required={true}
          />
          <p className="text-xs text-gray-500 mt-1">
            Start typing your address and select from suggestions
          </p>
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
    <div className="space-y-6 h-auto py-[70px]">
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
            type="text"
            name="salary"
            value={formData.salary || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 45000"
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

// Step 4 Component - Next of Kin
const NextOfKinStep = ({
  formData,
  onInputChange,
  onAddNextOfKin,
  onRemoveNextOfKin,
  onNextOfKinChange
}) => {
  const RELATIONSHIPS = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Grandparent', 
    'Grandchild', 'Friend', 'Colleague', 'Other'
  ];

  const GENDERS = ['Male', 'Female', 'Other'];
  const UK_CITIES = [/* Your existing UK cities array */];
  const COUNTRIES = ['United Kingdom', 'Ireland', 'United States', 'Canada', 'Australia', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Next of Kin Information</h3>
        <p className="text-gray-600 mb-6">Emergency contact details for the employee</p>
      </div>

      {formData.nextOfKins.map((kin, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            {formData.nextOfKins.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveNextOfKin(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={kin.fullName || ''}
                onChange={(e) => onNextOfKinChange(index, 'fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sarah Johnson"
                required
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Employee *
              </label>
              <select
                value={kin.relationship || ''}
                onChange={(e) => onNextOfKinChange(index, 'relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Relationship</option>
                {RELATIONSHIPS.map((relationship) => (
                  <option key={relationship} value={relationship}>
                    {relationship}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={kin.dateOfBirth || ''}
                onChange={(e) => onNextOfKinChange(index, 'dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={kin.gender || ''}
                onChange={(e) => onNextOfKinChange(index, 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <AddressAutocomplete
                value={kin.address || ''}
                onChange={(e) => onNextOfKinChange(index, 'address', e.target.value)}
                placeholder="Start typing the address..."
                required={true}
                name={`nextOfKin-address-${index}`}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                value={kin.city || ''}
                onChange={(e) => onNextOfKinChange(index, 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select City</option>
                {UK_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={kin.country || ''}
                onChange={(e) => onNextOfKinChange(index, 'country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Primary) *
              </label>
              <input
                type="tel"
                value={kin.phoneNumber || ''}
                onChange={(e) => onNextOfKinChange(index, 'phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., +44 7700 900077"
                required
              />
            </div>

            {/* Alternate Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Phone Number
              </label>
              <input
                type="tel"
                value={kin.alternatePhoneNumber || ''}
                onChange={(e) => onNextOfKinChange(index, 'alternatePhoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., +44 7700 900088"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={kin.email || ''}
                onChange={(e) => onNextOfKinChange(index, 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., sarah.johnson@email.com"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={kin.occupation || ''}
                onChange={(e) => onNextOfKinChange(index, 'occupation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Teacher, Engineer"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddNextOfKin}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus size={16} />
        Add Another Next of Kin
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Emergency Contact Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Please provide at least one next of kin contact. The primary contact will be used first in case of emergencies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5 Component - Documents Upload
const DocumentsStep = ({
  formData,
  onDocumentChange,
  onDocumentFileUpload,
  onAddDocument,
  onRemoveDocument
}) => {
  const DOCUMENT_TYPES = [
    'CAS Letter',
    'Passport',
    'Visa Card', 
    'BRP Card',
    'Driving License',
    'NI Number',
    'Bank Statement',
    'Utility Bill',
    'Tenancy Agreement',
    'Employment Contract',
    'Payslip',
    'CV/Resume',
    'References',
    'Qualifications',
    'DBS Certificate',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Documents Upload</h3>
        <p className="text-gray-600 mb-6">Upload all required documents for the employee</p>
      </div>

      {formData.documents.map((doc, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Document #{index + 1}</h4>
            {formData.documents.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDocument(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={doc.documentType || ''}
                onChange={(e) => onDocumentChange(index, 'documentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Document Type</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Document Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                value={doc.documentTitle || ''}
                onChange={(e) => onDocumentChange(index, 'documentTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., UK Passport Bio Page"
                required
              />
            </div>

            {/* Document Upload - Full width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Upload size={16} />
                    {doc.documentPath ? 'Change Document' : 'Choose Document'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onDocumentFileUpload(index, file);
                        }
                      }}
                    />
                  </label>
                  
                  {/* Show current document from database with download link */}
                  {!doc.file && doc.documentPath && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText size={16} />
                        <span>Current: </span>
                      </div>
                      <a 
                        href={`http://localhost:5000/uploads/${doc.documentPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => onRemoveDocument(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                  
                  {/* Show newly selected file */}
                  {doc.file && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText size={16} />
                      <span>New: {doc.file.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {doc.documentPath ? 'Current file will be kept if no new file is selected' : 'Supported formats: PDF, DOC, DOCX, JPG, PNG, WEBP (Max 5MB)'}
                </p>
              </div>
            </div>

            {/* Description (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={doc.description || ''}
                onChange={(e) => onDocumentChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes about this document..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddDocument}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus size={16} />
        Add Another Document
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Upload all required documents for employment verification</li>
                <li>Accepted formats: PDF, DOC, DOCX, JPG, PNG, WEBP</li>
                <li>Maximum file size: 5MB per document</li>
                <li>Ensure documents are clear and readable</li>
              </ul>
            </div>
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
  onNextOfKinChange,
  onAddNextOfKin,
  onRemoveNextOfKin,
    onDocumentChange,           // New
  onDocumentFileUpload,       // New
  onAddDocument,              // New
  onRemoveDocument,  
  visaFile,
  setVisaFile,
  profilePicture,
  setProfilePicture,
  formLoading,
}) => {

  const [currentStep, setCurrentStep] = useState(0);

  const UK_CITIES = [
  // England
  'London', 'Birmingham', 'Manchester', 'Leeds', 'Sheffield', 'Bradford', 'Liverpool', 'Bristol', 
  'Coventry', 'Leicester', 'Nottingham', 'Newcastle upon Tyne', 'Kingston upon Hull', 'Stoke-on-Trent', 
  'Wolverhampton', 'Derby', 'Southampton', 'Portsmouth', 'Plymouth', 'Reading', 'Northampton', 
  'Luton', 'Milton Keynes', 'Aberdeen', 'Norwich', 'Bournemouth', 'Brighton', 'Swindon', 'Sunderland', 
  'Warrington', 'Huddersfield', 'Peterborough', 'Slough', 'Oxford', 'Cambridge', 'Doncaster', 
  'York', 'Gloucester', 'Poole', 'Bath', 'Ipswich', 'Blackpool', 'Middlesbrough', 'Bolton', 
  'Stockport', 'West Bromwich', 'Oldbury', 'Oldham', 'Sutton Coldfield', 'Walsall', 'Gateshead', 
  'Blackburn', 'Cheltenham', 'Basingstoke', 'Chester', 'Colchester', 'Crawley', 'Maidstone', 
  'Eastbourne', 'Weston-super-Mare', 'Worthing', 'Rotherham', 'Dudley', 'Newport', 'Preston', 
  'Southend-on-Sea', 'Mansfield', 'Wigan', 'Rhyl', 'Burnley', 'Solihull', 'Chesterfield', 
  'Carlisle', 'Wakefield', 'Windsor', 'Grays', 'Gillingham', 'Scunthorpe', 'Lincoln', 'Hartlepool', 
  'Bedford', 'Bracknell', 'Cheshunt', 'Bexhill', 'High Wycombe', 'Guildford', 'Tamworth', 
  'Maidenhead', 'Stafford', 'Wimbledon', 'Royal Tunbridge Wells', 'Watford', 'Stevenage', 
  'St Albans', 'Yeovil', 'Loughborough', 'Havant', 'Chatham', 'East Kilbride', 'Farnborough', 
  'Aylesbury', 'Hemel Hempstead', 'Woking', 'Halifax', 'Hartlepool', 'Gosport', 'Bognor Regis', 
  'Gravesend', 'Darlington', 'Ashford', 'Halesowen', 'Canterbury', 'Stourbridge', 'St Helens', 
  'Worcester', 'Gosport', 'Bebington', 'Bridlington', 'Camberley', 'Blyth', 'Keighley', 
  'Paignton', 'Macclesfield', 'Bishop Auckland', 'Folkestone', 'Andover', 'Rugby', 'Newbury', 
  'Ware', 'Bridgwater', 'Leatherhead', 'Havant', 'Burgess Hill', 'Staines', 'Weymouth', 
  'Hitchin', 'Dunstable', 'Fareham', 'Letchworth', 'Horsham', 'Cumbernauld', 'Aldershot', 
  'Bideford', 'Kidderminster', 'Morpeth', 'Fleetwood', 'Wallsend', 'Abingdon', 'Braintree', 
  'Wickford', 'Rickmansworth', 'Littlehampton', 'Bingham', 'Bicester', 'Dartford', 'Waltham Cross', 
  'Mablethorpe', 'Rayleigh', 'Sittingbourne', 'Ely', 'Ilkeston', 'Great Yarmouth', 'Hoddesdon', 
  'Seaford', 'Beccles', 'Huntingdon', 'St Neots', 'Biggleswade', 'Sandy', 'Cromer', 'Sheringham', 
  'Holt', 'Fakenham', 'Swaffham', 'Attleborough', 'Wymondham', 'Dereham', 'Watton', 'Thetford', 
  'Brandon', 'Mildenhall', 'Newmarket', 'Soham', 'Ely', 'Littleport', 'Sutton Bridge', 'Long Sutton', 
  'Spalding', 'Holbeach', 'Crowland', 'Market Deeping', 'Stamford', 'Bourne', 'Oakham', 'Uppingham', 
  'Melton Mowbray', 'Loughborough', 'Shepshed', 'Ashby-de-la-Zouch', 'Coalville', 'Hinckley', 
  'Market Harborough', 'Lutterworth', 'Rugby', 'Southam', 'Leamington Spa', 'Warwick', 'Kenilworth', 
  'Stratford-upon-Avon', 'Shipston-on-Stour', 'Moreton-in-Marsh', 'Chipping Norton', 'Witney', 
  'Carterton', 'Bampton', 'Faringdon', 'Wantage', 'Didcot', 'Wallingford', 'Henley-on-Thames', 
  'Thame', 'Princes Risborough', 'Aylesbury', 'Wendover', 'Tring', 'Berkhamsted', 'Chesham', 
  'Amersham', 'High Wycombe', 'Marlow', 'Beaconsfield', 'Gerrards Cross', 'Denham', 'Uxbridge', 
  'Ruislip', 'Northwood', 'Pinner', 'Harrow', 'Wembley', 'Willesden', 'Kensal Green', 'Kilburn', 
  'Cricklewood', 'Golders Green', 'Hampstead', 'Highgate', 'Muswell Hill', 'Crouch End', 
  'Stoke Newington', 'Hackney', 'Homerton', 'Bow', 'Mile End', 'Stepney', 'Poplar', 'Isle of Dogs', 
  'Canary Wharf', 'Limehouse', 'Wapping', 'Shadwell', 'Whitechapel', 'Aldgate', 'Spitalfields', 
  'Brick Lane', 'Bethnal Green', 'Cambridge Heath', 'Haggerston', 'Hoxton', 'De Beauvoir Town', 
  'Dalston', 'Stamford Hill', 'Clapton', 'Hackney Marshes', 'Leyton', 'Leytonstone', 'Wanstead', 
  'Snaresbrook', 'South Woodford', 'Woodford', 'Buckhurst Hill', 'Loughton', 'Chigwell', 
  'Grange Hill', 'Hainault', 'Fairlop', 'Barkingside', 'Clayhall', 'Redbridge', 'Gants Hill', 
  'Newbury Park', 'Barkingside', 'Fullwell Cross', 'Hainault', 'Chadwell Heath', 'Romford', 
  'Gidea Park', 'Harold Wood', 'Brentwood', 'Shenfield', 'Ingatestone', 'Mountnessing', 
  'Billericay', 'Basildon', 'Wickford', 'Rayleigh', 'Hockley', 'Rochford', 'Ashingdon', 
  'Canewdon', 'Great Wakering', 'Shoeburyness', 'Thorpe Bay', 'Southend-on-Sea', 'Leigh-on-Sea', 
  'Westcliff-on-Sea', 'Chalkwell', 'Prittlewell', 'Eastwood', 'Rayleigh', 'Thundersley', 
  'Benfleet', 'Canvey Island', 'Hadleigh', 'Thundersley', 'Bowers Gifford', 'Pitsea', 
  'Vange', 'Basildon', 'Laindon', 'Langdon Hills', 'Lee Chapel', 'Fryerns', 'Craylands', 
  'Ghyllgrove', 'Kingswood', 'Great Burstead', 'Billericay', 'Stock', 'Ramsden Bellhouse', 
  'Mountnessing', 'Hutton', 'Shenfield', 'Brentwood', 'Warley', 'Great Warley', 'Little Warley', 
  'Childerditch', 'Herongate', 'Ingrave', 'West Horndon', 'East Horndon', 'Billericay', 
  'Ramsden Crays', 'Downham', 'Ramsden Heath', 'Nevendon', 'Bowers Gifford', 'Pitsea', 
  'Vange', 'Basildon', 'Laindon', 'Langdon Hills', 'Dunton', 'Fobbing', 'Corringham', 
  'Stanford-le-Hope', 'Mucking', 'Tilbury', 'Grays', 'Chadwell St Mary', 'Little Thurrock', 
  'West Thurrock', 'South Stifford', 'North Stifford', 'Bulphan', 'Orsett', 'Horndon on the Hill', 
  'Fobbing', 'Corringham', 'Stanford-le-Hope', 'East Tilbury', 'Linford', 'Tilbury', 
  'Grays', 'Chadwell St Mary', 'Little Thurrock', 'West Thurrock', 'South Stifford', 
  'North Stifford', 'Bulphan', 'Orsett', 'Horndon on the Hill', 'Fobbing', 'Corringham', 
  'Stanford-le-Hope', 'East Tilbury', 'Linford',

  // Scotland
  'Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness', 'Perth', 'Stirling', 'Ayr', 
  'Kilmarnock', 'Paisley', 'Greenock', 'Dumfries', 'Falkirk', 'Livingston', 'Cumbernauld', 
  'East Kilbride', 'Hamilton', 'Motherwell', 'Coatbridge', 'Wishaw', 'Clydebank', 'Bearsden', 
  'Milngavie', 'Bishopbriggs', 'Kirkintilloch', 'Lenzie', 'Stepps', 'Moodiesburn', 'Chryston', 
  'Muirhead', 'Glenboig', 'Cumbernauld', 'Kilsyth', 'Denny', 'Bonnybridge', 'Larbert', 
  'Stenhousemuir', 'Falkirk', 'Grangemouth', 'Bo\'ness', 'Linlithgow', 'Bathgate', 
  'Whitburn', 'Armadale', 'Blackburn', 'Livingston', 'Broxburn', 'Uphall', 'Kirkliston', 
  'South Queensferry', 'Dalmeny', 'Ratho', 'Newbridge', 'Ratho Station', 'Currie', 
  'Balerno', 'Juniper Green', 'Colinton', 'Swanston', 'Fairmilehead', 'Buckstone', 
  'Morningside', 'Newington', 'Prestonfield', 'Craigmillar', 'Niddrie', 'Portobello', 
  'Joppa', 'Musselburgh', 'Dalkeith', 'Bonnyrigg', 'Lasswade', 'Loanhead', 'Roslin', 
  'Bilston', 'Milton Bridge', 'Penicuik', 'Auchendinny', 'Howgate', 'Carlops', 
  'West Linton', 'Dolphinton', 'Garvald', 'Gifford', 'Haddington', 'East Linton', 
  'Dunbar', 'North Berwick', 'Gullane', 'Dirleton', 'Aberlady', 'Longniddry', 
  'Macmerry', 'Tranent', 'Cockenzie', 'Port Seton', 'Prestonpans', 'Musselburgh', 
  'Whitecraig', 'Danderhall', 'Sheriffhall', 'Millerhill', 'Newcraighall', 'Craigmillar', 
  'Niddrie', 'Portobello', 'Joppa', 'Musselburgh', 'Dalkeith', 'Bonnyrigg', 'Lasswade', 
  'Loanhead', 'Roslin', 'Bilston', 'Milton Bridge', 'Penicuik', 'Auchendinny', 'Howgate', 
  'Carlops', 'West Linton', 'Dolphinton', 'Garvald', 'Gifford', 'Haddington', 'East Linton', 
  'Dunbar', 'North Berwick', 'Gullane', 'Dirleton', 'Aberlady', 'Longniddry', 'Macmerry', 
  'Tranent', 'Cockenzie', 'Port Seton', 'Prestonpans', 'Musselburgh', 'Whitecraig', 
  'Danderhall', 'Sheriffhall', 'Millerhill', 'Newcraighall',

  // Wales
  'Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Bangor', 'St Asaph', 'St Davids', 
  'Aberystwyth', 'Carmarthen', 'Haverfordwest', 'Milford Haven', 'Fishguard', 
  'Pembroke', 'Pembroke Dock', 'Tenby', 'Saundersfoot', 'Amroth', 'Narberth', 
  'Whitland', 'Newcastle Emlyn', 'Llandeilo', 'Llandovery', 'Llanwrda', 'Llanwrtyd Wells', 
  'Builth Wells', 'Llandrindod Wells', 'Knighton', 'Presteigne', 'Hay-on-Wye', 
  'Talgarth', 'Crickhowell', 'Abergavenny', 'Usk', 'Caldicot', 'Chepstow', 
  'Monmouth', 'Ross-on-Wye', 'Hereford', 'Leominster', 'Kington', 'Bromyard', 
  'Ledbury', 'Malvern', 'Worcester', 'Droitwich', 'Bromsgrove', 'Redditch', 
  'Kidderminster', 'Stourport-on-Severn', 'Bewdley', 'Bridgnorth', 'Shifnal', 
  'Telford', 'Wellington', 'Oakengates', 'Dawley', 'Madeley', 'Ironbridge', 
  'Coalbrookdale', 'Broseley', 'Much Wenlock', 'Church Stretton', 'Craven Arms', 
  'Ludlow', 'Tenbury Wells', 'Cleobury Mortimer', 'Kidderminster', 'Stourport-on-Severn', 
  'Bewdley', 'Bridgnorth', 'Shifnal', 'Telford', 'Wellington', 'Oakengates', 
  'Dawley', 'Madeley', 'Ironbridge', 'Coalbrookdale', 'Broseley', 'Much Wenlock', 
  'Church Stretton', 'Craven Arms', 'Ludlow', 'Tenbury Wells', 'Cleobury Mortimer',

  // Northern Ireland
  'Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh', 'Bangor', 'Craigavon', 
  'Ballymena', 'Newtownabbey', 'Carrickfergus', 'Newtownards', 'Coleraine', 
  'Antrim', 'Omagh', 'Larne', 'Banbridge', 'Portadown', 'Dungannon', 'Enniskillen', 
  'Strabane', 'Limavady', 'Cookstown', 'Magherafelt', 'Downpatrick', 'Ballynahinch', 
  'Comber', 'Holywood', 'Bangor', 'Donaghadee', 'Groomsport', 'Millisle', 'Ballywalter', 
  'Portavogie', 'Kircubbin', 'Ballygowan', 'Saintfield', 'Crossgar', 'Downpatrick', 
  'Killough', 'Ardglass', 'Strangford', 'Portaferry', 'Killyleagh', 'Ballynahinch', 
  'Hillsborough', 'Dromore', 'Banbridge', 'Rathfriland', 'Newry', 'Warrenpoint', 
  'Rostrevor', 'Kilkeel', 'Annalong', 'Newcastle', 'Castlewellan', 'Dundrum', 
  'Ballykinler', 'Clough', 'Ballynahinch', 'Saintfield', 'Crossgar', 'Downpatrick', 
  'Killough', 'Ardglass', 'Strangford', 'Portaferry', 'Killyleagh', 'Ballynahinch', 
  'Hillsborough', 'Dromore', 'Banbridge', 'Rathfriland', 'Newry', 'Warrenpoint', 
  'Rostrevor', 'Kilkeel', 'Annalong', 'Newcastle', 'Castlewellan', 'Dundrum', 
  'Ballykinler', 'Clough',

  // Crown Dependencies
  'Douglas', 'Castletown', 'Peel', 'Ramsey', // Isle of Man
  'St Helier', 'St Aubin', 'Gorey', // Jersey
  'St Peter Port', 'St Sampson' // Guernsey
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
    { title: 'Documents', component: DocumentsStep },
    { title: 'Next of Kin', component: NextOfKinStep },
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
      case 3: // Documents step
      // All documents must have a title and either a file or existing document path
      return formData.documents.every(doc => 
        doc.documentTitle && (doc.file || doc.documentPath)
      );
      case 4:
        // Validate next of kin - at least one required, and primary fields must be filled
        return formData.nextOfKins.length > 0 && 
               formData.nextOfKins.every(kin => 
                 kin.fullName && 
                 kin.relationship && 
                 kin.dateOfBirth && 
                 kin.gender && 
                 kin.address && 
                 kin.city && 
                 kin.country && 
                 kin.phoneNumber
               );
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
    onDocumentChange,
    onDocumentFileUpload,
    onAddDocument,
    onRemoveDocument,
    onNextOfKinChange,
    onAddNextOfKin,
    onRemoveNextOfKin,
    visaFile,
    setVisaFile,
    profilePicture,
    setProfilePicture,
    };

    switch (currentStep) {
      case 0:
        return <PersonalInfoStep {...commonProps} ukCities={UK_CITIES} />;
      case 1:
        return <EducationStep {...commonProps} />;
      case 2:
        return <EmploymentStep {...commonProps} departments={DEPARTMENTS} jobTitles={JOB_TITLES} />;
      case 3:
        return <DocumentsStep {...commonProps} />;
      case 4:
        return <NextOfKinStep {...commonProps} />;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-h-[100vh] overflow-y-auto">
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

        <form onSubmit={handleFinalSubmit} className="p-6">
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
  const [profilePicture, setProfilePicture] = useState(null);

  const recordsPerPage = 5;

  const [formData, setFormData] = useState({
      title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    contactNo: '',
    mobileNo: '',
    email: '',
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
      nextOfKins: [{
      fullName: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      country: 'United Kingdom',
      phoneNumber: '',
      alternatePhoneNumber: '',
      email: '',
      occupation: '',
      isPrimary: true
    }],
      documents: [{
    documentType: '',
    documentTitle: '',
    description: '',
    file: null
  }],
  });

  // Add document handlers:
const handleDocumentChange = useCallback((idx, field, value) => {
  setFormData(prev => {
    const newDocuments = [...prev.documents];
    newDocuments[idx] = {
      ...newDocuments[idx],
      [field]: value
    };
    return {
      ...prev,
      documents: newDocuments
    };
  });
}, []);

const handleDocumentFileUpload = useCallback((idx, file) => {
  console.log(`Uploading document file for document ${idx}:`, file.name);
  setFormData(prev => {
    const newDocuments = [...prev.documents];
    if (!newDocuments[idx]) {
      newDocuments[idx] = { 
        documentType: '', 
        documentTitle: '', 
        description: '', 
        file: null 
      };
    }
    newDocuments[idx] = {
      ...newDocuments[idx],
      file: file
    };
    
    console.log('Updated documents array:', newDocuments);
    return {
      ...prev,
      documents: newDocuments
    };
  });
}, []);

const addDocumentField = useCallback(() => {
  setFormData(prev => ({
    ...prev,
    documents: [
      ...prev.documents,
      { 
        documentType: '', 
        documentTitle: '', 
        description: '', 
        file: null 
      }
    ]
  }));
}, []);

const removeDocumentField = useCallback((idx) => {
  setFormData(prev => ({
    ...prev,
    documents: prev.documents.filter((_, i) => i !== idx)
  }));
}, []);


    // Add Next of Kin handlers
  const handleNextOfKinChange = useCallback((idx, field, value) => {
    setFormData(prev => {
      const newNextOfKins = [...prev.nextOfKins];
      newNextOfKins[idx] = {
        ...newNextOfKins[idx],
        [field]: value
      };
      return {
        ...prev,
        nextOfKins: newNextOfKins
      };
    });
  }, []);

  const addNextOfKinField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      nextOfKins: [
        ...prev.nextOfKins,
        {
          fullName: '',
          relationship: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          country: 'United Kingdom',
          phoneNumber: '',
          alternatePhoneNumber: '',
          email: '',
          occupation: '',
          isPrimary: false // New ones are not primary by default
        }
      ]
    }));
  }, []);

  const removeNextOfKinField = useCallback((idx) => {
    setFormData(prev => ({
      ...prev,
      nextOfKins: prev.nextOfKins.filter((_, i) => i !== idx)
    }));
  }, []);

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
    
    // ✅ Validate that documents have required fields
    const hasValidDocuments = formData.documents.every(doc => 
      doc.documentTitle && (doc.file || doc.documentPath)
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

        Object.keys(formData).forEach(key => {
        if (key !== 'educations' && key !== 'nextOfKins') {
          submitData.append(key, formData[key]);
        }
      });

     if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }

    // Add educations as JSON
    const eduJson = formData.educations.map(edu => ({
      degree: edu.degree,
      institute: edu.institute,
      passingYear: edu.passingYear,
    }));
    submitData.append('educations', JSON.stringify(eduJson));

        const docJson = formData.documents.map(doc => ({
      documentType: doc.documentType,
      documentTitle: doc.documentTitle,
      description: doc.description,
    }));
    submitData.append('documents', JSON.stringify(docJson));

    // ✅ FIX: Use indexed fieldnames for document files
    formData.documents.forEach((doc, idx) => {
      if (doc.file) {
        submitData.append(`documentFiles[${idx}]`, doc.file);
      }
    });

     const nextOfKinJson = formData.nextOfKins.map(kin => ({
        fullName: kin.fullName,
        relationship: kin.relationship,
        dateOfBirth: kin.dateOfBirth,
        gender: kin.gender,
        address: kin.address,
        city: kin.city,
        country: kin.country,
        phoneNumber: kin.phoneNumber,
        alternatePhoneNumber: kin.alternatePhoneNumber,
        email: kin.email,
        occupation: kin.occupation,
        isPrimary: kin.isPrimary
      }));
      submitData.append('nextOfKins', JSON.stringify(nextOfKinJson));

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
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      bloodGroup: '',
      maritalStatus: '',
      contactNo: '',
      mobileNo: '',
      email: '',
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
      nextOfKins: [{
        fullName: '',
        relationship: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        country: 'United Kingdom',
        phoneNumber: '',
        alternatePhoneNumber: '',
        email: '',
        occupation: '',
        isPrimary: true
      }],
        documents: [{
      documentType: '',
      documentTitle: '',
      description: '',
      file: null
    }],
    });
    setVisaFile(null);
    setProfilePicture(null);
  }, []);

   const openEditForm = useCallback((emp) => {
    setEditingEmployee(emp);
    const newFormData = {
      title: emp.title || '',
      firstName: emp.firstName || '',
      middleName: emp.middleName || '',
      lastName: emp.lastName || '',
      dateOfBirth: emp.dateOfBirth ? dayjs(emp.dateOfBirth).format('YYYY-MM-DD') : '',
      placeOfBirth: emp.placeOfBirth || '',
      gender: emp.gender || '',
      bloodGroup: emp.bloodGroup || '',
      maritalStatus: emp.maritalStatus || '',
      contactNo: emp.contactNo || '',
      mobileNo: emp.mobileNo || '',
      email: emp.email || '',
      country: emp.country || 'United Kingdom',
      city: emp.city || '',
      nationality: emp.nationality || '',
      address: emp.address || '',
      visaType: emp.visaType || '',
      visaExpiry: emp.visaExpiry ? dayjs(emp.visaExpiry).format('YYYY-MM-DD') : '',
      visaDocumentPath: emp.visaDocumentPath || '',
      department: emp.department || '',
      jobTitle: emp.jobTitle || '',
      startDate: emp.startDate ? dayjs(emp.startDate).format('YYYY-MM-DD') : '',
      salary: emp.salary || '',
      isActive: emp.isActive ?? true,
      profilePicturePath: emp.profilePicturePath || '',
      educations: emp.educations?.length > 0
        ? emp.educations.map(e => ({
            degree: e.degree || '',
            institute: e.institute || '',
            passingYear: e.passingYear || '',
            file: null,
            documentPath: e.documentPath || '',
          }))
        : [{ degree: '', institute: '', passingYear: '', file: null, documentPath: '' }],

        nextOfKins: emp.nextOfKins?.length > 0
        ? emp.nextOfKins.map(kin => ({
            fullName: kin.fullName || '',
            relationship: kin.relationship || '',
            dateOfBirth: kin.dateOfBirth ? dayjs(kin.dateOfBirth).format('YYYY-MM-DD') : '',
            gender: kin.gender || '',
            address: kin.address || '',
            city: kin.city || '',
            country: kin.country || 'United Kingdom',
            phoneNumber: kin.phoneNumber || '',
            alternatePhoneNumber: kin.alternatePhoneNumber || '',
            email: kin.email || '',
            occupation: kin.occupation || '',
            isPrimary: kin.isPrimary || false
          }))
        : [{
            fullName: '',
            relationship: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            city: '',
            country: 'United Kingdom',
            phoneNumber: '',
            alternatePhoneNumber: '',
            email: '',
            occupation: '',
            isPrimary: true
          }],
              documents: emp.documents?.length > 0
      ? emp.documents.map(doc => ({
          documentType: doc.documentType || '',
          documentTitle: doc.documentTitle || '',
          description: doc.description || '',
          file: null,
          documentPath: doc.documentPath || '',
        }))
      : [{
          documentType: '',
          documentTitle: '',
          description: '',
          file: null,
          documentPath: ''
        }],
    };
    setFormData(newFormData);
    setVisaFile(null);
    setProfilePicture(null);
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
    <div className="p-6 bg-gray-50">
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
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {emp.profilePicturePath ? (
                            <img 
                              src={`http://localhost:5000/uploads/${emp.profilePicturePath}`}
                              alt={`${emp.firstName} ${emp.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                              {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.title} {emp.firstName} {emp.middleName ? `${emp.middleName} ` : ''}{emp.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {emp.city}, {emp.country}
                          </div>
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
    onDocumentChange={handleDocumentChange}
    onDocumentFileUpload={handleDocumentFileUpload}
    onAddDocument={addDocumentField}
    onRemoveDocument={removeDocumentField}
    visaFile={visaFile}
    setVisaFile={setVisaFile}
    profilePicture={profilePicture}
    setProfilePicture={setProfilePicture}
    formLoading={formLoading}
    onNextOfKinChange={handleNextOfKinChange}
    onAddNextOfKin={addNextOfKinField}
    onRemoveNextOfKin={removeNextOfKinField}
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
    onDocumentChange={handleDocumentChange}
    onDocumentFileUpload={handleDocumentFileUpload}
    onAddDocument={addDocumentField}
    onRemoveDocument={removeDocumentField}
    visaFile={visaFile}
    setVisaFile={setVisaFile}
    profilePicture={profilePicture}
    setProfilePicture={setProfilePicture}
    formLoading={formLoading}
    onNextOfKinChange={handleNextOfKinChange}
    onAddNextOfKin={addNextOfKinField}
    onRemoveNextOfKin={removeNextOfKinField}
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