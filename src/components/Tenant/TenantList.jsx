import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  Badge
} from '@material-tailwind/react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const TenantList = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchTenants();
  }, [filters]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants?' + new URLSearchParams(filters));
      const data = await response.json();
      setTenants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'notice_period': return 'yellow';
      case 'inactive': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tenants</h2>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => navigate('/tenants/new')}
            >
              <PlusIcon className="h-4 w-4" />
              Add New Tenant
            </Button>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="notice_period">Notice Period</option>
              <option value="inactive">Inactive</option>
            </Select>
            <Select
              label="Sort By"
              value={filters.sortBy}
              onChange={(value) => setFilters({ ...filters, sortBy: value })}
            >
              <option value="name">Name</option>
              <option value="room">Room Number</option>
              <option value="date">Join Date</option>
            </Select>
          </div>
        </CardHeader>

        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 p-4">Name</th>
                  <th className="border-b border-gray-200 p-4">Room</th>
                  <th className="border-b border-gray-200 p-4">Contact</th>
                  <th className="border-b border-gray-200 p-4">Rent</th>
                  <th className="border-b border-gray-200 p-4">Status</th>
                  <th className="border-b border-gray-200 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tenant.profileImage || '/default-avatar.png'}
                          alt={tenant.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{tenant.name}</p>
                          <p className="text-sm text-gray-600">
                            Since {new Date(tenant.leaseStartDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">Room {tenant.currentRoom?.roomNumber}</p>
                      <p className="text-sm text-gray-600">{tenant.currentRoom?.type}</p>
                    </td>
                    <td className="p-4">
                      <p>{tenant.phone}</p>
                      <p className="text-sm text-gray-600">{tenant.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">₹{tenant.rentAmount}</p>
                      <p className="text-sm text-gray-600">Due: 5th</p>
                    </td>
                    <td className="p-4">
                      <Badge color={getStatusColor(tenant.status)}>
                        {tenant.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          color="blue"
                          size="sm"
                          onClick={() => navigate(`/tenants/${tenant._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          color="green"
                          size="sm"
                          onClick={() => navigate(`/tenants/${tenant._id}/payments`)}
                        >
                          Payments
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TenantList; 