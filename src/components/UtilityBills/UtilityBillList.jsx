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

const UtilityBillList = () => {
  const [bills, setBills] = useState([]);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    type: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchBills();
  }, [filters]);

  const fetchBills = async () => {
    try {
      const response = await fetch(`/api/utility-bills?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Typography variant="h4">Utility Bills</Typography>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/utilities/new'}
            >
              <PlusIcon className="h-4 w-4" />
              Generate Bill
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="month"
              label="Month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            />
            <Select
              label="Type"
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
            >
              <option value="all">All Types</option>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="gas">Gas</option>
              <option value="internet">Internet</option>
            </Select>
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
              label="Search Room/Tenant"
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
                  <th className="border-b border-gray-200 p-4">Type</th>
                  <th className="border-b border-gray-200 p-4">Amount</th>
                  <th className="border-b border-gray-200 p-4">Due Date</th>
                  <th className="border-b border-gray-200 p-4">Status</th>
                  <th className="border-b border-gray-200 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="p-4">Room {bill.room.roomNumber}</td>
                    <td className="p-4">{bill.tenant.name}</td>
                    <td className="p-4">
                      <span className="capitalize">{bill.type}</span>
                    </td>
                    <td className="p-4">₹{bill.amount}</td>
                    <td className="p-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          color="blue"
                          size="sm"
                          onClick={() => window.location.href = `/utilities/${bill._id}`}
                        >
                          View
                        </Button>
                        {bill.status !== 'paid' && (
                          <Button
                            color="green"
                            size="sm"
                            onClick={() => window.location.href = `/utilities/${bill._id}/pay`}
                          >
                            Pay
                          </Button>
                        )}
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

export default UtilityBillList; 