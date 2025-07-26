import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, Wrench, Info } from 'lucide-react';
import { CostEstimate } from '../types';
import { generateCostEstimate, getVehicleCategory } from '../utils/assistUtils';

const CostEstimator: React.FC = () => {
  const [vehicleModel, setVehicleModel] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);

  const serviceTypes = [
    'Oil Change',
    'Brake Inspection',
    'Tire Rotation',
    'Air Filter',
    'Transmission Service',
    'Coolant Flush',
    'Spark Plugs',
    'Timing Belt',
    'Major Service',
    'Minor Service'
  ];

  const handleGenerateEstimate = () => {
    if (!vehicleModel || !serviceType) return;
    
    const newEstimate = generateCostEstimate(serviceType, vehicleModel);
    setEstimate(newEstimate);
  };

  const getServiceDescription = (service: string) => {
    const descriptions = {
      'Oil Change': 'Regular engine oil and filter replacement to maintain engine health',
      'Brake Inspection': 'Comprehensive brake system check including pads, rotors, and fluid',
      'Tire Rotation': 'Moving tires to different positions to ensure even wear',
      'Air Filter': 'Engine air filter replacement for optimal air flow and performance',
      'Transmission Service': 'Transmission fluid and filter replacement',
      'Coolant Flush': 'Complete cooling system flush and refill',
      'Spark Plugs': 'Spark plug replacement for optimal engine performance',
      'Timing Belt': 'Critical timing belt replacement (major service)',
      'Major Service': 'Comprehensive vehicle inspection and maintenance',
      'Minor Service': 'Basic maintenance and safety checks'
    };
    return descriptions[service as keyof typeof descriptions] || 'Professional automotive service';
  };

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      compact: 'Small, fuel-efficient vehicles (e.g., Honda Civic, Toyota Corolla)',
      sedan: 'Mid-size passenger cars (e.g., Honda Accord, Toyota Camry)',
      suv: 'Sport Utility Vehicles (e.g., Honda CR-V, Toyota RAV4)',
      truck: 'Pickup trucks and commercial vehicles (e.g., Ford F-150)',
      luxury: 'Premium and luxury vehicles (e.g., BMW, Mercedes-Benz, Audi)'
    };
    return descriptions[category as keyof typeof descriptions] || '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cost Estimator</h2>
          <p className="text-gray-600">Get instant service cost estimates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model
            </label>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="e.g., Honda Civic, Toyota Camry, BMW 3 Series"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your vehicle make and model for accurate pricing
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a service...</option>
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {serviceType && (
              <p className="text-xs text-gray-500 mt-1">
                {getServiceDescription(serviceType)}
              </p>
            )}
          </div>

          <button
            onClick={handleGenerateEstimate}
            disabled={!vehicleModel || !serviceType}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Generate Estimate</span>
          </button>
        </div>

        {/* Results Section */}
        <div>
          {estimate ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Cost Estimate</h3>
                </div>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  ${estimate.estimatedTotal}
                </div>
                <p className="text-sm text-green-600">
                  For {estimate.serviceType} on {vehicleModel}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Vehicle Category</span>
                  <span className="font-medium capitalize">{estimate.vehicleCategory}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Labor Hours
                  </span>
                  <span className="font-medium">{estimate.laborHours}h</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">${estimate.basePrice}</span>
                </div>
              </div>

              {estimate.partsRequired.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Wrench className="w-4 h-4 mr-1" />
                    Parts Typically Required
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {estimate.partsRequired.map((part, index) => (
                      <li key={index}>{part}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">About this estimate:</p>
                    <p>{getCategoryDescription(estimate.vehicleCategory)}</p>
                    <p className="mt-1">
                      Actual costs may vary based on location, parts availability, and specific vehicle requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Calculate</h3>
              <p className="text-gray-600">
                Enter your vehicle details and select a service to get an instant cost estimate.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Reference - Typical Service Intervals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Oil Change</p>
            <p className="text-gray-600">Every 5,000-7,500 miles</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Tire Rotation</p>
            <p className="text-gray-600">Every 6,000-8,000 miles</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Brake Inspection</p>
            <p className="text-gray-600">Every 12,000 miles</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Air Filter</p>
            <p className="text-gray-600">Every 12,000-15,000 miles</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Transmission Service</p>
            <p className="text-gray-600">Every 30,000 miles</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">Major Service</p>
            <p className="text-gray-600">Every 12 months</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;