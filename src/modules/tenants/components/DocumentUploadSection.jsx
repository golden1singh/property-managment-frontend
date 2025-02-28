import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentIcon, 
  PlusCircleIcon, 
  XCircleIcon,
  DocumentArrowUpIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { SectionHeader } from './SectionHeader';

export const DocumentUploadSection = ({ 
  documents, 
  setDocuments,
  existingDocuments = []
}) => {
  const { t } = useTranslation();
  const [documentType, setDocumentType] = useState('');

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { 
        id: Date.now(), 
        type: '', 
        file: null, 
        name: '' 
      }
    ]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDocumentChange = (id, field, value) => {
    setDocuments(documents.map(doc => {
      if (doc.id === id) {
        if (field === 'file') {
          // When handling file upload, also update the name
          return {
            ...doc,
            [field]: value,
            name: value.name // Add the file name automatically
          };
        }
        return { ...doc, [field]: value };
      }
      return doc;
    }));
  };

  // Debug log to check documents state
  console.log('Current documents:', documents);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <SectionHeader 
          icon={<DocumentIcon className="h-6 w-6 text-primary-500" />}
          title={t('documents')}
        />

        {/* Existing Documents */}
        {existingDocuments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              {t('existingDocuments')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Documents */}
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div 
              key={doc.id}
              className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                {/* <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('documentType')}
                  </label>
                  <input
                    type="text"
                    value={doc.type}
                    onChange={(e) => handleDocumentChange(doc.id, 'type', e.target.value)}
                    placeholder={t('enterDocumentType')}
                    className="block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div> */}
                
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('document')}
                  </label>
                  <div className="flex items-center">
                    <label className="relative flex-1">
                      <span className="sr-only">{t('chooseFile')}</span>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleDocumentChange(doc.id, 'file', file);
                          }
                        }}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100
                          cursor-pointer"
                      />
                      {doc.name && (
                        <span className="mt-1 text-xs text-gray-500">
                          {doc.name}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                  >
                    <XCircleIcon className="h-5 w-5 mr-1" />
                    {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddDocument}
            className="inline-flex items-center px-4 py-2 border border-gray-300 
              rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-primary-500"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
            {t('addDocument')}
          </button>
        </div>
      </div>
    </div>
  );
}; 