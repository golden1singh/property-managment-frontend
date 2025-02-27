import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  BanknotesIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axios';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { useFormValidation } from './hooks/useFormValidation';
import { initialFormData } from './utils/initialData';
import { FormInput } from './components/FormInput';
import { SectionHeader } from './components/SectionHeader';
import { SelectInput } from './components/SelectInput';

// Add this constant for ID proof types
const ID_PROOF_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter', label: 'Voter ID' }
];

const AddTenant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const { errors, touched, handleBlur, validateForm } = useFormValidation(initialFormData);

  console.log({errors})
  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/api/rooms?status=available');
        console.log('Fetched rooms:', response.data);
        console.log('Room data type:', typeof response.data);
        console.log('Is array?', Array.isArray(response.data));
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error(t('errorFetchingRooms'));
      }
    };
    fetchRooms();
  }, [t]);

  // Fetch plots when component mounts
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/api/plots');
        setPlots(response.data);
      } catch (error) {
        console.error('Error fetching plots:', error);
        toast.error(t('errorFetchingPlots'));
      }
    };
    fetchPlots();
  }, [t]);

  // Fetch rooms when plot is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedPlot) {
        setRooms([]);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/plots/${selectedPlot}/rooms?status=available`);
        console.log('API Response:', response.data); // Debug log
        
        // Ensure we're setting an array of rooms
        const roomsData = Array.isArray(response.data) ? response.data : [];
        
        // Validate and transform room data
        const validRooms = roomsData.map(room => ({
          _id: room._id || '',
          roomNumber: String(room.roomNumber || ''),
          floor: String(room.floor || ''),
          rent: String(room.rent || ''),
          securityDeposit: String(room.securityDeposit || '')
        }));
        
        setRooms(validRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error(t('errorFetchingRooms'));
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [selectedPlot, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    if (!validateForm(formData)) return;

    setLoading(true);
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Add all text fields and format dates
      Object.keys(formData).forEach(key => {
        if (key === 'leaseStartDate' || key === 'leaseEndDate') {
          const dateValue = formData[key] ? 
            new Date(formData[key]).toISOString().split('T')[0] : null;
          formDataToSend.append(key, dateValue);
        } else if (key !== 'photo' && key !== 'documents') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add photo if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      // Add documents if exist
      documents.forEach(doc => {
        formDataToSend.append('documents', doc.file);
      });

      // Send request
      const response = await axiosInstance.post('/api/tenants', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t('tenantAddedSuccess'));
      console.log({response})
      navigate(`/tenants/${response.data._id}`);
    } catch (error) {
      console.error('Error adding tenant:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(t('errorAddingTenant', { error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handlePlotChange = (e) => {
    const plotNumber = e.target.value;
    setSelectedPlot(plotNumber);
    setFormData(prev => ({
      ...prev,
      plotNumber,
      roomNumber: '' // Reset room when plot changes
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      toast.error(t('invalidFileType'));
      return;
    }

    // Validate file size (5MB limit)
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error(t('fileTooLarge'));
      return;
    }

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  console.log({rooms})
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="mb-6 sm:mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('addTenantTitle')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t('addTenantSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <PersonalInfoSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            handlePhotoChange={handlePhotoChange}
            errors={errors}
            touched={touched}
            preview={preview}
            setPreview={setPreview}
            setFormData={setFormData}
          />

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<PhoneIcon className="h-6 w-6 text-primary-500" />}
                title={t('emergencyContact')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <FormInput
                  name="emergencyContact"
                  label={t('emergencyContactName')}
                  type="text"
                  icon={<UserIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  name="emergencyPhone"
                  label={t('emergencyPhone')}
                  type="tel"
                  icon={<PhoneIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  name="emergencyRelation"
                  label={t('relation')}
                  type="text"
                  icon={<UserIcon />}
                  required={false}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<BuildingOfficeIcon className="h-6 w-6 text-primary-500" />}
                title={t('employmentDetails')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <FormInput
                  name="occupation"
                  label={t('occupation')}
                  type="text"
                  icon={<BuildingOfficeIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  name="employer"
                  label={t('employer')}
                  type="text"
                  icon={<BuildingOfficeIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  name="monthlyIncome"
                  label={t('monthlyIncome')}
                  type="number"
                  icon={<BanknotesIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  required={false}
                />
              </div>
            </div>
          </div>

          {/* Room & Lease Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<HomeIcon className="h-6 w-6 text-primary-500" />}
                title={t('roomAndLeaseDetails')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <SelectInput
                  name="plotNumber"
                  label={t('selectPlot')}
                  icon={<HomeIcon />}
                  options={plots.map(plot => ({
                    value: plot.id,
                    label: `${t('plot')} ${plot.plotNumber} - ${plot.address}`
                  }))}
                  formData={formData}
                  handleInputChange={handlePlotChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  placeholder={t('selectPlot')}
                />
                
                <SelectInput
                  name="roomNumber"
                  label={t('selectRoom')}
                  icon={<HomeIcon />}
                  options={rooms.map(room => ({
                    value: room.roomNumber,
                    label: `${t('room')} ${room.roomNumber} - ${room.type} (₹${room.rent}/month)`
                  }))}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  placeholder={t('selectRoom')}
                  disabled={!selectedPlot}
                  selectedPlot={selectedPlot}
                  helperText={!selectedPlot ? t('selectPlotFirst') : ''}
                />

                <FormInput
                  name="rentAmount"
                  label={t('rentAmount')}
                  type="number"
                  icon={<BanknotesIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                
                <FormInput
                  name="depositAmount"
                  label={t('depositAmount')}
                  type="number"
                  icon={<BanknotesIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  name="leaseStartDate"
                  label={t('leaseStartDate')}
                  type="date"
                  icon={<CalendarIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                 <FormInput
                  name="leaseEndDate"
                  label={t('leaseEndDate')}
                  type="date"
                  icon={<CalendarIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </div>

          {/* ID Proof Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<IdentificationIcon className="h-6 w-6 text-primary-500" />}
                title={t('idProofDetails')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <SelectInput
                  name="idProofType"
                  label={t('idProofType')}
                  icon={<IdentificationIcon />}
                  options={ID_PROOF_TYPES.map(type => ({
                    value: type.value,
                    label: t(`idTypes.${type.value}`)
                  }))}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  placeholder={t('selectIdProofType')}
                />
                
                <FormInput
                  name="idProofNumber"
                  label={t('idProofNumber')}
                  type="text"
                  icon={<IdentificationIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  placeholder={t('enterIdProofNumber')}
                />

               
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto 
            bg-white sm:bg-transparent border-t border-gray-200 sm:border-none 
            p-4 sm:p-0 z-10">
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 
              max-w-7xl mx-auto">
              <button
                type="button"
                onClick={() => navigate('/tenants')}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 
                  rounded-lg text-sm font-medium text-gray-700 bg-white 
                  hover:bg-gray-50 hover:border-gray-400 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                  transition-all duration-200 shadow-sm order-2 sm:order-1"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 
                  text-white rounded-lg text-sm font-medium hover:bg-primary-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500 transition-all duration-200
                  shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent 
                      rounded-full animate-spin mr-2" />
                    {t('saving')}
                  </>
                ) : (
                  t('addTenant')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenant; 