export const initialFormData = {
  // Personal Information
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  photo: null,

  // Emergency Contact
  emergencyContact: '',
  emergencyPhone: '',
  emergencyRelation: '',

  // Employment Details
  occupation: '',
  employer: '',
  monthlyIncome: '',

  // Room & Lease Details
  roomNumber: '',
  rentAmount: '',
  depositAmount: '',
  moveInDate: '',
  leaseLength: '12', // Default to 12 months
  leaseStartDate: '',
  leaseEndDate: '',

  // ID Proof Details
  idProofType: 'Aadhar', // Default value
  idProofNumber: '',

  // Additional Documents
  documents: [],

  // Plot Details
  plotNumber: '',
};

// Field validation requirements
export const fieldRequirements = {
  firstName: { required: true },
  lastName: { required: true },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  emergencyContact: { required: true },
  emergencyPhone: { required: true, type: 'phone' },
  occupation: { required: true },
  employer: { required: true },
  monthlyIncome: { required: true, type: 'number' },
  roomNumber: { required: true },
  rentAmount: { required: true, type: 'number' },
  depositAmount: { required: true, type: 'number' },
  moveInDate: { required: true, type: 'date' },
  leaseLength: { required: true },
  idProofType: { required: true },
  idProofNumber: { required: true },
};

// Form sections configuration
export const formSections = [
  {
    id: 'personal',
    title: 'personalInformation',
    icon: 'UserIcon',
    fields: ['firstName', 'lastName', 'email', 'phone', 'photo']
  },
  {
    id: 'emergency',
    title: 'emergencyContact',
    icon: 'PhoneIcon',
    fields: ['emergencyContact', 'emergencyPhone', 'emergencyRelation']
  },
  {
    id: 'employment',
    title: 'employmentDetails',
    icon: 'BuildingOfficeIcon',
    fields: ['occupation', 'employer', 'monthlyIncome']
  },
  {
    id: 'lease',
    title: 'roomAndLeaseDetails',
    icon: 'HomeIcon',
    fields: ['roomNumber', 'rentAmount', 'depositAmount', 'moveInDate', 'leaseLength']
  },
  {
    id: 'idProof',
    title: 'idProofDetails',
    icon: 'IdentificationIcon',
    fields: ['idProofType', 'idProofNumber']
  }
];

// Select field options
export const selectOptions = {
  idProofType: [
    { value: 'Aadhar', label: 'idTypes.aadhar' },
    { value: 'PAN', label: 'idTypes.pan' },
    { value: 'Driving', label: 'idTypes.driving' },
    { value: 'Passport', label: 'idTypes.passport' }
  ],
  leaseLength: [
    { value: '6', label: 'leaseDurations.6' },
    { value: '12', label: 'leaseDurations.12' },
    { value: '24', label: 'leaseDurations.24' }
  ]
}; 