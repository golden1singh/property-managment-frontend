import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  PlusIcon,
  HomeModernIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  UserIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import axiosInstance from '../../utils/axios'

const StatusBadge = ({ status }) => {
  const { t } = useTranslation()
  const statusConfig = {
    available: {
      icon: KeyIcon,
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      gradient: 'from-emerald-50 to-emerald-100'
    },
    occupied: {
      icon: UserIcon,
      className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      gradient: 'from-blue-50 to-blue-100'
    },
    maintenance: {
      icon: WrenchScrewdriverIcon,
      className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      gradient: 'from-amber-50 to-amber-100'
    }
  }

  const { icon: Icon, className } = statusConfig[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 
      rounded-full text-xs font-medium ring-1 ring-inset 
      shrink-0 ${className}`}>
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{t(`roomStatus.${status}`)}</span>
    </span>
  )
}

const RoomCard = ({ room, onClick,plots }) => {
  const { t } = useTranslation();
  
  const getStatusStyles = (status) => {
    const styles = {
      available: {
        icon: 'text-emerald-600',
        bg: 'from-emerald-50 to-emerald-100',
        ring: 'ring-emerald-100'
      },
      occupied: {
        icon: 'text-blue-600',
        bg: 'from-blue-50 to-blue-100',
        ring: 'ring-blue-100'
      },
      maintenance: {
        icon: 'text-amber-600',
        bg: 'from-amber-50 to-amber-100',
        ring: 'ring-amber-100'
      }
    };
    return styles[status] || styles.maintenance;
  };

  const statusStyle = getStatusStyles(room.status);

  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl bg-white p-5
        hover:shadow-xl border border-slate-200
        hover:border-primary-400 cursor-pointer
        transition-all duration-200 hover:-translate-y-1"
    >
      <div className="flex flex-col h-full space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg
              bg-gradient-to-br ${statusStyle.bg} ring-1 ${statusStyle.ring}
              shadow-sm`}
            >
              <HomeModernIcon className={`h-4 w-4 ${statusStyle.icon}`} />
            </div>
            <div className="min-w-0 pt-0.5 flex-1">
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600
                truncate leading-tight">
                {t('roomNumber')} {room.roomNumber}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BuildingOfficeIcon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-500 truncate">
                  Plot # {plots?.find(p => p.id === room.plotNumber)?.plotNumber}
                </p>
              </div>
            </div>
          </div>
          <StatusBadge status={room.status} />
        </div>

        {/* Tenant Info Section */}
        <div className="flex items-center text-sm bg-slate-50 
          rounded-lg p-3 border border-slate-100 group-hover:border-slate-200
          transition-colors duration-200">
          <div className={`p-1.5 rounded-md mr-3
            ${room.currentTenant 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-slate-100 text-slate-500'}`}>
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1"> {/* Added for better text handling */}
            <p className="font-medium text-slate-700 truncate">
              {room.currentTenant 
                ? `${room.currentTenant.firstName} ${room.currentTenant.lastName}`
                : t('vacant')}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {room.currentTenant ? t('tenant') : t('roomsData.noTenant')}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center">
            <div className="p-1.5 rounded-md bg-primary-50 text-primary-600 mr-3">
              <CurrencyRupeeIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                ₹{room.rent.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                {t('roomsData.perMonth')}
              </p>
            </div>
          </div>
          
          {room.status === 'available' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 
              rounded-full text-xs font-medium bg-emerald-50 text-emerald-700
              ring-1 ring-emerald-600/10">
              {t('roomsData.available')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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


  // Fetch plots and rooms
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

  useEffect(() => {
    fetchData();
  }, []);

  // Organize rooms by plot
  console.log({rooms})
  const plotsWithRooms = plots?.map(plot => ({
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
    selectedPlot === 'all' || plot.id === selectedPlot
  );

  const renderDropdown = (value, onChange, options, placeholder) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="block w-full rounded-lg border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm
          focus:border-primary-500 focus:ring-primary-500 
          shadow-sm transition-all duration-200
          hover:border-slate-300"
      >
        {options}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );

  const renderSearchInput = () => (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full rounded-lg border-slate-200 pl-10 
          focus:border-primary-500 focus:ring-primary-500 
          transition-all duration-200 py-2.5 text-sm
          hover:border-slate-300"
        placeholder={t('searchRooms')}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('rooms')}</h1>
            <p className="mt-1 text-sm text-slate-500">{t('manageRooms')}</p>
          </div>
          
          <button
            onClick={() => navigate('/rooms/add')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2.5
              rounded-lg text-sm font-medium text-white
              bg-gradient-to-r from-primary-600 to-primary-700
              hover:from-primary-700 hover:to-primary-800
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
              transition-all duration-200 shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addRoom')}
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 bg-white shadow-sm rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search input */}
            {renderSearchInput()}

            {/* Plot filter */}
            {renderDropdown(
              selectedPlot,
              (e) => setSelectedPlot(e.target.value),
              <>
                <option value="all">{t('allPlots')}</option>
                {plots.map(plot => (
                  <option key={plot.id} value={plot.id}>
                    {t('plotNumber')} {plot.plotNumber}
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

        {/* Room Grid */}
        <div className="mt-8 space-y-8">
          {plotsWithRooms?.map(plot => (
            <div key={plot.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                  {console.log({plotsWithRooms})}
                  <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t('plotWithRooms', { 
                      number: plot?.plotNumber ,
                      available: plot.rooms.filter(r => r.status === 'available').length,
                      total: plot.rooms.length
                    })}
                  </h2>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <MapPinIcon className="h-4 w-4 mr-1.5" />
                    {plot.address}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {plot.rooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room} plots={plots}
                    onClick={() => navigate(`/rooms/${room._id}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;