import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LightBulbIcon,
  WifiIcon,
  FireIcon,
  BeakerIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const UtilitiesPage = () => {
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const utilities = [
    {
      id: 1,
      name: t('utilitiesElectricity'),
      icon: LightBulbIcon,
      color: 'text-yellow-600 bg-yellow-100',
      rooms: [
        { number: '101', reading: '234.5', status: 'pending' },
        { number: '102', reading: '156.8', status: 'paid' }
      ]
    },
    {
      id: 2,
      name: t('utilitiesWater'),
      icon: BeakerIcon,
      color: 'text-blue-600 bg-blue-100',
      rooms: [
        { number: '101', reading: '45.2', status: 'pending' },
        { number: '102', reading: '32.7', status: 'paid' }
      ]
    },
    {
      id: 3,
      name: t('utilitiesGas'),
      icon: FireIcon,
      color: 'text-red-600 bg-red-100',
      rooms: [
        { number: '101', reading: '78.3', status: 'pending' },
        { number: '102', reading: '65.1', status: 'paid' }
      ]
    },
    {
      id: 4,
      name: t('utilitiesInternet'),
      icon: WifiIcon,
      color: 'text-purple-600 bg-purple-100',
      rooms: [
        { number: '101', status: 'active' },
        { number: '102', status: 'inactive' }
      ]
    }
  ]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{t('utilitiesTitle')}</h1>
          <button
            type="button"
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('utilitiesAddReading')}
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">{t('utilitiesAllUtilities')}</option>
              <option value="pending">{t('utilitiesPending')}</option>
              <option value="paid">{t('utilitiesPaid')}</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              {t('utilitiesFilters')}
            </button>
          </div>
          <div className="mt-3 sm:mt-0 relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder={t('utilitiesSearch')}
            />
          </div>
        </div>

        {/* Utilities Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {utilities.map((utility) => (
            <div
              key={utility.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${utility.color}`}>
                    <utility.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {utility.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {utility.rooms.length}
                        </div>
                        <div className="ml-2 text-sm font-medium text-gray-500">
                          {t('utilitiesActiveConnections')}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    {t('utilitiesViewAll')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Readings Table */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('utilitiesRecentReadings')}
            </h3>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
              {t('utilitiesExport')}
            </button>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('utilitiesRoom')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('utilitiesUtility')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('utilitiesReading')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('utilitiesStatus')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {utilities.flatMap(utility =>
                  utility.rooms.map((room, index) => (
                    <tr key={`${utility.id}-${room.number}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {utility.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.reading || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            room.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : room.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t(`utilities.${room.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilitiesPage 