// components/EducationStep.jsx
import { X, Plus, Upload, FileText } from 'lucide-react';

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
                    Choose File
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
                  {edu.file && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText size={16} />
                      {edu.file.name}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
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

export default EducationStep;