import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, PlusIcon, PhoneIcon, HomeIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const TenantCard = ({ tenant, onView, onRemove }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
      border border-gray-100 overflow-hidden group">
      {/* Card Header with Tenant Photo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white">
              {tenant.firstName} {tenant.lastName}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${tenant.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}`}>
              {tenant.status}
            </span>
          </div>
        </div>
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50">
          {tenant.photo ? (
            <img 
              src={tenant.photo?.url} 
              alt={`${tenant.firstName} ${tenant.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="h-20 w-20 text-primary-300" />
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Contact & Room Info */}
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <PhoneIcon className="h-5 w-5 text-primary-500" />
            <span className="ml-2 text-sm">{tenant.phone}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <HomeIcon className="h-5 w-5 text-primary-500" />
            <span className="ml-2 text-sm">
              Plot {tenant.plotNumber}, Room {tenant.roomNumber}
            </span>
          </div>

          {/* Financial Info */}
          {/* <div className="grid grid-cols-2 gap-4 pt-3">
            {tenant.rentDue && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-medium">{t('rentDue')}</p>
                <p className="text-lg font-semibold text-red-700">
                  ₹{tenant.rentDue.toLocaleString()}
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">{t('monthlyRent')}</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{tenant.rentAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div> */}
           <div className="grid grid-cols-2 gap-4 pt-3">
            {tenant.depositAmount && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-600 font-medium">{t('depositAmount')}</p>
                <p className="text-lg font-semibold text-yellow-700">
                  ₹{tenant.depositAmount}
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">{t('monthlyRent')}</p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{tenant.rentAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          
          {/* Join Date */}
          {tenant.moveInDate
 && (
            <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
              <span>{t('joinDate')}</span>
              <span className="font-medium">
                {new Date(tenant.moveInDate
).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button
            onClick={() => onView(tenant._id)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm 
              font-medium text-primary-600 bg-primary-50 rounded-lg
              hover:bg-primary-100 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {t('viewDetails')}
          </button>
          <button
            onClick={() => onRemove(tenant._id)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm 
              font-medium text-red-600 bg-red-50 rounded-lg
              hover:bg-red-100 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {t('remove')}
          </button>
        </div>
      </div>
    </div>
  );
};

const TenantList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlot, setSelectedPlot] = useState('all');
  const [tenants, setTenants] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tenants and plots
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tenantsResponse, plotsResponse] = await Promise.all([
          selectedPlot === 'all'
            ? axiosInstance.get('/api/tenants')
            : axiosInstance.get(`/api/tenants/plots/${selectedPlot}/tenants`),
          axiosInstance.get('/api/plots')
        ]);

        setTenants(tenantsResponse.data);
        setPlots(plotsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPlot, t]);

  const handleRemoveTenant = async (tenantId) => {
    if (window.confirm(t('confirmRemoveTenant'))) {
      try {
        // Changed from POST to DELETE to match our API
        await axiosInstance.delete(`/api/tenants/${tenantId}`);
        
        // Refresh the tenants list instead of filtering locally
        const response = await axiosInstance.get('/api/tenants');
        setTenants(response.data);
        
        toast.success(t('tenantRemoved'));
      } catch (error) {
        console.error('Error removing tenant:', error);
        // Show the specific error message from backend if available
        const errorMessage = error.response?.data?.error || t('errorRemovingTenant');
        toast.error(errorMessage);
      }
    }
  };

  const formatPlotOption = (plot) => {
    return `Plot ${plot.plotNumber} - ${plot.address || ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {t('tenantListTitle')}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            {/* Plot Filter Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedPlot}
                onChange={(e) => setSelectedPlot(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 
                  focus:outline-none focus:ring-primary-500 focus:border-primary-500 
                  rounded-md bg-white shadow-sm
                  appearance-none cursor-pointer"
              >
                <option value="all">{t('allPlots')}</option>
                {Array.isArray(plots) && plots.map((plot) => (
                  <option 
                    key={plot._id} 
                    value={plot.plotNumber}
                  >
                    {formatPlotOption(plot)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Add Tenant Button */}
            <button
              type="button"
              onClick={() => navigate('/tenants/add')}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 
                border border-transparent rounded-md shadow-sm text-sm font-medium 
                text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {t('addTenant')}
            </button>
          </div>
        </div>

        {/* Tenants Grid */}
        {!Array.isArray(tenants) || tenants.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                {t('noTenantsYet')}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t('noTenantsDescription')}
              </p>
              <button
                onClick={() => navigate('/tenants/add')}
                className="mt-4 inline-flex items-center px-4 py-2 border 
                  border-transparent rounded-md shadow-sm text-sm font-medium 
                  text-white bg-primary-600 hover:bg-primary-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500"
              >
                <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                {t('addFirstTenant')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant._id}
                tenant={tenant}
                onView={(id) => navigate(`/tenants/${id}`)}
                onRemove={handleRemoveTenant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantList; 