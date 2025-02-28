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

const RentCollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenant: '',
    room: '',
    amount: '',
    paymentMethod: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/rent-payments/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rent-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      navigate('/rent');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h4">Collect Rent</Typography>
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
                {/* Tenant options will be populated from API */}
              </Select>

              <Input
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                required
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </Select>

              <Input
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />

              <Input
                label="Transaction ID"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
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
                onClick={() => navigate('/rent')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Collect Payment'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RentCollectionForm; 