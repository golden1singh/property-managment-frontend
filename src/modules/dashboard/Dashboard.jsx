import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  LightBulbIcon,
  BellIcon,
  ExclamationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ServiceCard from '../../common/ServiceCard';
import axiosInstance from '../../utils/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    rentCollection: [],
    activities: [],
    alerts: [],
    notifications: []
  });
  const fetchDashboardData = async () => {
    try {
      const [stats, rentCollection, activities, alerts, notifications] = await Promise.all([
        axiosInstance.get('/api/dashboard/stats'),
        axiosInstance.get('/api/dashboard/rent-collection'),
        axiosInstance.get('/api/dashboard/activities'),
        axiosInstance.get('/api/dashboard/alerts'),
        axiosInstance.get('/api/dashboard/notifications')
      ]);

      setDashboardData({
        stats: stats.data.stats,
        rentCollection: rentCollection.data.rentCollection,
        activities: activities.data.activities,
        alerts: alerts.data.alerts,
        notifications: notifications.data.notifications
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
 

    fetchDashboardData();
  }, []);

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/api/dashboard/notifications/${notificationId}/read`);
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await axiosInstance.post('/api/dashboard/notifications/read-all');
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Dynamic stats data
  const stats = dashboardData.stats ? [
    {
      id: 1,
      name: t('totalRooms'),
      value: dashboardData.stats.totalRooms,
      icon: HomeIcon,
      change: `${dashboardData.stats.vacantRooms} ${t('vacant')}`,
      changeType: 'neutral'
    },
    {
      id: 2,
      name: t('occupiedRooms'),
      value: dashboardData.stats.occupiedRooms,
      icon: UserGroupIcon,
      change: `${((dashboardData.stats.occupiedRooms / dashboardData.stats.totalRooms) * 100).toFixed(1)}%`,
      changeType: 'increase'
    },
    {
      id: 3,
      name: t('pendingRent'),
      value: `₹${dashboardData.stats.pendingRent.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      change: `${dashboardData.stats.unreadNotifications} ${t('pending')}`,
      changeType: 'decrease'
    },
    {
      id: 4,
      name: t('pendingUtilities'),
      value: `₹${dashboardData.stats.pendingUtilities.toLocaleString()}`,
      icon: LightBulbIcon,
      change: `${dashboardData.stats.unreadNotifications} ${t('alerts')}`,
      changeType: dashboardData.stats.unreadNotifications > 0 ? 'decrease' : 'increase'
    }
  ] : [];

  // Chart data
  const rentCollectionData = {
    labels: dashboardData.rentCollection.map(item => 
      moment(`${item._id.year}-${item._id.month}`).format('MMM YY')
    ),
    datasets: [{
      label: t('rentCollection'),
      data: dashboardData.rentCollection.map(item => item.total),
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      borderColor: 'rgb(37, 99, 235)',
      borderWidth: 1
    }]
  };

  const occupancyData = {
    labels: [t('occupied'), t('vacant')],
    datasets: [{
      data: dashboardData.stats ? [
        dashboardData.stats.occupiedRooms,
        dashboardData.stats.totalRooms - dashboardData.stats.occupiedRooms
      ] : [0, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('monthlyRentCollection')
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: t('roomOccupancy')
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t('dashboard')}</h1>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 
                          stat.changeType === 'decrease' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {stat.changeType !== 'neutral' && (
                            stat.changeType === 'increase' ? 
                              <ArrowUpIcon className="h-4 w-4" /> : 
                              <ArrowDownIcon className="h-4 w-4" />
                          )}
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Charts */}
          <div className="bg-white rounded-lg shadow p-6">
            <Bar data={rentCollectionData} options={chartOptions} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Doughnut data={occupancyData} options={doughnutOptions} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BellIcon className="h-5 w-5 text-primary-600 mr-2" />
              {t('recentActivities')}
            </h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {dashboardData.activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== dashboardData.activities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'payment' ? 'bg-green-500' :
                            activity.type === 'rent' ? 'bg-blue-500' :
                            activity.type === 'maintenance' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}>
                            <BellIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                              {activity.amount && (
                                <span className="font-medium text-gray-900 ml-2">
                                  ₹{activity.amount.toLocaleString()}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>{moment(activity.timestamp).fromNow()}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alerts and Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {t('alerts')}
              </h2>
              {dashboardData.notifications.some(n => !n.isRead) && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  {t('markAllAsRead')}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {dashboardData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 flex items-center justify-between border-l-4 border-red-500 bg-red-50"
                >
                  <div className="flex items-center">
                    <ExclamationCircleIcon
                      className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    />
                    <p className="ml-3 text-sm text-gray-500">{alert.message}</p>
                  </div>
                  {alert.actionUrl && (
                    <a
                      href={alert.actionUrl}
                      className="ml-6 text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      {t('view')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;