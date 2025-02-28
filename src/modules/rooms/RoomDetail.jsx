import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  UserIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axios';
import { useSelector } from 'react-redux';

const RoomDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const plots = useSelector(state => state.plots.plots)
  console.log({plots})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/rooms/${id}`);
      setRoom(response.data);
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {t('errorFetchingRoom')}: {error}
      </div>
    );
  }

  if (!room) return null;

  const renderInfoSection = (icon, title, value) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="mt-1 text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back and Edit buttons */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            {t('backToRooms')}
          </button>

          <button
            onClick={() => navigate(`/rooms/edit/${id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 
              hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-primary-500 transition-colors duration-200"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
            {t('editRoom')}
          </button>
        </div>

        {/* Room Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {t('roomNumber')} {room.roomNumber}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('plotNumber')} {plots?.find(p => p.id === room.plotNumber)?.plotNumber}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${room.status === 'available' ? 'bg-green-100 text-green-800' :
                room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'}`}>
              {t(`roomStatus.${room.status}`)}
            </span>
          </div>

          {/* Room Images */}
          {room.images && room.images.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.images.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={`Room ${room.roomNumber}`}
                    className="h-48 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Room Details */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderInfoSection(
                <HomeIcon className="h-5 w-5 text-gray-400" />,
                t('roomType'),
                t(`roomTypes.${room.type}`)
              )}
              {renderInfoSection(
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />,
                t('monthlyRent'),
                `₹${room.rent.toLocaleString()}/month`
              )}
              {renderInfoSection(
                <KeyIcon className="h-5 w-5 text-gray-400" />,
                t('securityDeposit'),
                `₹${room.securityDeposit.toLocaleString()}`
              )}
              {renderInfoSection(
                <HomeIcon className="h-5 w-5 text-gray-400" />,
                t('furnishingStatus'),
                t(`furnishing.${room.furnishingStatus}`)
              )}
              {renderInfoSection(
                <HomeIcon className="h-5 w-5 text-gray-400" />,
                t('area'),
                `${room.area} sq ft`
              )}
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">{t('amenitiesList.title')}</h4>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {room.amenities.map(amenity => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {t(`amenitiesList.${amenity}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">{t('description')}</h4>
                <p className="mt-2 text-sm text-gray-900">{room.description}</p>
              </div>
            )}
          </div>

          {/* Current Tenant Section */}
          {room.currentTenant && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{t('currentTenant')}</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderInfoSection(
                  <UserIcon className="h-5 w-5 text-gray-400" />,
                  t('tenantName'),
                  room.currentTenant.firstName + " " + room.currentTenant.lastName
                )}
                {renderInfoSection(
                  <PhoneIcon className="h-5 w-5 text-gray-400" />,
                  t('phone'),
                  room.currentTenant.phone
                )}
                {renderInfoSection(
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />,
                  t('email'),
                  room.currentTenant.email
                )}
                {renderInfoSection(
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />,
                  t('leaseStartDate'),
                  new Date(room.currentTenant.moveInDate).toLocaleDateString()
                )}
                {renderInfoSection(
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />,
                  t('leaseEndDate'),
                  new Date(room.currentTenant.leaseEnd).toLocaleDateString()
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail; 