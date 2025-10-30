// components/steps/NextOfKinStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutoComplete';

const NextOfKinStep = ({ employeeId, onSuccess, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Next of Kin Information</h2>
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
            {existingNextOfKins.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Next of Kin</h4>
                {existingNextOfKins.map((kin, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-900">{kin.fullName}</h5>
                          {kin.isPrimary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{kin.relationship}</p>
                        <p className="text-sm text-gray-500">{kin.phoneNumber}</p>
                        <p className="text-sm text-gray-500">{kin.address}, {kin.city}, {kin.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {existingNextOfKins.length > 0 ? 'Add More Next of Kin' : 'Add Next of Kin'}
              </h4>
              
              {nextOfKins.map((kin, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h5 className="text-md font-medium text-gray-900">Next of Kin #{index + 1}</h5>
                      {kin.isPrimary && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Primary Contact
                        </span>
                      )}
                    </div>
                    {nextOfKins.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNextOfKinField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={kin.fullName}
                        onChange={(e) => handleNextOfKinChange(index, 'fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Sarah Johnson"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship to Employee *
                      </label>
                      <select
                        value={kin.relationship}
                        onChange={(e) => handleNextOfKinChange(index, 'relationship', e.target.value)}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={kin.dateOfBirth}
                        onChange={(e) => handleNextOfKinChange(index, 'dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        value={kin.gender}
                        onChange={(e) => handleNextOfKinChange(index, 'gender', e.target.value)}
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <AddressAutocomplete
                        value={kin.address}
                        onChange={(e) => handleNextOfKinChange(index, 'address', e.target.value)}
                        onSelect={(suggestion) => handleAddressSelect(suggestion, index)}
                        placeholder="Start typing the address..."
                        required={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={kin.city}
                        onChange={(e) => handleNextOfKinChange(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., London"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        value={kin.country}
                        onChange={(e) => handleNextOfKinChange(index, 'country', e.target.value)}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (Primary) *
                      </label>
                      <input
                        type="tel"
                        value={kin.phoneNumber}
                        onChange={(e) => handleNextOfKinChange(index, 'phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., +44 7700 900077"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternate Phone Number
                      </label>
                      <input
                        type="tel"
                        value={kin.alternatePhoneNumber}
                        onChange={(e) => handleNextOfKinChange(index, 'alternatePhoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., +44 7700 900088"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={kin.email}
                        onChange={(e) => handleNextOfKinChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., sarah.johnson@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={kin.occupation}
                        onChange={(e) => handleNextOfKinChange(index, 'occupation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Teacher, Engineer"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={kin.isPrimary}
                          onChange={(e) => handleNextOfKinChange(index, 'isPrimary', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Set as primary emergency contact
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addNextOfKinField}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
              >
                <Plus size={16} />
                Add Another Next of Kin
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                'Save Next of Kin Information'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NextOfKinStep;