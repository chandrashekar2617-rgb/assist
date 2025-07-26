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

// New types for ASSIST functionality
export interface AssistMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  context?: {
    vehicleModel?: string;
    registrationNo?: string;
    serviceType?: string;
  };
}

export interface ServiceRecommendation {
  id: string;
  vehicleModel: string;
  registrationNo: string;
  recommendedService: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  estimatedCost: number;
  dueDate: Date;
  lastServiceDate?: Date;
  mileageBased: boolean;
  currentMileage?: number;
  createdAt: Date;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleModel: string;
  registrationNo: string;
  serviceType: string;
  scheduledDate: Date;
  estimatedCost: number;
  status: 'scheduled' | 'reminded' | 'completed' | 'overdue';
  reminderSent: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostEstimate {
  serviceType: string;
  basePrice: number;
  laborHours: number;
  partsRequired: string[];
  estimatedTotal: number;
  vehicleCategory: 'compact' | 'sedan' | 'suv' | 'truck' | 'luxury';
}