import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CurrencyRupeeIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'
import * as XLSX from 'xlsx'

import { toast } from 'react-toastify'

import axiosInstance from '../../utils/axios'

const PaymentPage = () => {
  const { t } = useTranslation()
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('thisMonth')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    completed: 0,
    completedCount: 0,
    pending: 0,
    pendingCount: 0,
    overdue: 0,
    overdueCount: 0,
    total: 0
  })
  const [tenants, setTenants] = useState([])
  const [selectedPlot, setSelectedPlot] = useState('')
  const [plots, setPlots] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  })
  const [payments, setPayments] = useState([])

  const [newPayment, setNewPayment] = useState({
    tenant: '',
    room: '',
    amount: '',
    type: 'rent',
    dueDate: '',
    notes: '',
    receipt: null
  })

  // Add payment types array
  const paymentTypes = ['rent', 'utility', 'deposit', 'maintenance']

  // Add new state for payment type filter
  const [filterPaymentType, setFilterPaymentType] = useState('all')

  useEffect(() => {
    fetchPayments()
    fetchTenants()
    fetchPlots()
  }, [filterStatus, filterPaymentType, selectedPlot, pagination.currentPage, searchTerm])

  const fetchPayments = async () => {
    try {
    
      setLoading(true)
      const response = await axiosInstance.get('/api/payments', {
        params: {
          plotId: selectedPlot || '',
          status: filterStatus === 'all' ? '' : filterStatus,
          type: filterPaymentType === 'all' ? '' : filterPaymentType,
          search: searchTerm || '',
          page: pagination.currentPage,
          limit: pagination.limit,
        }
      })
      console.log({response})
      setPayments(response.data.payments)
      setStats(response.data.stats)
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        limit: response.data.pagination.limit
      })
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error(t('errors.fetchPayments'))
    } finally {
      setLoading(false)
    }
  }

  const fetchTenants = async () => {
    try {
      const response = await axiosInstance.get('/api/tenants')
      setTenants(response.data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
      toast.error(t('errors.fetchTenants'))
    }
  }

  const fetchPlots = async () => {
    try {
      const response = await axiosInstance.get('/api/plots')
      setPlots(response.data)
    } catch (error) {
      console.error('Error fetching plots:', error)
      toast.error(t('errors.fetchPlots'))
    }
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.keys(newPayment).forEach(key => {
        if (newPayment[key] !== null) {
          formData.append(key, newPayment[key])
        }
      })

      await axios.post('/api/payments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success(t('success.paymentAdded'))
      setIsAddPaymentOpen(false)
      fetchPayments()
      setNewPayment({
        tenant: '',
        room: '',
        amount: '',
        type: 'rent',
        dueDate: '',
        notes: '',
        receipt: null
      })
    } catch (error) {
      console.error('Error adding payment:', error)
      toast.error(t('errors.addPayment'))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setNewPayment({
        ...newPayment,
        receipt: file
      })
    } else {
      toast.error(t('errors.invalidFileType'))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 ring-green-600/20'
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'
      case 'overdue':
        return 'text-red-700 bg-red-50 ring-red-600/20'
      default:
        return 'text-gray-700 bg-gray-50 ring-gray-600/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'overdue':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }
console.log({payments})
  const filteredPayments = payments.filter(payment => {
    const tenantName = `${payment?.tenant?.firstName} ${payment?.tenant?.lastName}`.toLowerCase()
    const roomNumber = payment?.room?.roomNumber?.toString() || ''
    
    const matchesSearch = searchTerm 
      ? tenantName.includes(searchTerm.toLowerCase()) || roomNumber.includes(searchTerm)
      : true
      
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    const dataToExport = filteredPayments.map(payment => ({
      [t('tenant')]: payment.tenant,
      [t('room')]: payment.room,
      [t('amount')]: payment.amount,
      [t('date')]: payment.date,
      [t('status')]: t(`paymentStatus.${payment.status}`),
      [t('type')]: t(`paymentType.${payment.type}`)
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Payments')
    XLSX.writeFile(wb, `payments_${new Date().toISOString().split('T')[0]}.xlsx`)
  }
// console.log({plots})
  const PlotFilter = () => (
    <div className="relative">
      <select
        value={selectedPlot}
        onChange={(e) => {
          setSelectedPlot(e.target.value)
          setPagination(prev => ({ ...prev, currentPage: 1 }))
        }}
        className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 
          rounded-lg focus:ring-primary-500 focus:border-primary-500 
          shadow-sm transition-colors duration-200"
      >
        <option value="" disabled>{t('readings.allPlots')}</option>
        {plots.map(plot => (
         
          <option key={plot._id} value={plot.plotNumber}>
            { t('plotNumber') }{` ${plot.plotNumber}`}
          </option>
        ))}
      </select>
      <BuildingOfficeIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  )

  const Pagination = () => (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          disabled={pagination.currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 
            text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {t('pagination.previous')}
        </button>
        <button
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          disabled={pagination.currentPage === pagination.totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 
            text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {t('pagination.next')}
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {t('pagination.showing')} <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span>{' '}
            {t('pagination.to')}{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.limit, stats?.total || 0)}
            </span>{' '}
            {t('pagination.of')}{' '}
            <span className="font-medium">{stats?.total || 0}</span>{' '}
            {t('pagination.results')}
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 
                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t('pagination.previous')}</span>
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 
                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t('pagination.next')}</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )

  const getDateRangeParams = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    switch (dateRange) {
      case 'thisMonth':
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        }
      case 'lastMonth':
        return {
          startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString(),
          endDate: new Date(today.getFullYear(), today.getMonth(), 0).toISOString()
        }
      case 'last3Months':
        return {
          startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString(),
          endDate: today.toISOString()
        }
      case 'thisYear':
        return {
          startDate: new Date(today.getFullYear(), 0, 1).toISOString(),
          endDate: new Date(today.getFullYear(), 11, 31).toISOString()
        }
      default:
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        }
    }
  }

  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/payments/${paymentId}/status`, {
        status: newStatus
      })
      toast.success(t('success.statusUpdated'))
      fetchPayments()
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error(t('errors.updateStatus'))
    }
  }

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm(t('confirmations.deletePayment'))) {
      try {
        await axiosInstance.delete(`/api/payments/${paymentId}`)
        toast.success(t('success.paymentDeleted'))
        fetchPayments()
      } catch (error) {
        console.error('Error deleting payment:', error)
        toast.error(t('errors.deletePayment'))
      }
    }
  }

  const handleSendReminder = async (tenantId, payment) => {
    try {
      await axiosInstance.post(`/api/payments/remind/${tenantId}`, {
        amount: payment.amount,
        dueDate: payment.dueDate,
        type: payment.type,
        sendEmail: true,
        sendSMS: true
      })
      toast.success(t('success.reminderSent'))
    } catch (error) {
      console.error('Error sending reminder:', error)
      toast.error(t('errors.sendReminder'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {t('payments')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('paymentsDescription')}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 
                rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-500 transition-colors duration-200"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-400" />
              {t('exportPayments')}
            </button>
            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 
                hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('recordPayment')}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('stats.completed')}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ₹{(stats?.completed || 0).toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <span>{stats?.completedCount || 0}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('stats.pending')}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ₹8,200
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                        <span>5</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <PlotFilter />
                {/* <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-lg 
                      focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={t('searchPayments')}
                  />
                </div> */}

                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                      rounded-lg focus:outline-none focus:ring-primary-500 
                      focus:border-primary-500 sm:text-sm"
                  >
                    <option value="all">{t('allStatus')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="pending">{t('pending')}</option>
                    <option value="overdue">{t('overdue')}</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={filterPaymentType}
                    onChange={(e) => setFilterPaymentType(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                      rounded-lg focus:outline-none focus:ring-primary-500 
                      focus:border-primary-500 sm:text-sm"
                  >
                    <option value="all" disabled>{t('allPaymentTypes')}</option>
                    <option value="rent">{t('paymentType.rent')}</option>
                    <option value="utility">{t('paymentType.utility')}</option>
                    <option value="deposit">{t('paymentType.deposit')}</option>
                    <option value="maintenance">{t('paymentType.maintenance')}</option>
                  </select>
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                  </div> */}
                </div>

                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                      rounded-lg focus:outline-none focus:ring-primary-500 
                      focus:border-primary-500 sm:text-sm"
                  >
                    <option value="thisMonth">{t('thisMonth')}</option>
                    <option value="lastMonth">{t('lastMonth')}</option>
                    <option value="last3Months">{t('last3Months')}</option>
                    <option value="thisYear">{t('thisYear')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">{t('loading')}</div>
          ) : payments.length === 0 ? (
            <div className="p-4 text-center text-gray-500">{t('noPayments')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tenant')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('room')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('amount')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('type')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.tenant.firstName} {payment.tenant.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.room.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{t(`paymentStatus.${payment.status}`)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`paymentType.${payment.type}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdatePaymentStatus(payment._id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                {t('markComplete')}
                              </button>
                              <button
                                onClick={() => handleSendReminder(payment.tenant._id, payment)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <BellIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeletePayment(payment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination />
        </div>

        <Dialog
          open={isAddPaymentOpen}
          onClose={() => setIsAddPaymentOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Dialog.Panel className="mx-auto w-full max-w-md transform rounded-xl bg-white shadow-xl transition-all">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                    <CurrencyRupeeIcon className="h-6 w-6 text-primary-500 mr-2" />
                    {t('recordNewPayment')}
                  </Dialog.Title>
                  <button
                    onClick={() => setIsAddPaymentOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <form onSubmit={handleAddPayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('selectTenant')}
                    </label>
                    <div className="relative">
                      <select
                        value={newPayment.tenant}
                        onChange={(e) => setNewPayment({...newPayment, tenant: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 
                          rounded-lg focus:ring-primary-500 focus:border-primary-500 
                          shadow-sm transition-colors duration-200"
                        required
                      >
                        <option value="">{t('selectTenant')}</option>
                        {tenants.map(tenant => (
                          <option key={tenant._id} value={tenant._id}>
                            {tenant.firstName} {tenant.lastName} - Room {tenant.room?.roomNumber}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('paymentType')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewPayment({...newPayment, type})}
                          className={`flex items-center justify-center px-3 py-2 border 
                            rounded-lg text-sm font-medium transition-colors duration-200
                            ${newPayment.type === type
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {t(`paymentType.${type}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('amount')}
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                        className="block w-full pl-7 pr-12 py-2.5 text-base border-gray-300 
                          rounded-lg focus:ring-primary-500 focus:border-primary-500 
                          transition-colors duration-200"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dueDate')}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newPayment.dueDate}
                        onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                        className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 
                          rounded-lg focus:ring-primary-500 focus:border-primary-500 
                          shadow-sm transition-colors duration-200"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('notes')}
                    </label>
                    <textarea
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                      rows={3}
                      className="block w-full px-3 py-2.5 text-base border-gray-300 
                        rounded-lg focus:ring-primary-500 focus:border-primary-500 
                        shadow-sm transition-colors duration-200"
                      placeholder={t('notesPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('receipt')}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 
                      border-dashed rounded-lg hover:border-primary-500 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        {newPayment.receipt ? (
                          <div className="flex flex-col items-center text-primary-600">
                            <DocumentCheckIcon className="h-12 w-12 mb-2" />
                            <p className="text-sm">{newPayment.receipt.name}</p>
                            <button
                              type="button"
                              onClick={() => setNewPayment({ ...newPayment, receipt: null })}
                              className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                              {t('remove')}
                            </button>
                          </div>
                        ) : (
                          <>
                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium 
                                  text-primary-600 hover:text-primary-500 focus-within:outline-none"
                              >
                                <span>{t('uploadReceipt')}</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept="image/*,.pdf"
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              {t('fileUploadHint')}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPaymentOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                      border border-gray-300 rounded-lg hover:bg-gray-50 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-primary-500 transition-colors duration-200"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    form="payment-form"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 
                      border border-transparent rounded-lg hover:bg-primary-700 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-primary-500 transition-colors duration-200
                      disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!newPayment.tenant || !newPayment.amount || !newPayment.dueDate}
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default PaymentPage