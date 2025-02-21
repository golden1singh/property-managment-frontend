import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
} from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [timeframe]);

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports?timeframe=${timeframe}`);
      const data = await response.json();
      
      setRevenueData(data.revenue);
      setOccupancyData(data.occupancy);
      setMaintenanceData(data.maintenance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Overview'
      }
    }
  };

  const occupancyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Occupancy Rate'
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Reports & Analytics</Typography>
        <div className="flex gap-4">
          <Select
            value={timeframe}
            onChange={(value) => setTimeframe(value)}
            className="w-40"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </Select>
          <Button
            color="blue"
            onClick={() => window.print()}
          >
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Total Revenue
            </Typography>
            <Typography variant="h4">
              ₹{revenueData?.total.toLocaleString()}
            </Typography>
            <Typography variant="small" color="gray">
              {revenueData?.percentageChange}% from previous period
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Current Occupancy
            </Typography>
            <Typography variant="h4">
              {occupancyData?.currentRate}%
            </Typography>
            <Typography variant="small" color="gray">
              {occupancyData?.totalOccupied} out of {occupancyData?.totalRooms} rooms
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Maintenance Expenses
            </Typography>
            <Typography variant="h4">
              ₹{maintenanceData?.total.toLocaleString()}
            </Typography>
            <Typography variant="small" color="gray">
              {maintenanceData?.pendingRequests} pending requests
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardBody>
            {revenueData && (
              <Line
                data={revenueData.chartData}
                options={revenueChartOptions}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            {occupancyData && (
              <Bar
                data={occupancyData.chartData}
                options={occupancyChartOptions}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4">
            <Typography variant="h6">Revenue Distribution</Typography>
          </CardHeader>
          <CardBody>
            {revenueData && (
              <Doughnut
                data={revenueData.distributionData}
                options={{
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <Typography variant="h6">Maintenance Categories</Typography>
          </CardHeader>
          <CardBody>
            {maintenanceData && (
              <Doughnut
                data={maintenanceData.categoryData}
                options={{
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ReportsDashboard; 