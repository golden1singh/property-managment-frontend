import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  Textarea
} from '@material-tailwind/react';
import { toast } from 'react-toastify';

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    idProof: {
      type: '',
      number: ''
    },
    currentRoom: '',
    rentAmount: '',
    securityDeposit: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentDueDate: 5
  });

  useEffect(() => {
    fetchRooms();
    if (id) {
      fetchTenantData();
    }
  }, [id]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms?status=vacant');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch available rooms');
    }
  };

  const fetchTenantData = async () => {
    try {
      const response = await fetch(`/api/tenants/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching tenant:', error);
      toast.error('Failed to fetch tenant details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/tenants/${id}` : '/api/tenants';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save tenant');
      }

      toast.success(`Tenant ${id ? 'updated' : 'added'} successfully`);
      navigate('/tenants');
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <h2 className="text-2xl font-bold">
            {id ? 'Edit Tenant' : 'Add New Tenant'}
          </h2>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Select
                label="ID Proof Type"
                value={formData.idProof.type}
                onChange={(value) => setFormData({
                  ...formData,
                  idProof: { ...formData.idProof, type: value }
                })}
                required
              >
                <option value="Aadhar">Aadhar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
              </Select>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Emergency Contact Name"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                required
              />
              <Input
                label="Emergency Contact Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                required
              />
              <Input
                label="Relation"
                value={formData.emergencyContact.relation}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                })}
                required
              />
            </div>

            {/* Room and Lease Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Room"
                value={formData.currentRoom}
                onChange={(value) => setFormData({ ...formData, currentRoom: value })}
                required
              >
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} - {room.type}
                  </option>
                ))}
              </Select>
              <Input
                label="Rent Amount"
                type="number"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                required
              />
              <Input
                label="Security Deposit"
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                required
              />
              <Input
                label="Rent Due Date"
                type="number"
                min="1"
                max="31"
                value={formData.rentDueDate}
                onChange={(e) => setFormData({ ...formData, rentDueDate: e.target.value })}
                required
              />
              <Input
                label="Lease Start Date"
                type="date"
                value={formData.leaseStartDate}
                onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                required
              />
              <Input
                label="Lease End Date"
                type="date"
                value={formData.leaseEndDate}
                onChange={(e) => setFormData({ ...formData, leaseEndDate: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                color="gray"
                onClick={() => navigate('/tenants')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update Tenant' : 'Add Tenant')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default TenantForm; 