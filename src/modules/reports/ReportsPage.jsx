import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DocumentChartBarIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ReportsPage = () => {
  const { t } = useTranslation()
  const [selectedReport, setSelectedReport] = useState('financial')
  const [dateRange, setDateRange] = useState('month')

  const reports = [
    {
      id: 'financial',
      name: t('reportsFinancial'),
      icon: CurrencyRupeeIcon,
      description: t('reportsFinancialDesc')
    },
    {
      id: 'occupancy',
      name: t('reportsOccupancy'),
      icon: UserGroupIcon,
      description: t('reportsOccupancyDesc')
    },
    {
      id: 'maintenance',
      name: t('reportsMaintenance'),
      icon: DocumentTextIcon,
      description: t('reportsMaintenanceDesc')
    }
  ]

  // Sample data for charts
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: t('reportsIncome'),
        data: [12000, 19000, 15000, 17000, 22000, 20000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)'
      },
      {
        label: t('reportsExpenses'),
        data: [8000, 12000, 9000, 11000, 13000, 12000],
        backgroundColor: 'rgba(239, 68, 68, 0.5)'
      }
    ]
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t('reportsTitle')}</h1>
        
        {/* Report Type Selection */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`relative rounded-lg border p-5 flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                selectedReport === report.id
                  ? 'border-primary-500 ring-2 ring-primary-500'
                  : 'border-gray-300'
              }`}
            >
              <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-primary-600 text-white`}>
                <report.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="focus:outline-none">
                  <p className="text-sm font-medium text-gray-900 text-left">
                    {report.name}
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    {report.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filters and Export */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="week">{t('reportsLastWeek')}</option>
              <option value="month">{t('reportsLastMonth')}</option>
              <option value="quarter">{t('reportsLastQuarter')}</option>
              <option value="year">{t('reportsLastYear')}</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              {t('reportsFilters')}
            </button>
          </div>
          <button
            type="button"
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {t('reportsExport')}
          </button>
        </div>

        {/* Charts and Data */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {selectedReport === 'financial' ? t('reportsFinancialSummary') : 
               selectedReport === 'occupancy' ? t('reportsOccupancyTrends') :
               t('reportsMaintenanceOverview')}
            </h3>
            <div className="mt-4 h-96">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage 