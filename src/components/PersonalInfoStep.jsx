// components/PersonalInfoStep.jsx
import { Upload, FileText } from 'lucide-react';

const PersonalInfoStep = ({
  formData,
  onInputChange,
  visaFile,
  setVisaFile,
  ukCities
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600 mb-6">Basic details about the employee</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality || ''}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., British"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={onInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
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
                Choose Visa Document
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
              {visaFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileText size={16} />
                  {visaFile.name}
                </div>
              )}
              {!visaFile && formData.visaDocument && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  {formData.visaDocument}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload visa copy (PDF, DOC, JPG, PNG - Max 5MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;