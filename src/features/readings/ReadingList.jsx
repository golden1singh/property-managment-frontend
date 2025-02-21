import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../utils/axios'
import { toast } from 'react-toastify'
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  BeakerIcon,
  FireIcon,
  ChevronRightIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const ReadingList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterPlot, setFilterPlot] = useState('all')
  const [plots, setPlots] = useState([])
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Fetch utility bills
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await axiosInstance.get('/api/utility-bills')
        // Transform the data to match our component's needs
        const transformedReadings = response.data.map(bill => ({
          id: bill._id,
          plotNumber: bill.plotNumber,
          roomNumber: bill.roomNumber,
          type: bill.billType,
          date: bill.billDate,
          previousReading: bill.previousReading,
          currentReading: bill.currentReading,
          unitsConsumed: bill.currentReading - bill.previousReading,
          ratePerUnit: bill.ratePerUnit,
          additionalCharges: bill.additionalCharges,
          totalAmount: bill.totalAmount,
          status: bill.status
        }))
        setReadings(transformedReadings)
      } catch (error) {
        console.error('Error fetching readings:', error)
        toast.error(t('errors.fetchReadings'))
      } finally {
        setLoading(false)
      }
    }

    fetchReadings()
  }, [t])

  const getTypeIcon = (type) => {
    switch (type) {
      case 'electricity':
        return <BoltIcon className="h-5 w-5 text-yellow-500" />
      case 'water':
        return <BeakerIcon className="h-5 w-5 text-blue-500" />
      case 'gas':
        return <FireIcon className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  const filteredReadings = readings.filter(reading => {
    const matchesSearch = 
      reading.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || reading.type === filterType
    
    const matchesMonth = filterMonth === 'all' || 
      new Date(reading.date).getMonth() === parseInt(filterMonth)

    const matchesPlot = filterPlot === 'all' || reading.plotNumber === filterPlot

    return matchesSearch && matchesType && matchesMonth && matchesPlot
  })

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('readings.title')}
            </h1>
          </div>
          <button
            onClick={() => navigate('/readings/add')}
            className="inline-flex items-center px-4 py-2 border border-transparent 
              rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 
              hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-primary-500 transition-colors duration-200"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            {t('readings.addReading')}
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('readings.searchPlaceholder')}
                className="block w-full pl-10 pr-3 py-2.5 text-sm border-gray-300 
                  rounded-lg focus:ring-primary-500 focus:border-primary-500 
                  bg-white shadow-sm transition-colors duration-200"
              />
            </div>
          </div>

          <div className="relative">
            <select
              value={filterPlot}
              onChange={(e) => setFilterPlot(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 
                rounded-lg focus:ring-primary-500 focus:border-primary-500 
                bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">{t('readings.allPlots')}</option>
              {plots.map(plot => (
                <option key={plot._id} value={plot.plotNumber}>
                  {t('readings.plotWithNumber', { number: plot.plotNumber })}
                </option>
              ))}
            </select>
            <BuildingOfficeIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 
                rounded-lg focus:ring-primary-500 focus:border-primary-500 
                bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">{t('readings.allTypes')}</option>
              <option value="electricity">{t('readings.types.electricity')}</option>
              <option value="water">{t('readings.types.water')}</option>
              <option value="gas">{t('readings.types.gas')}</option>
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 
                rounded-lg focus:ring-primary-500 focus:border-primary-500 
                bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">{t('readings.allMonths')}</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Readings List */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              // Loading state
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredReadings.map((reading) => (
                  <li 
                    key={reading.id}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/readings/${reading.id}`)}
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getTypeIcon(reading.type)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {t('readings.plotRoom', { 
                                  plot: reading.plotNumber, 
                                  room: reading.roomNumber 
                                })}
                              </h3>
                              <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${reading.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {t(`readings.status.${reading.status}`)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500 space-x-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(reading.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {reading.unitsConsumed} {t('readings.units')}
                            </p>
                            <p className="text-sm font-bold text-primary-600">
                              ₹{reading.totalAmount}
                            </p>
                          </div>
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Empty State - Updated with better conditions */}
          {!loading && filteredReadings.length === 0 && (
            <div className="text-center py-12">
              <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {readings.length === 0 
                  ? t('readings.noReadings')
                  : t('readings.noMatchingReadings')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {readings.length === 0 
                  ? t('readings.noReadingsDescription')
                  : t('readings.noMatchingReadingsDescription')}
              </p>
              {readings.length === 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/readings/add')}
                    className="inline-flex items-center px-4 py-2 border border-transparent 
                      rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 
                      hover:bg-primary-700 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    {t('readings.addFirstReading')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReadingList 