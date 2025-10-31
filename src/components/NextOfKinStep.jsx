// components/steps/NextOfKinStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, User, Heart, Phone, Mail, MapPin, Calendar, Briefcase, Star } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutoComplete';

const NextOfKinStep = ({ setEmployeeId, employeeId, onSuccess, onClose, onBack, setCurrentStep }) => {
  const [nextOfKins, setNextOfKins] = useState([{
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
  }]);
  const [loading, setLoading] = useState(false);
  const [existingNextOfKins, setExistingNextOfKins] = useState([]);

  const RELATIONSHIPS = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Grandparent', 
    'Grandchild', 'Friend', 'Colleague', 'Other'
  ];

  const GENDERS = ['Male', 'Female', 'Other'];
  const COUNTRIES = ['United Kingdom', 'Ireland', 'United States', 'Canada', 'Australia', 'Other'];

  useEffect(() => {
    if (employeeId) {
      loadNextOfKins();
    }
  }, [employeeId]);

  const loadNextOfKins = async () => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success && response.data.nextOfKins) {
        setExistingNextOfKins(response.data.nextOfKins);
      }
    } catch (error) {
      console.error('Error loading next of kin:', error);
    }
  };

  const handleNextOfKinChange = (index, field, value) => {
    const newNextOfKins = [...nextOfKins];
    newNextOfKins[index] = {
      ...newNextOfKins[index],
      [field]: value
    };
    
    // If setting as primary, unset others
    if (field === 'isPrimary' && value === true) {
      newNextOfKins.forEach((kin, i) => {
        if (i !== index) {
          newNextOfKins[i].isPrimary = false;
        }
      });
    }
    
    setNextOfKins(newNextOfKins);
  };

  const addNextOfKinField = () => {
    setNextOfKins(prev => [
      ...prev,
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
        isPrimary: false
      }
    ]);
  };

  const removeNextOfKinField = (index) => {
    setNextOfKins(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddressSelect = (suggestion, index) => {
    console.log('Selected address:', suggestion);
    // You can extract specific address components here if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasValidNextOfKins = nextOfKins.every(kin => 
      kin.fullName && 
      kin.relationship && 
      kin.dateOfBirth && 
      kin.gender && 
      kin.address && 
      kin.city && 
      kin.country && 
      kin.phoneNumber
    );

    if (!hasValidNextOfKins) {
      toast.error('Please fill all required next of kin fields');
      return;
    }

    // Ensure at least one is primary
    const hasPrimary = nextOfKins.some(kin => kin.isPrimary);
    if (!hasPrimary && nextOfKins.length > 0) {
      const newNextOfKins = [...nextOfKins];
      newNextOfKins[0].isPrimary = true;
      setNextOfKins(newNextOfKins);
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      const nextOfKinJson = nextOfKins.map(kin => ({
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

      const response = await employeeAPI.updateEmployee(employeeId, submitData);
      
      if (response.success) {
        toast.success('Next of kin information updated successfully');
        onSuccess(employeeId);
      } else {
        toast.error(response.message || 'Failed to update next of kin information');
      }
    } catch (error) {
      console.error('Error updating next of kin:', error);
      toast.error('Error updating next of kin information');
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
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Next of Kin Information</h2>
                <p className="text-purple-100 mt-1">Add emergency contacts and family information</p>
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
          <div className="space-y-6">
            {/* Existing Next of Kin */}
            {existingNextOfKins.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} className="text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Existing Next of Kin</h4>
                </div>
                <div className="space-y-4">
                  {existingNextOfKins.map((kin, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <User size={16} className="text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-gray-900 text-lg">{kin.fullName}</h5>
                              {kin.isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Star size={12} />
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-green-700 font-medium">{kin.relationship}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {kin.phoneNumber}
                          </span>
                          {kin.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {kin.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {kin.city}, {kin.country}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Next of Kin */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus size={20} className="text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {existingNextOfKins.length > 0 ? 'Add More Next of Kin' : 'Add Next of Kin'}
                    </h4>
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                    {nextOfKins.length} {nextOfKins.length === 1 ? 'contact' : 'contacts'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add emergency contacts and family members
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {nextOfKins.map((kin, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User size={18} className="text-purple-600" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900">Contact #{index + 1}</h5>
                        {kin.isPrimary && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <Star size={14} />
                            Primary Contact
                          </span>
                        )}
                      </div>
                      {nextOfKins.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNextOfKinField(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User size={16} className="text-purple-600" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={kin.fullName}
                          onChange={(e) => handleNextOfKinChange(index, 'fullName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., Sarah Johnson"
                          required
                        />
                      </div>

                      {/* Relationship */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Heart size={16} className="text-purple-600" />
                          Relationship to Employee *
                        </label>
                        <select
                          value={kin.relationship}
                          onChange={(e) => handleNextOfKinChange(index, 'relationship', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-purple-600" />
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={kin.dateOfBirth}
                          onChange={(e) => handleNextOfKinChange(index, 'dateOfBirth', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User size={16} className="text-purple-600" />
                          Gender *
                        </label>
                        <select
                          value={kin.gender}
                          onChange={(e) => handleNextOfKinChange(index, 'gender', e.target.value)}
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

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={16} className="text-purple-600" />
                          Address *
                        </label>
                        <AddressAutocomplete
                          value={kin.address}
                          onChange={(e) => handleNextOfKinChange(index, 'address', e.target.value)}
                          onSelect={(suggestion) => handleAddressSelect(suggestion, index)}
                          placeholder="Start typing the address..."
                          required={true}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Start typing address and select from suggestions
                        </p>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={16} className="text-purple-600" />
                          City *
                        </label>
                        <input
                          type="text"
                          value={kin.city}
                          onChange={(e) => handleNextOfKinChange(index, 'city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., London"
                          required
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={16} className="text-purple-600" />
                          Country *
                        </label>
                        <select
                          value={kin.country}
                          onChange={(e) => handleNextOfKinChange(index, 'country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-purple-600" />
                          Phone Number (Primary) *
                        </label>
                        <input
                          type="tel"
                          value={kin.phoneNumber}
                          onChange={(e) => handleNextOfKinChange(index, 'phoneNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., +44 7700 900077"
                          required
                        />
                      </div>

                      {/* Alternate Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-purple-600" />
                          Alternate Phone Number
                        </label>
                        <input
                          type="tel"
                          value={kin.alternatePhoneNumber}
                          onChange={(e) => handleNextOfKinChange(index, 'alternatePhoneNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., +44 7700 900088"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail size={16} className="text-purple-600" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={kin.email}
                          onChange={(e) => handleNextOfKinChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., sarah.johnson@email.com"
                        />
                      </div>

                      {/* Occupation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Briefcase size={16} className="text-purple-600" />
                          Occupation
                        </label>
                        <input
                          type="text"
                          value={kin.occupation}
                          onChange={(e) => handleNextOfKinChange(index, 'occupation', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          placeholder="e.g., Teacher, Engineer"
                        />
                      </div>

                      {/* Primary Contact Checkbox */}
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={kin.isPrimary}
                            onChange={(e) => handleNextOfKinChange(index, 'isPrimary', e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">Set as primary emergency contact</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Next of Kin Button */}
                <button
                  type="button"
                  onClick={addNextOfKinField}
                  className="flex items-center gap-3 px-6 py-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl border-2 border-dashed border-purple-300 transition-all duration-200 w-full justify-center group"
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Plus size={18} className="text-purple-600" />
                  </div>
                  <span className="font-semibold">Add Another Next of Kin</span>
                </button>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Heart size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Emergency Contact Information</h3>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p>• Please provide at least one next of kin contact for emergency situations</p>
                    <p>• The primary contact will be used first in case of emergencies</p>
                    <p>• Ensure contact information is current and accurate</p>
                    <p>• Multiple contacts can be added for different family members</p>
                  </div>
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
                    Saving Contacts...
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                    Save Next of Kin & Continue
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

export default NextOfKinStep;