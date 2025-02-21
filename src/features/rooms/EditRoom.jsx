import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../utils/axios';
import {
  PhotoIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const EditRoom = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [plotsData, setPlotsData] = useState([]);
  const [formData, setFormData] = useState({
    plotNumber: '',
    roomNumber: '',
    floor: '',
    type: 'single',
    rent: '',
    securityDeposit: '',
    area: '',
    furnishingStatus: 'unfurnished',
    amenities: [],
    description: '',
    status: 'available'
  });

  const amenitiesOptions = [
    'fan', 'bathroom', 'balcony', 'kitchen', 'water', 'tap', 'kitchen_sink', 'mirror_window'
  ];

  // Fetch plots and room data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const [plotsResponse, roomResponse] = await Promise.all([
          axiosInstance.get('/api/plots'),
          axiosInstance.get(`/api/rooms/${id}`)
        ]);
        
        setPlotsData(plotsResponse.data);
        const room = roomResponse.data;
        
        setFormData({
          plotNumber: room.plotNumber,
          roomNumber: room.roomNumber,
          floor: room.floor,
          type: room.type,
          rent: room.rent,
          securityDeposit: room.securityDeposit,
          area: room.area,
          furnishingStatus: room.furnishingStatus,
          amenities: room.amenities,
          description: room.description,
          status: room.status
        });

        setExistingImages(room.images || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const renderDropdown = (name, label, options) => (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 
            text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 
            shadow-sm transition-colors duration-200 hover:border-gray-400 sm:text-sm appearance-none"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add new images to FormData
      images.forEach(img => {
        formDataToSend.append('images', img.file);
      });

      // Add existing images to keep
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      // Send request to update room
      await axiosInstance.patch(`/api/rooms/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t('roomUpdatedSuccess'));
      navigate(`/rooms/${id}`);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error(error.response?.data?.error || t('errorUpdatingRoom'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return filtered;
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/rooms/${id}`)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            {t('backToRoom')}
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{t('editRoom')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Plot Selection */}
            {renderDropdown(
              "plotNumber",
              t('plotNumber'),
              <>
                <option value="">{t('selectPlot')}</option>
                {plotsData.map(plot => (
                  <option key={plot._id} value={plot.plotNumber}>
                    {t('plotWithRooms', {
                      number: plot.plotNumber,
                      available: plot.totalRooms - plot.occupiedRooms,
                      total: plot.totalRooms
                    })}
                  </option>
                ))}
              </>
            )}

            {/* Room Details */}
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
              </>
            )}

            {/* Pricing */}
            {renderTextInput("rent", t('monthlyRent'), "number", "₹")}
            {renderTextInput("securityDeposit", t('securityDeposit'), "number", "₹")}
            {renderTextInput("area", t('area'), "number")}

            {/* Furnishing Status */}
            {renderDropdown(
              "furnishingStatus",
              t('furnishingStatus'),
              <>
                <option value="unfurnished">{t('furnishing.unfurnished')}</option>
                <option value="semi-furnished">{t('furnishing.semiFurnished')}</option>
                <option value="fully-furnished">{t('furnishing.fullyFurnished')}</option>
              </>
            )}

            {/* Room Status */}
            {renderDropdown(
              "status",
              t('status'),
              <>
                <option value="available">{t('roomStatus.available')}</option>
                <option value="occupied">{t('roomStatus.occupied')}</option>
                <option value="maintenance">{t('roomStatus.maintenance')}</option>
              </>
            )}

            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('description')}
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 
                    focus:border-primary-500 focus:outline-none focus:ring-primary-500 
                    shadow-sm transition-colors duration-200
                    hover:border-gray-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('amenities')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesOptions.map(amenity => (
                  <div key={amenity} className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 
                          focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={amenity} className="font-medium text-gray-700">
                        {t(`amenities.${amenity}`)}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">{t('existingImages')}</h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt=""
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 inline-flex items-center p-1 
                        border border-transparent rounded-full shadow-sm text-white 
                        bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              {t('addNewImages')}
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 
              border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md bg-white font-medium 
                      text-primary-600 focus-within:outline-none focus-within:ring-2 
                      focus-within:ring-primary-500 focus-within:ring-offset-2 
                      hover:text-primary-500"
                  >
                    <span>{t('uploadImages')}</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* New Image Previews */}
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
                    className="absolute -top-2 -right-2 inline-flex items-center p-1 
                      border border-transparent rounded-full shadow-sm text-white 
                      bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/rooms/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm 
                font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
                font-medium text-white bg-primary-600 hover:bg-primary-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;