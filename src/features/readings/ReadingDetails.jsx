import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  BoltIcon,
  BeakerIcon,
  FireIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const ReadingDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, tenantId, roomId, paymentData } = location.state;
  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchReadingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/utility-bills/${id}`);
        setReading(response.data);
      } catch (error) {
        console.error('Error fetching reading details:', error);
        toast.error(t('errors.fetchReadingDetails'));
      } finally {
        setLoading(false);
      }
    };

    fetchReadingDetails();
  }, [id, t]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'electricity':
        return <BoltIcon className="h-6 w-6 text-yellow-500" />;
      case 'water':
        return <BeakerIcon className="h-6 w-6 text-blue-500" />;
      case 'gas':
        return <FireIcon className="h-6 w-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleMarkAsPaid = async () => {
    setProcessingPayment(true);
    try {
      await axiosInstance.patch(`/api/utility-bills/${id}/mark-paid`);
      toast.success(t('readings.paymentSuccess'));
      setReading(prev => ({ ...prev, status: 'paid' }));
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error(t('errors.markAsPaid'));
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/readings')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('readings.billDetails')}
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(reading.billType)}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t(`readings.types.${reading.billType}`)}
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      <span>
                        {t('readings.plotRoom', {
                          plot: reading.plotNumber,
                          room: reading.roomNumber
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${reading.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {reading.status === 'paid' ? (
                    <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                  ) : (
                    <ClockIcon className="h-5 w-5 mr-1.5" />
                  )}
                  {t(`readings.status.${reading.status}`)}
                </span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('readings.readingDetails')}
              </h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.billDate')}
                  </dt>
                  <dd className="mt-1 flex items-center text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    {new Date(reading.billDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.previousReading')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {reading.previousReading} {t('readings.units')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.currentReading')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {reading.currentReading} {t('readings.units')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.unitsConsumed')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {reading.currentReading - reading.previousReading} {t('readings.units')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Amount Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('readings.paymentDetails')}
              </h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.ratePerUnit')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ₹{reading.ratePerUnit}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.additionalCharges')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ₹{reading.additionalCharges || 0}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('readings.totalAmount')}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-primary-600">
                    ₹{reading.totalAmount}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tenant Details Card */}
          {reading.tenant && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex items-center space-x-3 mb-4">
                  <UserCircleIcon className="h-6 w-6 text-primary-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('readings.tenantDetails')}
                  </h3>
                </div>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('readings.tenantName')}
                    </dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <UserCircleIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                      {`${reading.tenant.firstName} ${reading.tenant.lastName}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('readings.tenantPhone')}
                    </dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                      <a 
                        href={`tel:${reading.tenant.phone}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {reading.tenant.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      {t('readings.tenantEmail')}
                    </dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <EnvelopeIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                      <a 
                        href={`mailto:${reading.tenant.email}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {reading.tenant.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            {reading.tenant && reading.status !== 'paid' && (
              <button
                onClick={() => {/* Add send reminder logic */}}
                className="inline-flex items-center px-4 py-2 border border-gray-300 
                  rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white 
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                {t('readings.sendReminder')}
              </button>
            )}
            
            {reading.status !== 'paid' && (
              <button
                onClick={handleMarkAsPaid}
                disabled={processingPayment}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                  rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 
                  hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t('readings.processing')}
                  </>
                ) : (
                  <>
                    <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                    {t('readings.markAsPaid')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingDetails; 