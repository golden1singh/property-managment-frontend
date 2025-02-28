import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import axiosInstance from '../../utils/axios'
import { FormInput } from './components/FormInput'
import { SelectInput } from './components/SelectInput'
import { SectionHeader } from './components/SectionHeader'
import { PhotoUpload } from './components/PhotoUpload'
import { useFormValidation } from './hooks/useFormValidation'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  BanknotesIcon,
  CalendarIcon,
  HomeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { DocumentUploadSection } from './components/DocumentUploadSection'

// Add ID proof types constant
const ID_PROOF_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter', label: 'Voter ID' }
]

const EditTenant = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [plots, setPlots] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedPlot, setSelectedPlot] = useState('')
  const [documents, setDocuments] = useState([])
  const [existingDocuments, setExistingDocuments] = useState([])

  // Initial form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    occupation: '',
    employer: '',
    monthlyIncome: '',
    // currentAddress: '',
    // permanentAddress: '',
    photo: null,
    idProofType: '',
    idProofNumber: '',
    idProofExpiryDate: '',
    plotNumber: '',
    roomNumber: '',
    rentAmount: '',
    depositAmount : '',
    // leaseStartDate: '',
    leaseEndDate: ''
  })

  const { errors, touched, handleBlur, validateForm } = useFormValidation(formData)

  // Fetch plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/api/plots')
        setPlots(response.data)
      } catch (error) {
        console.error('Error fetching plots:', error)
        toast.error(t('errorFetchingPlots'))
      }
    }
    fetchPlots()
  }, [t])

  // Fetch rooms when plot is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedPlot) {
        setRooms([])
        return
      }
      try {
        const response = await axiosInstance.get(`/api/plots/${selectedPlot}/rooms`)
        setRooms(response.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
        toast.error(t('errorFetchingRooms'))
      }
    }
    fetchRooms()
  }, [selectedPlot, t])

  console.log({documents})

  // Fetch tenant data
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await axiosInstance.get(`/api/tenants/${id}`)
        const tenant = response.data
        
        setFormData({
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email,
          phone: tenant.phone,
          emergencyContact: tenant.emergencyContact,
          emergencyPhone: tenant.emergencyPhone,
          occupation: tenant.occupation,
          employer: tenant.employer,
          monthlyIncome: tenant.monthlyIncome,
          // currentAddress: tenant.currentAddress,
          // permanentAddress: tenant.permanentAddress,
          photo: tenant.photo,
          idProofType: tenant.idProofType,
          idProofNumber: tenant.idProofNumber,
          plotNumber: tenant.plotNumber,
          roomNumber: tenant.roomNumber,
          rentAmount: tenant.rentAmount,
          depositAmount: tenant.depositAmount,
          // leaseStartDate: tenant.leaseStartDate,
          leaseEndDate: tenant.leaseEndDate
        })

        // Set existing documents
        if (tenant.documents) {
          setExistingDocuments(tenant.documents)
        }

        setSelectedPlot(tenant.plotNumber)
        if (tenant.photo) {
          setPreview(tenant.photo?.url)
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error)
        toast.error(t('errorFetchingTenant'))
      }
    }

    fetchTenantData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlotChange = (e) => {
    const plotNumber = e.target.value
    setSelectedPlot(plotNumber)
    setFormData(prev => ({
      ...prev,
      plotNumber,
      roomNumber: ''
    }))
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.error(t('pleaseFixErrors'));
      return;
    }
  
    setLoading(true);
    try {
      const formDataToSend = new FormData();
  
      // Add basic form fields
      const basicFields = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        occupation: formData.occupation,
        employer: formData.employer,
        monthlyIncome: formData.monthlyIncome,
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,
        plotNumber: formData.plotNumber,
        roomNumber: formData.roomNumber,
        rentAmount: formData.rentAmount,
        depositAmount: formData.depositAmount
      };
  
      // Append basic fields
      Object.keys(basicFields).forEach(key => {
        if (basicFields[key] !== null && basicFields[key] !== undefined) {
          formDataToSend.append(key, basicFields[key]);
        }
      });
  
      // Handle photo
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }
  
      // Handle existing documents
      if (existingDocuments?.length > 0) {
        formDataToSend.append('existingDocuments', JSON.stringify(existingDocuments));
      }
  
      // Handle new documents
      if (documents.length > 0) {
        documents.forEach((doc, index) => {
          formDataToSend.append('documents', doc.file);
          formDataToSend.append(`documentTypes`, doc.type);
          formDataToSend.append(`documentNames`, doc.name);
        });
      }
  
      // Debug logs
      console.log('Form Data being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await axiosInstance.put(
        `/api/tenants/${id}`, 
        formDataToSend,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data) {
        toast.success(t('tenantUpdated'));
        navigate(`/tenants/${id}`);
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error(error.response?.data?.error || t('errorUpdatingTenant'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate(`/tenants/${id}`)}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('editTenant')}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<UserIcon className="h-6 w-6 text-primary-500" />}
                title={t('personalInformation')}
              />
              
              <PhotoUpload 
                preview={preview}
                handlePhotoChange={handlePhotoChange}
                setPreview={setPreview}
                setFormData={setFormData}
                existingPhoto={formData.photo}
              />

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <FormInput
                  name="firstName"
                  label={t('firstName')}
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
                  icon={<PhoneIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<UserIcon className="h-6 w-6 text-primary-500" />}
                title={t('emergencyContact')}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <FormInput
                  name="emergencyContact"
                  label={t('emergencyContact')}
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
                  icon={<PhoneIcon />}
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
                  icon={<IdentificationIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                
               
              </div>
            </div>
          </div>

          {/* Room & Lease Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <SectionHeader 
                icon={<HomeIcon className="h-6 w-6 text-primary-500" />}
                title={t('roomInformation')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-6">
                <SelectInput
                  name="plotNumber"
                  label={t('plotNumber')}
                  icon={<HomeIcon />}
                  options={plots.map(plot => ({
                    value: plot.plotNumber,
                    label: plot.plotNumber
                  }))}
                  formData={formData}
                  handleInputChange={handlePlotChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  placeholder={t('selectPlot')}
                />
                
                <FormInput
                  name="roomNumber"
                  label={t('roomNumber')}
                  icon={<HomeIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                
                <FormInput
                  name="rentAmount"
                  label={t('monthlyRent')}
                  icon={<BanknotesIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
                
                <FormInput
                  name="depositAmount"
                  label={t('securityDeposit')}
                  icon={<BanknotesIcon />}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </div>

          {/* Add Document Upload Section before form actions */}
          <DocumentUploadSection
            documents={documents}
            setDocuments={setDocuments}
            existingDocuments={existingDocuments}
          />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/tenants/${id}`)}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 
                rounded-lg text-sm font-medium text-gray-700 bg-white 
                hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 
                text-white rounded-lg text-sm font-medium hover:bg-primary-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-500 disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent 
                    rounded-full animate-spin mr-2" />
                  {t('saving')}
                </>
              ) : (
                t('saveTenant')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTenant 