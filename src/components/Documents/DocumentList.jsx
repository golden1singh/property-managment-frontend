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
import { 
  PlusIcon, 
  DocumentIcon,
  EyeIcon,
  DownloadIcon 
} from '@heroicons/react/24/outline';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Typography variant="h4">Documents</Typography>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/documents/upload'}
            >
              <PlusIcon className="h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Document Type"
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
            >
              <option value="all">All Types</option>
              <option value="lease_agreement">Lease Agreement</option>
              <option value="id_proof">ID Proof</option>
              <option value="address_proof">Address Proof</option>
              <option value="police_verification">Police Verification</option>
              <option value="other">Other</option>
            </Select>
            <Select
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending_verification">Pending Verification</option>
            </Select>
            <Input
              label="Search Documents"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </CardHeader>

        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <DocumentIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <Typography variant="h6">{doc.title}</Typography>
                      <Typography variant="small" color="gray">
                        {doc.tenant.name} - Room {doc.tenant.currentRoom?.roomNumber}
                      </Typography>
                      <Typography variant="small" color="gray" className="mt-1">
                        Type: <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      </Typography>
                      {doc.expiryDate && (
                        <Typography variant="small" color="gray">
                          Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                    {doc.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    color="green"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.location.href = doc.fileUrl}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentList; 