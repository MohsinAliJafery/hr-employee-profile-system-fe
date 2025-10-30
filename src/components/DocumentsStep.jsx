// components/steps/DocumentsStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, Upload, FileText, Eye, Trash2 } from 'lucide-react';

const DocumentsStep = ({ employeeId, onSuccess, onClose }) => {
  const [documents, setDocuments] = useState([{
    documentType: '',
    documentTitle: '',
    description: '',
    file: null
  }]);
  const [loading, setLoading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState([]);

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

  useEffect(() => {
    if (employeeId) {
      loadDocuments();
    }
  }, [employeeId]);

  const loadDocuments = async () => {
    try {
      const response = await employeeAPI.getEmployeeById(employeeId);
      if (response.success && response.data.documents) {
        setExistingDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents];
    newDocuments[index] = {
      ...newDocuments[index],
      [field]: value
    };
    setDocuments(newDocuments);
  };

  const handleDocumentFileUpload = (index, file) => {
    const newDocuments = [...documents];
    newDocuments[index] = {
      ...newDocuments[index],
      file: file
    };
    setDocuments(newDocuments);
  };

  const addDocumentField = () => {
    setDocuments(prev => [
      ...prev,
      { documentType: '', documentTitle: '', description: '', file: null }
    ]);
  };

  const removeDocumentField = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await employeeAPI.deleteEmployeeDocument(employeeId, documentId);
      if (response.success) {
        toast.success('Document deleted successfully');
        loadDocuments(); // Reload documents
      } else {
        toast.error(response.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasValidDocuments = documents.every(doc => 
      doc.documentTitle && doc.file
    );

    if (!hasValidDocuments) {
      toast.error('Please fill all required document fields and upload files');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      const docJson = documents.map(doc => ({
        documentType: doc.documentType,
        documentTitle: doc.documentTitle,
        description: doc.description,
      }));
      submitData.append('documents', JSON.stringify(docJson));

      documents.forEach((doc, idx) => {
        if (doc.file) {
          submitData.append(`documentFiles[${idx}]`, doc.file);
        }
      });

      const response = await employeeAPI.updateEmployee(employeeId, submitData);
      
      if (response.success) {
        toast.success('Documents updated successfully');
        onSuccess(employeeId);
      } else {
        toast.error(response.message || 'Failed to update documents');
      }
    } catch (error) {
      console.error('Error updating documents:', error);
      toast.error('Error updating documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Documents Upload</h2>
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
            {existingDocuments.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Documents</h4>
                <div className="space-y-3">
                  {existingDocuments.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{doc.documentTitle}</h5>
                          {doc.documentType && (
                            <p className="text-sm text-gray-600">{doc.documentType}</p>
                          )}
                          {doc.description && (
                            <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.documentPath && (
                            <a 
                              href={`http://localhost:5000/uploads/${doc.documentPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Eye size={14} />
                              View
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingDocument(doc._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {existingDocuments.length > 0 ? 'Upload More Documents' : 'Upload Documents'}
              </h4>
              
              {documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-medium text-gray-900">Document #{index + 1}</h5>
                    {documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDocumentField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={doc.documentType}
                        onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        value={doc.documentTitle}
                        onChange={(e) => handleDocumentChange(index, 'documentTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., UK Passport Bio Page"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document *
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                            <Upload size={16} />
                            {doc.file ? 'Change Document' : 'Choose Document'}
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleDocumentFileUpload(index, file);
                                }
                              }}
                            />
                          </label>
                          
                          {doc.file && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <FileText size={16} />
                              <span>New file: {doc.file.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Supported formats: PDF, DOC, DOCX, JPG, PNG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={doc.description}
                        onChange={(e) => handleDocumentChange(index, 'description', e.target.value)}
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
                onClick={addDocumentField}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
              >
                <Plus size={16} />
                Add Another Document
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
                'Save Documents'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentsStep;