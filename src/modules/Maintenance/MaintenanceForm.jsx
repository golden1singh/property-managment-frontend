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

const MaintenanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: '',
    issue: '',
    description: '',
    priority: 'medium',
    images: [],
    estimatedCost: '',
    assignedTo: '',
    notes: ''
  });

  useEffect(() => {
    fetchRooms();
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(`/api/maintenance/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/maintenance/${id}` : '/api/maintenance';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save maintenance request');
      }

      navigate('/maintenance');
    } catch (error) {
      console.error('Error saving maintenance request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h4">
            {id ? 'Edit Maintenance Request' : 'New Maintenance Request'}
          </Typography>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Room"
                value={formData.room}
                onChange={(value) => setFormData({ ...formData, room: value })}
                required
              >
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </Select>

              <Input
                label="Issue Title"
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                required
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(value) => setFormData({ ...formData, priority: value })}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </Select>

              <Input
                label="Estimated Cost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  type="file"
                  label="Upload Images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Additional Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                color="gray"
                onClick={() => navigate('/maintenance')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update Request' : 'Submit Request')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default MaintenanceForm; 