import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CurrencyRupeeIcon, 
  CheckCircleIcon, 
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';


const RentCollectionList = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const [stats, setStats] = useState({
    totalAmount: 0,
    collectedAmount: 0,
    pendingAmount: 0
  });
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    status: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Function to generate test entries
  const generateTestEntries = async () => {
    try {
      await axiosInstance.post('/api/rent-collections/generate-test-entries');
      // After generating test entries, fetch the payments
      await fetchPayments();
      setInitialized(true);
    } catch (error) {
      console.error('Error generating test entries:', error);
      toast.error(t('errors.generateTestEntries'));
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!initialized) {
        await generateTestEntries();
      }
    };

    initializeData();
  }, []); // Run once when component mounts

  useEffect(() => {
    if (initialized) {
      fetchPayments();
    }
  }, [filters, initialized]); // Fetch payments when filters change and after initialization

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/rent-collections', {
        params: {
          ...filters,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        }
      });
      console.log({response})
      setPayments(response.data.rentCollections);
      setStats(response.data.stats);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(response.data?.pagination?.total / pagination.itemsPerPage),
        totalItems: response.data?.pagination?.total
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(t('errors.fetchPayments'));
    } finally {
      setLoading(false);
    }
  };
console.log({payments})

  // Add pagination handlers
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
            {t('rentCollection.title')} ✨
          </h1>
        </div>

        {/* Right: Actions */}
        {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <button
            className="btn bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="w-4 h-4 fill-current opacity-50 shrink-0" />
            <span className="hidden xs:block ml-2">{t('common.filters')}</span>
          </button>
          
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => window.location.href = '/rent/collect'}
          >
            <PlusIcon className="w-4 h-4 fill-current opacity-50 shrink-0" />
            <span className="hidden xs:block ml-2">{t('rentCollection.collectRent')}</span>
          </button>
        </div> */}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Total Amount */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-4">
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-indigo-50">
                <CurrencyRupeeIcon className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">{t('rentCollection.totalAmount')}</div>
                <div className="text-2xl font-bold text-slate-800">₹{stats.totalAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Collected Amount */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-4">
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">{t('rentCollection.collected')}</div>
                <div className="text-2xl font-bold text-green-600">₹{stats.collectedAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-4">
          <div className="bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-red-50">
                <ClockIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">{t('rentCollection.pending')}</div>
                <div className="text-2xl font-bold text-red-600">₹{stats.pendingAmount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Month Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="month">
              {t('rentCollection.month')}
            </label>
            <input
              id="month"
              type="month"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-600 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                placeholder-slate-400 transition-all duration-150"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="status">
              {t('rentCollection.status')}
            </label>
            <div className="relative">
              <select
                id="status"
                className="appearance-none w-full px-3 py-2 border border-slate-300 rounded-lg 
                  text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  focus:border-indigo-500 cursor-pointer transition-all duration-150"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">{t('rentCollection.statuses.all')}</option>
                <option value="paid">{t('rentCollection.statuses.paid')}</option>
                <option value="pending">{t('rentCollection.statuses.pending')}</option>
                <option value="overdue">{t('rentCollection.statuses.overdue')}</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="search">
              {t('rentCollection.searchPlaceholder')}
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-slate-600 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                  placeholder-slate-400 transition-all duration-150"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={t('rentCollection.searchPlaceholder')}
              />
              {/* Search icon */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-500 font-medium">{t('rentCollection.noPayments')}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.room')}</div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.tenant')}</div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.amount')}</div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.dueDate')}</div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.status')}</div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">{t('rentCollection.actions')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-800">Room {payment.room.roomNumber}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-800">{payment.tenant.firstName} {payment.tenant.lastName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">₹{payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-800">{new Date(payment.dueDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${
                        payment.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-600'
                          : payment.status === 'pending'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-rose-100 text-rose-600'
                      }`}>
                        {t(`rentCollection.statuses.${payment.status}`)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        className={`btn-sm ${
                          payment.status === 'paid'
                            ? 'border-slate-200 hover:border-slate-300 text-slate-600'
                            : 'bg-indigo-200 hover:bg-indigo-600 text-black'
                        }`}
                        onClick={() => window.location.href = `/rent/collect/${payment._id}`}
                      >
                        {payment.status === 'paid' ? t('rentCollection.view') : t('rentCollection.collect')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && payments.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              {/* Results info */}
              <div className="text-sm text-slate-500">
                {t('pagination.showing')} {' '}
                <span className="font-medium text-slate-600">
                  {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
                </span>{' '}
                {t('pagination.to')}{' '}
                <span className="font-medium text-slate-600">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span>{' '}
                {t('pagination.of')}{' '}
                <span className="font-medium text-slate-600">{pagination.totalItems}</span>{' '}
                {t('pagination.results')}
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium 
                    ${pagination.currentPage === 1
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                    } transition-colors duration-150 ease-in-out`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-2">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= pagination.currentPage - 1 &&
                        pageNumber <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium
                            ${pagination.currentPage === pageNumber
                              ? 'bg-indigo-500 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                            } transition-colors duration-150 ease-in-out`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === pagination.currentPage - 2 ||
                      pageNumber === pagination.currentPage + 2
                    ) {
                      return <span key={pageNumber} className="text-slate-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium 
                    ${pagination.currentPage === pagination.totalPages
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                    } transition-colors duration-150 ease-in-out`}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentCollectionList; 