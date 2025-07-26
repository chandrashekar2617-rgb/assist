import { VehicleServiceRecord, ServiceRecommendation, MaintenanceSchedule, CostEstimate } from '../types';
import { format, addMonths, addDays, differenceInDays, differenceInMonths } from 'date-fns';

// Service intervals based on vehicle type and service
const SERVICE_INTERVALS = {
  'Oil Change': { months: 6, miles: 5000 },
  'Brake Inspection': { months: 12, miles: 15000 },
  'Tire Rotation': { months: 6, miles: 7500 },
  'Air Filter': { months: 12, miles: 12000 },
  'Transmission Service': { months: 24, miles: 30000 },
  'Coolant Flush': { months: 24, miles: 30000 },
  'Spark Plugs': { months: 36, miles: 30000 },
  'Timing Belt': { months: 60, miles: 60000 },
  'Major Service': { months: 12, miles: 12000 },
  'Minor Service': { months: 6, miles: 6000 }
};

// Base costs for different services
const SERVICE_COSTS = {
  'Oil Change': { compact: 50, sedan: 60, suv: 70, truck: 80, luxury: 100 },
  'Brake Inspection': { compact: 80, sedan: 100, suv: 120, truck: 140, luxury: 180 },
  'Tire Rotation': { compact: 30, sedan: 35, suv: 40, truck: 45, luxury: 60 },
  'Air Filter': { compact: 25, sedan: 30, suv: 35, truck: 40, luxury: 50 },
  'Transmission Service': { compact: 150, sedan: 180, suv: 220, truck: 250, luxury: 350 },
  'Coolant Flush': { compact: 100, sedan: 120, suv: 140, truck: 160, luxury: 200 },
  'Spark Plugs': { compact: 120, sedan: 150, suv: 180, truck: 200, luxury: 300 },
  'Timing Belt': { compact: 400, sedan: 500, suv: 600, truck: 700, luxury: 1000 },
  'Major Service': { compact: 300, sedan: 400, suv: 500, truck: 600, luxury: 800 },
  'Minor Service': { compact: 150, sedan: 200, suv: 250, truck: 300, luxury: 400 }
};

// Determine vehicle category based on model
export const getVehicleCategory = (vehicleModel: string): 'compact' | 'sedan' | 'suv' | 'truck' | 'luxury' => {
  const model = vehicleModel.toLowerCase();
  
  if (model.includes('bmw') || model.includes('mercedes') || model.includes('audi') || 
      model.includes('lexus') || model.includes('porsche') || model.includes('jaguar')) {
    return 'luxury';
  }
  
  if (model.includes('f-150') || model.includes('silverado') || model.includes('ram') ||
      model.includes('truck') || model.includes('pickup')) {
    return 'truck';
  }
  
  if (model.includes('suv') || model.includes('escape') || model.includes('explorer') ||
      model.includes('tahoe') || model.includes('suburban') || model.includes('crv') ||
      model.includes('rav4') || model.includes('highlander')) {
    return 'suv';
  }
  
  if (model.includes('corolla') || model.includes('civic') || model.includes('focus') ||
      model.includes('yaris') || model.includes('versa') || model.includes('spark')) {
    return 'compact';
  }
  
  return 'sedan'; // Default
};

