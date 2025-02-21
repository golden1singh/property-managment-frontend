import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axios'
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const TenantDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchTenantDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/tenants/${id}`)
      setTenant(response.data)
    } catch (error) {
      console.error('Error fetching tenant details:', error)
      toast.error(t('errorFetchingTenantDetails'))
      if (error.response?.status === 404) {
        navigate('/tenants')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
   

    fetchTenantDetails()
  }, [id, navigate, t])

  const downloadDocument = async (doc) => {
    console.log('Downloading document:', doc);
    try {
      if (doc.url) {
        // Fetch the file first
        const response = await fetch(doc.url);
        const blob = await response.blob();
        
        // Create blob URL
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create temporary link element
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Set download attribute with filename
        const fileName = doc.name || `document-${Date.now()}`;
        link.setAttribute('download', fileName);
        
        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success(t('documentDownloadStarted'));
      } else {
        toast.error(t('documentUrlNotFound'));
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(t('errorDownloadingDocument'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">{t('tenantNotFound')}</h2>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: t('overview') },
    { id: 'documents', name: t('documents') },
    { id: 'payments', name: t('payments') },
    { id: 'utilities', name: t('utilities') }
  ]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {tenant.photo ? (
              <img
                src={tenant.photo?.url}
                alt={`${tenant.firstName} ${tenant.lastName}`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-16 w-16 text-gray-300" />
            )}
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {tenant.firstName} {tenant.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                {t('tenantSince', { date: new Date(tenant.moveInDate).toLocaleDateString() })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/tenants/edit/${id}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
            {t('editTenant')}
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Personal Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('personalInformation')}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('email')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {tenant.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('phone')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {tenant.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('occupation')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.occupation}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('employer')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.employer}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('monthlyIncome')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{tenant.monthlyIncome.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('roomInformation')}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('plotNumber')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.room.plotNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('roomNumber')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.room.roomNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('monthlyRent')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{tenant.room.rent.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('securityDeposit')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{tenant.room?.deposit?.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('leaseStartDate')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(tenant.room.moveInDate).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('leaseEndDate')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(tenant.room.leaseEnd).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('emergencyContact')}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('name')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.emergencyContact}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('phone')}</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {tenant.emergencyPhone}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('addressInformation')}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('currentAddress')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.address?.current}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('permanentAddress')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tenant.address?.permanent}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">{t('documents')}</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {tenant.documents.map((doc,index) => (
                    <li key={doc.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {t(`document ${index}`)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {doc.number || doc.name}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadDocument(doc)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">{t('payments')}</h3>
              </div>
              <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('date')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('type')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('amount')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tenant?.payments?.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {t(`paymentType.${payment.type}`)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {t(`paymentStatus.${payment.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'utilities' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">{t('utilities')}</h3>
              </div>
              <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('date')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('type')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reading')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('amount')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tenant?.utilities?.map((utility) => (
                      <tr key={utility.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(utility.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {t(`utilityType.${utility.type}`)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {utility.reading}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{utility.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${utility.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {t(`paymentStatus.${utility.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TenantDetails