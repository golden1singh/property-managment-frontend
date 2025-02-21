import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../utils/axios'
import { toast } from 'react-toastify'
import {
  CameraIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CalculatorIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

const SelectField = ({ label, value, onChange, name, options, required, placeholder, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      id={name}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 pl-3 pr-10 
        text-gray-900 shadow-sm transition-colors duration-200 ease-in-out
        focus:border-primary-500 focus:bg-white focus:ring-primary-500 
        hover:bg-gray-50 sm:text-sm
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <option value="" disabled selected>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, name, required, placeholder, prefix, min }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative rounded-lg shadow-sm">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        min={min}
        placeholder={placeholder}
        className={`block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm 
          transition-colors duration-200 ease-in-out
          focus:border-primary-500 focus:bg-white focus:ring-primary-500 
          hover:bg-gray-50 sm:text-sm
          ${prefix ? 'pl-7' : 'pl-3'} py-2.5`}
      />
    </div>
  </div>
);

const TextAreaField = ({ label, value, onChange, name, required, placeholder, rows = 4 }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm 
        transition-colors duration-200 ease-in-out
        focus:border-primary-500 focus:bg-white focus:ring-primary-500 
        hover:bg-gray-50 sm:text-sm py-2.5 px-3"
    />
  </div>
);

const AddReading = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [readingImage, setReadingImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [plots, setPlots] = useState([])
  const [rooms, setRooms] = useState([])

  const [formData, setFormData] = useState({
    plotNumber: '',
    roomNumber: '',
    billType: 'electricity',
    billDate: new Date().toISOString().split('T')[0],
    previousReading: '',
    currentReading: '',
    ratePerUnit: '',
    additionalCharges: '',
    notes: ''
  })

  // Fetch plots
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/api/plots')
        setPlots(response.data)
      } catch (error) {
        console.error('Error fetching plots:', error)
        toast.error(t('errors.fetchPlots'))
      }
    }
    fetchPlots()
  }, [t])

  // Fetch rooms when plot is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!formData.plotNumber) {
        setRooms([])
        return
      }
      try {
        const response = await axiosInstance.get(`/api/plots/${formData.plotNumber}/rooms`)
        setRooms(response.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
        toast.error(t('errors.fetchRooms'))
      }
    }
    fetchRooms()
  }, [formData.plotNumber, t])

  // Fetch previous reading
  useEffect(() => {
    const fetchPreviousReading = async () => {
      if (formData.plotNumber && formData.roomNumber && formData.billType) {
        try {
          const response = await axiosInstance.get('/api/utility-bills/latest', {
            params: {
              plotNumber: formData.plotNumber,
              roomNumber: formData.roomNumber,
              billType: formData.billType
            }
          });
          setFormData(prev => ({
            ...prev,
            previousReading: response.data.reading
          }));
        } catch (error) {
          console.error('Error fetching previous reading:', error);
          toast.error(t('errors.fetchPreviousReading'));
        }
      }
    };
    fetchPreviousReading();
  }, [formData.plotNumber, formData.roomNumber, formData.billType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset room and previous reading when plot changes
      ...(name === 'plotNumber' && {
        roomNumber: '',
        previousReading: ''
      }),
      // Reset previous reading when room or bill type changes
      ...((name === 'roomNumber' || name === 'billType') && {
        previousReading: ''
      })
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(t('errors.fileTooLarge'))
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error(t('errors.invalidFileType'))
        return
      }
      setReadingImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.plotNumber || !formData.roomNumber || !formData.billType) {
        toast.error(t('errors.requiredFields'));
        setLoading(false);
        return;
      }

      // Validate readings and rate
      if (isNaN(formData.previousReading) || 
          isNaN(formData.currentReading) || 
          isNaN(formData.ratePerUnit)) {
        toast.error(t('errors.invalidNumbers'));
        setLoading(false);
        return;
      }

      // Ensure readings make sense
      if (parseFloat(formData.currentReading) <= parseFloat(formData.previousReading)) {
        toast.error(t('errors.invalidReadings'));
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        previousReading: parseFloat(formData.previousReading),
        currentReading: parseFloat(formData.currentReading),
        ratePerUnit: parseFloat(formData.ratePerUnit),
        additionalCharges: formData.additionalCharges ? parseFloat(formData.additionalCharges) : 0
      };

      const response = await axiosInstance.post('/api/utility-bills', payload);

      if (response.data) {
        toast.success(t('utilityBills.saveSuccess'));
        navigate('/readings');
      }
    } catch (error) {
      console.error('Error saving utility bill:', error);
      toast.error(error.response?.data?.error || t('errors.saveUtilityBill'));
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    const units = formData.currentReading - formData.previousReading
    const amount = units * formData.ratePerUnit
    const total = amount + Number(formData.additionalCharges || 0)
    return total.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/readings')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('utilityBills.addBill')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BuildingOfficeIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('utilityBills.locationDetails')}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <SelectField
                  label={t('utilityBills.plotNumber')}
                  name="plotNumber"
                  value={formData.plotNumber}
                  onChange={handleInputChange}
                  required
                  placeholder={t('utilityBills.selectPlot')}
                  options={plots.map(plot => ({
                    value: plot.plotNumber,
                    label: t('utilityBills.plotWithNumber', { number: plot.plotNumber })
                  }))}
                />

                <SelectField
                  label={t('utilityBills.roomNumber')}
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  required
                  placeholder={t('utilityBills.selectRoom')}
                  options={rooms.map(room => ({
                    value: room.roomNumber,
                    label: room.roomNumber
                  }))}
                  disabled={!formData.plotNumber}
                />
              </div>
            </div>
          </div>

          {/* Reading Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CalculatorIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('utilityBills.billDetails')}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <SelectField
                  label={t('utilityBills.billType')}
                  name="billType"
                  value={formData.billType}
                  onChange={handleInputChange}
                  required
                  options={[
                    { value: 'electricity', label: t('utilityBills.types.electricity') },
                    { value: 'water', label: t('utilityBills.types.water') },
                    { value: 'gas', label: t('utilityBills.types.gas') }
                  ]}
                />

                <InputField
                  type="date"
                  label={t('utilityBills.billDate')}
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleInputChange}
                  required
                />

                <InputField
                  type="number"
                  label={t('readings.previousReading')}
                  name="previousReading"
                  value={formData.previousReading}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  min="0"
                />

                <InputField
                  type="number"
                  label={t('readings.currentReading')}
                  name="currentReading"
                  value={formData.currentReading}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  min="0"
                />

                <InputField
                  type="number"
                  label={t('readings.ratePerUnit')}
                  name="ratePerUnit"
                  value={formData.ratePerUnit}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  prefix="₹"
                  min="0"
                />

                <InputField
                  type="number"
                  label={t('readings.additionalCharges')}
                  name="additionalCharges"
                  value={formData.additionalCharges}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  prefix="₹"
                  min="0"
                />
              </div>

              {/* Total Amount Card */}
              {formData.currentReading && formData.previousReading && formData.ratePerUnit && (
                <div className="mt-6 bg-primary-50 border border-primary-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary-700">
                      {t('utilityBills.totalAmount')}
                    </span>
                    <span className="text-lg font-bold text-primary-700">
                      ₹{calculateAmount()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <PhotoIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('readings.meterImage')}
                </h3>
              </div>

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 
                border-dashed rounded-lg hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="space-y-3">
                      <img src={preview} alt="Meter reading" className="mx-auto h-48 w-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setReadingImage(null);
                          setPreview(null);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-red-300 
                          rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {t('readings.removeImage')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="reading-image" 
                          className="relative cursor-pointer rounded-md bg-white font-medium 
                            text-primary-600 hover:text-primary-500 focus-within:outline-none 
                            focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>{t('readings.uploadImage')}</span>
                          <input
                            id="reading-image"
                            name="reading-image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <DocumentTextIcon className="h-6 w-6 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('readings.notes')}
                </h3>
              </div>

              <TextAreaField
                label={t('readings.notes')}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t('readings.notesPlaceholder')}
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 sticky bottom-0 bg-gray-50 p-4 -mx-4 sm:-mx-6 lg:-mx-8">
            <button
              type="button"
              onClick={() => navigate('/utility-bills')}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm 
                font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm 
                font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 
                disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('common.saving')}</span>
                </div>
              ) : (
                t('utilityBills.saveBill')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddReading 