import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  PlusIcon,
  HomeModernIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline'
import axiosInstance from '../../utils/axios'

const RoomList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [plots, setPlots] = useState([])
  const [rooms, setRooms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlot, setSelectedPlot] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  console.log("---->",plots)

  // Fetch plots and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plotsResponse, roomsResponse] = await Promise.all([
          axiosInstance.get('/api/plots'),
          axiosInstance.get('/api/rooms')
        ]);

        setPlots(plotsResponse.data);
        setRooms(roomsResponse.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Organize rooms by plot
  const plotsWithRooms = plots.map(plot => ({
    ...plot,
    rooms: rooms.filter(room => room.plotNumber === plot.id)
      .filter(room => {
        const matchesSearch = 
          room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.currentTenant?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
  })).filter(plot => 
    selectedPlot === 'all' || plot.id== selectedPlot
  );

  const renderDropdown = (value, onChange, options, placeholder) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base 
          focus:border-primary-500 focus:outline-none focus:ring-primary-500 
          shadow-sm transition-colors duration-200
          hover:border-gray-400 sm:text-sm appearance-none"
      >
        {options}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3
          focus:border-primary-500 focus:outline-none focus:ring-primary-500 
          shadow-sm transition-colors duration-200
          hover:border-gray-400 sm:text-sm"
        placeholder={t('searchRooms')}
      />
    </div>
  );

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-center py-6 text-red-600">Error: {error}</div>;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{t('rooms')}</h1>
          
          <button
            type="button"
            onClick={() => navigate('/rooms/add')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 
              hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-primary-500 transition-colors duration-200"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            {t('addRoom')}
          </button>
        </div>

        {/* Filters section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Search input */}
              {renderSearchInput()}

              {/* Plot filter */}
              {renderDropdown(
                selectedPlot,
                (e) => setSelectedPlot(e.target.value),
                <>
                  <option value="all" disabled>{t('allPlots')}</option>
                  {plots.map(plot => (
                    <option key={plot.id} value={plot.id} className='text-black-600'>
                      {t('plotNumber')} {`${plot.plotNumber}`}
                    </option>
                  ))}
                </>
              )}

              {/* Status filter */}
              {renderDropdown(
                filterStatus,
                (e) => setFilterStatus(e.target.value),
                <>
                  <option value="all">{t('allStatus')}</option>
                  <option value="available">{t('roomStatus.available')}</option>
                  <option value="occupied">{t('roomStatus.occupied')}</option>
                  <option value="maintenance">{t('roomStatus.maintenance')}</option>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Plots and Rooms list */}
        <div className="mt-8 space-y-8">
          {plotsWithRooms.map(plot => (
            <div key={plot._id} className="bg-white shadow overflow-hidden sm:rounded-lg 
              transition-all duration-200 hover:shadow-md">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center 
                border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('plotWithRooms', { 
                    number: plot.plotNumber,
                    available: plot.rooms.filter(r => r.status === 'available').length,
                    total: plot.rooms.length
                  })}
                </h3>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {plot.rooms.map(room => (
                    <div
                      key={room._id}
                      onClick={() => navigate(`/rooms/${room._id}`)}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 
                        shadow-sm hover:border-primary-400 hover:shadow-md 
                        focus-within:ring-2 focus-within:ring-primary-500 
                        focus-within:ring-offset-2 cursor-pointer
                        transition-all duration-200"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {t('roomNumber', { number: room.roomNumber })}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {room.currentTenant ? room.currentTenant.name : t('vacant')}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          transition-colors duration-200
                          ${room.status === 'available' ? 'bg-green-100 text-green-800' :
                            room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {t(`roomStatus.${room.status}`)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{room.rent.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;