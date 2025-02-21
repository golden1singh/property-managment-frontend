import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    tenant: '',
    type: '',
    title: '',
    expiryDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants?status=active');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        title: file.name.split('.')[0] // Set default title as filename
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      navigate('/documents');
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h4">Upload Document</Typography>
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
                label="Document Type"
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <option value="lease_agreement">Lease Agreement</option>
                <option value="id_proof">ID Proof</option>
                <option value="address_proof">Address Proof</option>
                <option value="police_verification">Police Verification</option>
                <option value="other">Other</option>
              </Select>

              <Input
                label="Document Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />

              <div className="md:col-span-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <CloudArrowUpIcon className="h-12 w-12 text-blue-500" />
                    <Typography variant="h6" color="blue-gray" className="mt-2">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="small" color="gray">
                      PDF, DOC, DOCX, JPG, JPEG, PNG (max. 10MB)
                    </Typography>
                  </label>
                  {selectedFile && (
                    <Typography variant="small" color="green" className="mt-2">
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </div>
              </div>

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
                onClick={() => navigate('/documents')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading || !selectedFile}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentUpload; 