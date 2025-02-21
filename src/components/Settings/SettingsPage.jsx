import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Switch,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      email: '',
      phone: '',
      address: '',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'Asia/Kolkata'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      rentReminders: true,
      maintenanceAlerts: true,
      documentExpiry: true,
      paymentReceipts: true
    },
    billing: {
      rentDueDay: 5,
      lateFeeAmount: 0,
      gracePeriod: 5,
      securityDepositMonths: 2,
      utilityBillGeneration: 'manual'
    },
    maintenance: {
      allowTenantRequests: true,
      autoAssignment: false,
      priorityLevels: ['low', 'medium', 'high', 'emergency'],
      defaultPriority: 'medium'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h4">Settings</Typography>
        </CardHeader>

        <CardBody>
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
            <TabsHeader>
              <Tab value="general">General</Tab>
              <Tab value="notifications">Notifications</Tab>
              <Tab value="billing">Billing</Tab>
              <Tab value="maintenance">Maintenance</Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, companyName: e.target.value }
                    })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value }
                    })}
                  />
                  <Input
                    label="Phone"
                    value={settings.general.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, phone: e.target.value }
                    })}
                  />
                  <Input
                    label="Address"
                    value={settings.general.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, address: e.target.value }
                    })}
                  />
                  <Select
                    label="Currency"
                    value={settings.general.currency}
                    onChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, currency: value }
                    })}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </Select>
                  <Select
                    label="Date Format"
                    value={settings.general.dateFormat}
                    onChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, dateFormat: value }
                    })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>
                </div>
              </TabPanel>

              <TabPanel value="notifications">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography>Email Notifications</Typography>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailNotifications: e.target.checked
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography>SMS Notifications</Typography>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          smsNotifications: e.target.checked
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography>Rent Reminders</Typography>
                    <Switch
                      checked={settings.notifications.rentReminders}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          rentReminders: e.target.checked
                        }
                      })}
                    />
                  </div>
                  {/* Add more notification settings */}
                </div>
              </TabPanel>

              <TabPanel value="billing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Rent Due Day"
                    type="number"
                    min="1"
                    max="31"
                    value={settings.billing.rentDueDay}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, rentDueDay: parseInt(e.target.value) }
                    })}
                  />
                  <Input
                    label="Late Fee Amount"
                    type="number"
                    value={settings.billing.lateFeeAmount}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, lateFeeAmount: parseFloat(e.target.value) }
                    })}
                  />
                  <Input
                    label="Grace Period (days)"
                    type="number"
                    value={settings.billing.gracePeriod}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, gracePeriod: parseInt(e.target.value) }
                    })}
                  />
                  <Select
                    label="Utility Bill Generation"
                    value={settings.billing.utilityBillGeneration}
                    onChange={(value) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, utilityBillGeneration: value }
                    })}
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </Select>
                </div>
              </TabPanel>

              <TabPanel value="maintenance">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography>Allow Tenant Requests</Typography>
                    <Switch
                      checked={settings.maintenance.allowTenantRequests}
                      onChange={(e) => setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          allowTenantRequests: e.target.checked
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography>Auto Assignment</Typography>
                    <Switch
                      checked={settings.maintenance.autoAssignment}
                      onChange={(e) => setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          autoAssignment: e.target.checked
                        }
                      })}
                    />
                  </div>
                  <Select
                    label="Default Priority"
                    value={settings.maintenance.defaultPriority}
                    onChange={(value) => setSettings({
                      ...settings,
                      maintenance: {
                        ...settings.maintenance,
                        defaultPriority: value
                      }
                    })}
                  >
                    {settings.maintenance.priorityLevels.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button
              color="blue"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage; 