import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Typography,
} from "@material-tailwind/react";
import { 
  UserIcon, 
  CurrencyRupeeIcon, 
  HomeIcon,
  WrenchIcon 
} from '@heroicons/react/24/outline';

// Define StatCard component
const StatCard = ({ title, value, icon, change }) => {
  return (
    <Card className="shadow-lg">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {title}
            </Typography>
            <Typography variant="h4" color="blue-gray" className="font-bold">
              {value}
            </Typography>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <Typography
            variant="small"
            className={`font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </Typography>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal ml-2"
          >
            from last month
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

const TenantDashboard = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalRevenue: 0,
    occupiedRooms: 0,
    pendingMaintenance: 0,
    tenantChange: 0,
    revenueChange: 0,
    occupancyChange: 0,
    maintenanceChange: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setRecentActivities(data.recentActivities);
      setPendingTasks(data.pendingTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon={<UserIcon className="h-6 w-6" />}
          change={stats.tenantChange}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<CurrencyRupeeIcon className="h-6 w-6" />}
          change={stats.revenueChange}
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon={<HomeIcon className="h-6 w-6" />}
          change={stats.occupancyChange}
        />
        <StatCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon={<WrenchIcon className="h-6 w-6" />}
          change={stats.maintenanceChange}
        />
      </div>

      {/* Recent Activities & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            color="blue"
            className="mb-4 p-4"
          >
            <Typography variant="h5" color="white">
              Recent Activities
            </Typography>
          </CardHeader>
          <CardBody>
            {recentActivities.map((activity, index) => (
              <div key={index} className="mb-4 p-4 border-b">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {activity.type}
                </Typography>
                <Typography>{activity.description}</Typography>
                <Typography variant="small" color="gray">
                  {activity.timestamp}
                </Typography>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            color="blue"
            className="mb-4 p-4"
          >
            <Typography variant="h5" color="white">
              Pending Tasks
            </Typography>
          </CardHeader>
          <CardBody>
            {pendingTasks.map((task, index) => (
              <div key={index} className="mb-4 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {task.priority}
                    </Typography>
                    <Typography>{task.description}</Typography>
                  </div>
                  <Button color="blue" size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard; 