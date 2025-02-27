import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../utils/axios'
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AddRoom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [plotsData, setPlotsData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [formData, setFormData] = useState({
    plotNumber: '',
    roomNumber: '',
    floor: '',
    type: 'single', // single, double, suite
    rent: '',
    securityDeposit: '',
    area: '',
    furnishingStatus: 'unfurnished', // unfurnished, semi-furnished, fully-furnished
    amenities: [],
    description: '',
    status: 'available', // available, occupied, maintenance
    plotId: ''
  });

  const amenitiesOptions = [
   'fan', 'bathroom', 'balcony', 'kitchen',  'water','tap','kitchen_sink','mirror_window'
  ];
  console.log(plotsData,formData?.plotNumber,formData?.plotId)

  // Fetch plots on component mount
  const fetchPlots = async () => {
    try {
      const response = await axiosInstance.get('/api/plots');
      setPlotsData(response.data);
    } catch (error) {
      console.error('Error fetching plots:', error);
      setFetchError(error.message);
    }
  };
  useEffect(() => {


    fetchPlots();
  }, []);

  // Clean up image previews on component unmount
  useEffect(() => {
    return () => {
      images.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Update amenity toggle handler
const handleAmenityToggle = (amenity) => {
  setFormData(prev => ({
    ...prev,
    amenities: prev.amenities.includes(amenity)
      ? prev.amenities.filter(a => a !== amenity)
      : [...prev.amenities, amenity]
  }));
};

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Revoke the URL to prevent memory leaks
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return filtered;
    });
  };

  const handlePlotChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const plotId = selectedOption.getAttribute('data-plot-id');
    
    setFormData(prev => ({
      ...prev,
      plotNumber: e.target.value,
      // plotId: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          // Send amenities as a JSON string array
          formDataToSend.append('amenities', JSON.stringify(formData.amenities));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // Add images to FormData
      images.forEach(img => {
        formDataToSend.append('images', img.file);
      });
  
      // Send request to create room
      const response = await axiosInstance.post('/api/rooms', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

  navigate('/rooms');
      toast.success(t('roomAddedSuccess'));
    } catch (error) {
      console.error('Error adding room:', error);
      const errorMessage = error.response?.data?.error || error.message || t('errorAddingRoom');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (name, label, options, value) => (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm appearance-none"
        >
          {options}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );

  const renderTextInput = (name, label, type = "text", prefix = null) => (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          required
          value={formData[name]}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border border-gray-300 py-2 
            ${prefix ? 'pl-7' : 'pl-3'} pr-3 
            text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 
            shadow-sm transition-colors duration-200
            hover:border-gray-400 sm:text-sm`}
        />
      </div>
    </div>
  );

  const renderTextArea = (name, label, rows = 4) => (
    <div className="col-span-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={formData[name]}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 
            text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 
            shadow-sm transition-colors duration-200
            hover:border-gray-400 sm:text-sm resize-none"
        />
      </div>
    </div>
  );

  if (fetchError) {
    return (
      <div className="py-6 text-center text-red-600">
        {t('errorFetchingPlots')}: {fetchError}
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t('addRoomTitle')}</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* Plot and Basic Information */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('roomBasicInfo')}
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Plot Selection */}
                {renderDropdown(
                  "plotNumber",
                  t('plotNumber'),
                  <>
                    <option value="">{t('selectPlot')}</option>
                    {plotsData?.map(plot => (
                      <option 
                        key={plot.id} 
                        value={plot.id}
                        data-plot-id={plot.id}
                      >
                        {`Plot ${plot.plotNumber} (${plot.totalRooms - plot.occupiedRooms}/${plot.totalRooms} rooms)`}
                      </option>
                    ))}
                  </>,
                  formData.plotNumber
                )}

                {/* Basic Information */}
                {renderTextInput("roomNumber", t('roomNumber'))}
                {renderTextInput("floor", t('floor'), "number")}

                {/* Room Type */}
                {renderDropdown(
                  "type",
                  t('roomType'),
                  <>
                    <option value="single">{t('roomTypes.single')}</option>
                    <option value="double">{t('roomTypes.double')}</option>
                    <option value="suite">{t('roomTypes.suite')}</option>
                  </>,
                  formData.type
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('roomPricing')}
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Pricing */}
                {renderTextInput("rent", t('monthlyRent'), "number", "₹")}
                {renderTextInput("securityDeposit", t('securityDeposit'), "number", "₹")}
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('roomDetails')}
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Room Details */}
                {renderTextInput("area", t('area'), "number")}

                {/* Furnishing Status */}
                {renderDropdown(
                  "furnishingStatus",
                  t('furnishingStatus'),
                  <>
                    <option value="unfurnished">{t('furnishing.unfurnished')}</option>
                    <option value="semi-furnished">{t('furnishing.semiFurnished')}</option>
                    <option value="fully-furnished">{t('furnishing.fullyFurnished')}</option>
                  </>,
                  formData.furnishingStatus
                )}

                {/* Room Status */}
                {renderDropdown(
                  "status",
                  t('status'),
                  <>
                    <option value="available">{t('roomStatus.available')}</option>
                    <option value="occupied">{t('roomStatus.occupied')}</option>
                    <option value="maintenance">{t('roomStatus.maintenance')}</option>
                  </>,
                  formData.status
                )}
              </div>

             {/* Amenities */}
<div className="mt-6">
  <label className="text-sm font-medium text-gray-700">
    {t('amenities')}
  </label>
  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    {amenitiesOptions.map(amenity => (
      <div key={amenity} className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            checked={formData.amenities.includes(amenity)}
            onChange={() => handleAmenityToggle(amenity)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">
            {t(`amenities.${amenity}`)}
          </label>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Description */}
              {renderTextArea("description", t('description'))}
            </div>
          </div>

          {/* Room Images */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('roomImages')}
              </h3>
              <div className="mt-6">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                      >
                        <span>{t('uploadImages')}</span>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">{t('dragAndDrop')}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t('allowedImageTypes')}</p>
                  </div>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map(image => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.preview}
                          alt=""
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t('saving') : t('saveRoom')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom; 