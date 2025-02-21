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

const RentCollectionList = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/rent-payments?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Typography variant="h4">Rent Collection</Typography>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/rent/collect'}
            >
              <PlusIcon className="h-4 w-4" />
              Collect Rent
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="month"
              label="Month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Input
              label="Search Tenant/Room"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </CardHeader>

        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 p-4">Room</th>
                  <th className="border-b border-gray-200 p-4">Tenant</th>
                  <th className="border-b border-gray-200 p-4">Amount</th>
                  <th className="border-b border-gray-200 p-4">Due Date</th>
                  <th className="border-b border-gray-200 p-4">Status</th>
                  <th className="border-b border-gray-200 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="p-4">Room {payment.room.roomNumber}</td>
                    <td className="p-4">{payment.tenant.name}</td>
                    <td className="p-4">₹{payment.amount}</td>
                    <td className="p-4">{new Date(payment.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        color="blue"
                        size="sm"
                        onClick={() => window.location.href = `/rent/collect/${payment._id}`}
                      >
                        {payment.status === 'paid' ? 'View' : 'Collect'}
                      </Button>
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

export default RentCollectionList; 