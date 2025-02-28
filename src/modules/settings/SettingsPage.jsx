import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  UserCircleIcon,
  BellIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

const SettingsPage = () => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('profile')

  const [settings, setSettings] = useState({
    profile: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    notifications: {
      email: true,
      push: false,
      rentReminders: true,
      paymentReceipts: true,
      maintenanceAlerts: true,
      leaseExpiry: true
    },
    propertyDetails: {
      propertyName: 'Green Valley Apartments',
      address: '123 Main Street, City',
      gstNumber: 'GST123456789',
      panNumber: 'ABCDE1234F'
    },
    billing: {
      lateFeePercentage: 2,
      gracePeriod: 5,
      defaultDeposit: 2, // months
      utilityCharges: {
        electricity: 8,
        water: 5,
        maintenance: 500
      }
    },
    documents: {
      rentAgreementTemplate: null,
      receiptTemplate: null,
      letterheadLogo: null
    },
    printing: {
      includeLetterhead: true,
      includeQR: true,
      autoSendEmail: true,
      defaultPaperSize: 'A4'
    }
  })

  const tabs = [
    { id: 'profile', name: t('settings.profile'), icon: UserCircleIcon },
    { id: 'notifications', name: t('settings.notifications'), icon: BellIcon },
    { id: 'property', name: t('settings.property'), icon: BuildingOfficeIcon },
    { id: 'billing', name: t('settings.billing'), icon: CurrencyRupeeIcon },
    { id: 'documents', name: t('settings.documents'), icon: DocumentTextIcon },
    { id: 'printing', name: t('settings.printing'), icon: PrinterIcon },
    { id: 'language', name: t('settings.language'), icon: GlobeAltIcon },
    { id: 'security', name: t('settings.security'), icon: ShieldCheckIcon }
  ]

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t('settings.title')}</h1>

        <div className="mt-6 flex">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <tab.icon
                    className={`
                      mr-3 h-6 w-6
                      ${activeTab === tab.id
                        ? 'text-primary-600'
                        : 'text-gray-400'
                      }
                    `}
                  />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="ml-8 flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('settings.profileSettings')}
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('settings.name')}
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    {/* Add more profile fields */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('settings.notificationPreferences')}
                  </h3>
                  <div className="mt-6 space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={key} className="ml-3 text-sm text-gray-700">
                          {t(`settings.notification${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'property' && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('settings.propertyDetails')}
                  </h3>
                  <div className="mt-6 space-y-6">
                    {Object.entries(settings.propertyDetails).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700">
                          {t(`settings.property.${key}`)}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleSettingChange('propertyDetails', key, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('settings.billingSettings')}
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('settings.billing.lateFee')}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          value={settings.billing.lateFeePercentage}
                          onChange={(e) => handleSettingChange('billing', 'lateFeePercentage', parseFloat(e.target.value))}
                          className="block w-full pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                    {/* Add more billing settings */}
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab contents */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 