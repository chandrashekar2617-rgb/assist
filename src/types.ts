export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  workshopName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleServiceRecord {
  id: string;
  vehicleModel: string;
  registrationNo: string;
  customerName: string;
  serviceType: string;
  serviceDate: string;
  mileage: number;
  description: string;
  cost: number;
  workshopName: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleModel: string;
  registrationNo: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  workshopName: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}