// Generate service recommendations based on service history
export const generateServiceRecommendations = (
  records: VehicleServiceRecord[], 
  vehicleModel: string, 
  registrationNo: string,
  currentMileage: number
): ServiceRecommendation[] => {
  const vehicleRecords = records.filter(r => 
    r.vehicleModel === vehicleModel && r.registrationNo === registrationNo
  );
  
  const recommendations: ServiceRecommendation[] = [];
  const now = new Date();
  
  Object.entries(SERVICE_INTERVALS).forEach(([serviceType, interval]) => {
    const lastService = vehicleRecords
      .filter(r => r.serviceType === serviceType)
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())[0];
    
    let isNeeded = false;
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'low';
    let reason = '';
    let dueDate = new Date();
    
    if (!lastService) {
      // Never had this service
      isNeeded = true;
      priority = 'medium';
      reason = `No record of ${serviceType} for this vehicle`;
      dueDate = addDays(now, 7);
    } else {
      const lastServiceDate = new Date(lastService.serviceDate);
      const monthsSinceService = differenceInMonths(now, lastServiceDate);
      const milesSinceService = currentMileage - lastService.mileage;
      
      // Check if due by time
      if (monthsSinceService >= interval.months) {
        isNeeded = true;
        if (monthsSinceService >= interval.months + 3) {
          priority = 'urgent';
          reason = `${serviceType} is ${monthsSinceService - interval.months} months overdue`;
        } else {
          priority = 'high';
          reason = `${serviceType} is due (last done ${monthsSinceService} months ago)`;
        }
        dueDate = now;
      }
      // Check if due by mileage
      else if (milesSinceService >= interval.miles) {
        isNeeded = true;
        if (milesSinceService >= interval.miles + 2000) {
          priority = 'urgent';
          reason = `${serviceType} is ${milesSinceService - interval.miles} miles overdue`;
        } else {
          priority = 'high';
          reason = `${serviceType} is due (${milesSinceService} miles since last service)`;
        }
        dueDate = now;
      }
      // Check if approaching due date
      else if (monthsSinceService >= interval.months - 1 || milesSinceService >= interval.miles - 1000) {
        isNeeded = true;
        priority = 'low';
        reason = `${serviceType} will be due soon`;
        dueDate = addMonths(lastServiceDate, interval.months);
      }
    }
    
    if (isNeeded) {
      const vehicleCategory = getVehicleCategory(vehicleModel);
      const estimatedCost = SERVICE_COSTS[serviceType as keyof typeof SERVICE_COSTS]?.[vehicleCategory] || 100;
      
      recommendations.push({
        id: `${registrationNo}-${serviceType}-${Date.now()}`,
        vehicleModel,
        registrationNo,
        recommendedService: serviceType,
        priority,
        reason,
        estimatedCost,
        dueDate,
        lastServiceDate: lastService?.serviceDate ? new Date(lastService.serviceDate) : undefined,
        mileageBased: true,
        currentMileage,
        createdAt: now
      });
    }
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Generate cost estimate for a service
export const generateCostEstimate = (
  serviceType: string, 
  vehicleModel: string
): CostEstimate => {
  const vehicleCategory = getVehicleCategory(vehicleModel);
  const baseCost = SERVICE_COSTS[serviceType as keyof typeof SERVICE_COSTS]?.[vehicleCategory] || 100;
  
  // Calculate labor hours based on service type
  const laborHours = {
    'Oil Change': 0.5,
    'Brake Inspection': 1,
    'Tire Rotation': 0.5,
    'Air Filter': 0.25,
    'Transmission Service': 2,
    'Coolant Flush': 1.5,
    'Spark Plugs': 2,
    'Timing Belt': 6,
    'Major Service': 4,
    'Minor Service': 2
  }[serviceType] || 1;
  
  // Estimate parts required
  const partsRequired = {
    'Oil Change': ['Engine Oil', 'Oil Filter'],
    'Brake Inspection': ['Brake Pads (if needed)', 'Brake Fluid'],
    'Tire Rotation': [],
    'Air Filter': ['Air Filter'],
    'Transmission Service': ['Transmission Fluid', 'Filter'],
    'Coolant Flush': ['Coolant', 'Thermostat (if needed)'],
    'Spark Plugs': ['Spark Plugs', 'Ignition Coils (if needed)'],
    'Timing Belt': ['Timing Belt', 'Water Pump', 'Tensioners'],
    'Major Service': ['Various filters', 'Fluids', 'Belts'],
    'Minor Service': ['Oil', 'Filter', 'Fluids check']
  }[serviceType] || ['Standard parts'];
  
  return {
    serviceType,
    basePrice: baseCost,
    laborHours,
    partsRequired,
    estimatedTotal: baseCost,
    vehicleCategory
  };
};

// Create maintenance schedule based on recommendations
export const createMaintenanceSchedule = (
  recommendations: ServiceRecommendation[]
): MaintenanceSchedule[] => {
  return recommendations.map(rec => ({
    id: `schedule-${rec.id}`,
    vehicleModel: rec.vehicleModel,
    registrationNo: rec.registrationNo,
    serviceType: rec.recommendedService,
    scheduledDate: rec.dueDate,
    estimatedCost: rec.estimatedCost,
    status: 'scheduled' as const,
    reminderSent: false,
    notes: rec.reason,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

// AI Assistant responses for common queries
export const getAssistantResponse = (message: string, context?: any): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('estimate')) {
    return "I can help you estimate service costs! Please specify the service type and vehicle model. For example, 'Oil change for Honda Civic' or 'Brake inspection for Toyota Camry'.";
  }
  
  if (lowerMessage.includes('when') && (lowerMessage.includes('service') || lowerMessage.includes('maintenance'))) {
    return "To determine when your vehicle needs service, I'll need to know:\n1. Vehicle model and registration\n2. Current mileage\n3. Last service date and type\n\nI can then provide personalized maintenance recommendations based on your service history.";
  }
  
  if (lowerMessage.includes('oil change')) {
    return "Oil changes are typically needed every 5,000-7,500 miles or 6 months, whichever comes first. The cost varies by vehicle:\n• Compact cars: $50-60\n• Sedans: $60-70\n• SUVs: $70-80\n• Trucks: $80-90\n• Luxury vehicles: $100+";
  }
  
  if (lowerMessage.includes('brake')) {
    return "Brake inspections are recommended every 12 months or 15,000 miles. Signs you may need brake service:\n• Squealing or grinding noises\n• Vibration when braking\n• Brake pedal feels soft or spongy\n• Dashboard warning light\n\nCosts typically range from $80-180 depending on your vehicle type.";
  }
  
  if (lowerMessage.includes('tire')) {
    return "Tire rotation should be done every 6 months or 7,500 miles to ensure even wear. This typically costs $30-60. Also check your tire pressure monthly and inspect for wear patterns, cracks, or punctures.";
  }
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
    return "To schedule a service appointment, I recommend:\n1. Check your service recommendations first\n2. Choose a convenient date\n3. Get a cost estimate\n4. Book through your preferred workshop\n\nWould you like me to generate recommendations for your vehicle?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm your ASSIST virtual assistant. I can help you with:\n\n• Service cost estimates\n• Maintenance scheduling recommendations\n• Service interval guidance\n• Vehicle care tips\n• Appointment planning\n\nWhat would you like assistance with today?";
  }
  
  return "I'm here to help with vehicle service questions! You can ask me about:\n• Service costs and estimates\n• When your vehicle needs maintenance\n• Service intervals and recommendations\n• Scheduling appointments\n• General vehicle care advice\n\nWhat specific question do you have?";
};

// Check if a vehicle needs urgent attention
export const checkUrgentNeeds = (records: VehicleServiceRecord[]): string[] => {
  const warnings: string[] = [];
  const now = new Date();
  
  // Group records by vehicle
  const vehicleGroups = records.reduce((acc, record) => {
    const key = `${record.vehicleModel}-${record.registrationNo}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {} as Record<string, VehicleServiceRecord[]>);
  
  Object.entries(vehicleGroups).forEach(([vehicle, vehicleRecords]) => {
    const lastOilChange = vehicleRecords
      .filter(r => r.serviceType === 'Oil Change')
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())[0];
    
    if (lastOilChange) {
      const monthsSince = differenceInMonths(now, new Date(lastOilChange.serviceDate));
      if (monthsSince > 8) {
        warnings.push(`${vehicle}: Oil change is ${monthsSince - 6} months overdue!`);
      }
    } else {
      warnings.push(`${vehicle}: No oil change record found - immediate attention needed!`);
    }
  });
  
  return warnings;
};