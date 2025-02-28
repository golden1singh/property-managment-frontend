import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Textarea,
} from "@material-tailwind/react";

const UtilityBillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    tenant: '',
    room: '',
    type: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7),
    dueDate: '',
    readings: {
      previous: '',
      current: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchTenants();
    if (id) {
      fetchBillDetails();
    }
  }, [id]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants?status=active');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchBillDetails = async () => {
    try {
      const response = await fetch(`/api/utility-bills/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/utility-bills/${id}` : '/api/utility-bills';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save utility bill');
      }

      navigate('/utilities');
    } catch (error) {
      console.error('Error saving utility bill:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h4">
            {id ? 'Edit Utility Bill' : 'Generate Utility Bill'}
          </Typography>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tenant"
                value={formData.tenant}
                onChange={(value) => setFormData({ ...formData, tenant: value })}
                required
              >
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.name} - Room {tenant.currentRoom?.roomNumber}
                  </option>
                ))}
              </Select>

              <Select
                label="Utility Type"
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="gas">Gas</option>
                <option value="internet">Internet</option>
              </Select>

              <Input
                type="month"
                label="Bill Month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              />

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />

              <Input
                label="Previous Reading"
                type="number"
                value={formData.readings.previous}
                onChange={(e) => setFormData({
                  ...formData,
                  readings: { ...formData.readings, previous: e.target.value }
                })}
              />

              <Input
                label="Current Reading"
                type="number"
                value={formData.readings.current}
                onChange={(e) => setFormData({
                  ...formData,
                  readings: { ...formData.readings, current: e.target.value }
                })}
              />

              <Input
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                color="gray"
                onClick={() => navigate('/utilities')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update Bill' : 'Generate Bill')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UtilityBillForm; 