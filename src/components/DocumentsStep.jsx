// components/steps/DocumentsStep.jsx
import { useState, useEffect } from 'react';
import { employeeAPI } from '@/services/employee';
import { toast } from 'sonner';
import { Plus, X, Upload, FileText, Eye, Trash2, Download } from 'lucide-react';

const DocumentsStep = ({ setEmployeeId, employeeId, onSuccess, onClose, onBack, setCurrentStep }) => {
  const [documents, setDocuments] = useState([{
    documentType: '',
    documentTitle: '',
    description: '',
    file: null
  }]);
  const [loading, setLoading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);

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
    // Validate file type
    const validTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid file (PDF, Word, JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

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

  const handleViewDocument = (document) => {
    if (document.documentPath) {
      // For existing documents
      const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/documents/${document.documentPath}`;
      window.open(fileUrl, '_blank');
    } else if (document.file) {
      // For new documents (preview before upload)
      setPreviewDocument(URL.createObjectURL(document.file));
    }
  };

  const handleDownloadDocument = (document) => {
    if (document.documentPath) {
      const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/uploads/documents/${document.documentPath}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = document.documentTitle || 'document';
      link.click();
    }
  };

  const handleDeleteExistingDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const currentEmployeeResponse = await employeeAPI.getEmployeeById(employeeId);
      if (!currentEmployeeResponse.success) {
        throw new Error('Failed to load employee data');
      }

      const currentEmployee = currentEmployeeResponse.data;
      const updatedDocuments = currentEmployee.documents?.filter(doc => doc._id !== documentId) || [];

      const response = await employeeAPI.updateEmployee(employeeId, {
        documents: updatedDocuments
      });

      if (response.success) {
        toast.success('Document deleted successfully');
        setExistingDocuments(updatedDocuments);
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
    
    // Check if at least one document has file and title
    const hasValidDocuments = documents.some(doc => doc.documentTitle && doc.file);

    if (!hasValidDocuments && documents.length > 0) {
      toast.error('Please fill all required document fields and upload files');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Get current employee data first
      const currentEmployeeResponse = await employeeAPI.getEmployeeById(employeeId);
      if (!currentEmployeeResponse.success) {
        throw new Error('Failed to load employee data');
      }

      const currentEmployee = currentEmployeeResponse.data;
      
      // Prepare new documents data
      const newDocumentsData = documents
        .filter(doc => doc.documentTitle && doc.file)
        .map(doc => ({
          documentType: doc.documentType,
          documentTitle: doc.documentTitle,
          description: doc.description,
          // documentPath will be set by backend
        }));

      // Merge with existing documents
      const allDocuments = [
        ...(currentEmployee.documents || []),
        ...newDocumentsData
      ];

      submitData.append('documents', JSON.stringify(allDocuments));

      // Append files for new documents
      documents.forEach((doc, index) => {
        if (doc.file) {
          submitData.append('documentFiles', doc.file);
        }
      });

      const response = await employeeAPI.updateEmployee(employeeId, submitData);
      
      if (response.success) {
        toast.success('Documents uploaded successfully');
        setDocuments([{ documentType: '', documentTitle: '', description: '', file: null }]);
        loadDocuments(); // Reload to get updated documents with paths
        setEmployeeId(response.data._id);
        setCurrentStep(5)
      } else {
        toast.error(response.message || 'Failed to upload documents');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Error uploading documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Documents Upload</h2>
              <p className="text-purple-100 mt-1">Upload and manage employee documents</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-purple-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Existing Documents */}
            {existingDocuments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Existing Documents</h4>
                <div className="grid gap-4">
                  {existingDocuments.map((doc, index) => (
                    <div key={doc._id || index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="text-purple-500" size={20} />
                            <div>
                              <h5 className="font-semibold text-gray-900">{doc.documentTitle}</h5>
                              {doc.documentType && (
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                  {doc.documentType}
                                </span>
                              )}
                            </div>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                          )}
                          {doc.uploadedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Document"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Document"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingDocument(doc._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Documents */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">
                  {existingDocuments.length > 0 ? 'Upload More Documents' : 'Upload Documents'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Add new documents to employee record
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {documents.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-md font-semibold text-gray-900">Document #{index + 1}</h5>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDocumentField(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Document Type
                        </label>
                        <select
                          value={doc.documentType}
                          onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select Document Type</option>
                          {DOCUMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Document Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={doc.documentTitle}
                          onChange={(e) => handleDocumentChange(index, 'documentTitle', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="e.g., UK Passport Bio Page"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Upload Document <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-all border-2 border-dashed border-purple-200 shadow-sm">
                              <Upload size={20} />
                              <span className="font-medium">
                                {doc.file ? 'Change Document' : 'Choose Document'}
                              </span>
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
                              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-200">
                                <FileText size={20} className="text-green-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{doc.file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleViewDocument(doc)}
                                  className="p-1 text-purple-600 hover:text-purple-800"
                                  title="Preview Document"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            <strong>Supported formats:</strong> PDF, DOC, DOCX, JPG, PNG, WEBP • <strong>Max size:</strong> 5MB
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description (Optional)
                        </label>
                        <textarea
                          value={doc.description}
                          onChange={(e) => handleDocumentChange(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Add any additional notes about this document..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Document Button */}
                <button
                  type="button"
                  onClick={addDocumentField}
                  className="flex items-center gap-3 px-6 py-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border-2 border-dashed border-purple-200 transition-all w-full justify-center"
                >
                  <Plus size={20} />
                  <span className="font-medium">Add Another Document</span>
                </button>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-purple-800">Document Requirements</h3>
                  <div className="mt-2 text-sm text-purple-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Upload all required documents for employment verification</li>
                      <li>Accepted formats: PDF, DOC, DOCX, JPG, PNG, WEBP</li>
                      <li>Maximum file size: 5MB per document</li>
                      <li>Ensure documents are clear and readable</li>
                      <li>Documents will be stored securely and can be accessed anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview Modal */}
          {previewDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <iframe
                    src={previewDocument}
                    className="w-full h-96"
                    title="Document Preview"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setPreviewDocument(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading Documents...
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