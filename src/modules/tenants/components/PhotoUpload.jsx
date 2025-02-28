import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export const PhotoUpload = ({ preview, handlePhotoChange, setPreview, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('photo')}
      </label>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={t('tenantPhoto')}
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setFormData(prev => ({ ...prev, photo: null }));
              }}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1
                text-white hover:bg-red-600 focus:outline-none focus:ring-2 
                focus:ring-red-500 focus:ring-offset-2"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div 
              onClick={() => document.getElementById('photo-upload').click()}
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-100 
                flex items-center justify-center hover:bg-gray-200 
                transition-colors duration-200 cursor-pointer group"
            >
              <PhotoIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 
                group-hover:text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('photo-upload').click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-2
                text-white hover:bg-primary-700 focus:outline-none focus:ring-2 
                focus:ring-primary-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          {t('photoUploadHint')}
        </p>
      </div>
    </div>
  );
}; 