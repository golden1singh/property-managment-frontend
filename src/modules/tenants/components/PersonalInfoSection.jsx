import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { FormInput } from './FormInput';
import { SectionHeader } from './SectionHeader';
import { PhotoUpload } from './PhotoUpload';

export const PersonalInfoSection = ({ formData, handleInputChange, handleBlur, errors, touched, preview, handlePhotoChange, setPreview, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <SectionHeader icon={<UserIcon />} title={t('personalInformation')} />
        
        {/* Photo Upload */}
        <PhotoUpload 
          preview={preview} 
          handlePhotoChange={handlePhotoChange}
          setPreview={setPreview}
          setFormData={setFormData}
        />

        {/* Personal Information Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
          <FormInput
            name="firstName"
            label={t('firstName')}
            type="text"
            icon={<UserIcon />}
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <FormInput
            name="lastName"
            label={t('lastName')}
            type="text"
            icon={<UserIcon />}
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <FormInput
            name="email"
            label={t('email')}
            type="email"
            icon={<EnvelopeIcon />}
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <FormInput
            name="phone"
            label={t('phone')}
            type="tel"
            icon={<PhoneIcon />}
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            placeholder="1234567890"
          />
        </div>
      </div>
    </div>
  );
}; 