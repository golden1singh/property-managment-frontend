import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
} from "@material-tailwind/react";
import { PlusIcon } from '@heroicons/react/24/outline';

const MaintenanceList = () => {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/maintenance?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Typography variant="h4">Maintenance Requests</Typography>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/maintenance/new'}
            >
              <PlusIcon className="h-4 w-4" />
              New Request
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(value) => setFilters({ ...filters, priority: value })}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </Select>
            <Input
              label="Search Room/Issue"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h6">
                      Room {request.room.roomNumber} - {request.issue}
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                      Reported by: {request.tenant.name} on {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography className="mt-2">{request.description}</Typography>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                {request.assignedTo && (
                  <div className="mt-4 pt-4 border-t">
                    <Typography variant="small" color="gray">
                      Assigned to: {request.assignedTo.name}
                    </Typography>
                    {request.estimatedCost && (
                      <Typography variant="small" color="gray">
                        Estimated Cost: ₹{request.estimatedCost}
                      </Typography>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    color="blue"
                    size="sm"
                    onClick={() => window.location.href = `/maintenance/${request._id}`}
                  >
                    View Details
                  </Button>
                  {request.status === 'pending' && (
                    <Button
                      color="green"
                      size="sm"
                      onClick={() => window.location.href = `/maintenance/${request._id}/assign`}
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MaintenanceList; 