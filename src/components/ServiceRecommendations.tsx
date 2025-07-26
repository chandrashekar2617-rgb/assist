import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Calendar, 
  Car, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { VehicleServiceRecord, ServiceRecommendation } from '../types';
import { generateServiceRecommendations, generateCostEstimate } from '../utils/assistUtils';

interface ServiceRecommendationsProps {
  records: VehicleServiceRecord[];
}

const ServiceRecommendations: React.FC<ServiceRecommendationsProps> = ({ records }) => {
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [currentMileage, setCurrentMileage] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Get unique vehicles from records
  const uniqueVehicles = Array.from(
    new Set(records.map(r => `${r.vehicleModel}|${r.registrationNo}`))
  ).map(v => {
    const [model, regNo] = v.split('|');
    return { model, regNo };
  });

  const generateRecommendations = () => {
    if (!selectedVehicle || !currentMileage) return;

    setLoading(true);
    const [model, regNo] = selectedVehicle.split('|');
    
    setTimeout(() => {
      const recs = generateServiceRecommendations(records, model, regNo, currentMileage);
      setRecommendations(recs);
      setLoading(false);
    }, 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Clock className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalEstimatedCost = recommendations.reduce((sum, rec) => sum + rec.estimatedCost, 0);
  const urgentCount = recommendations.filter(r => r.priority === 'urgent').length;
  const highCount = recommendations.filter(r => r.priority === 'high').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Service Recommendations</h2>
            <p className="text-gray-600">AI-powered maintenance guidance</p>
          </div>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={!selectedVehicle || !currentMileage || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Generate</span>
        </button>
      </div>

      {/* Vehicle Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Vehicle
          </label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a vehicle...</option>
            {uniqueVehicles.map((vehicle, index) => (
              <option key={index} value={`${vehicle.model}|${vehicle.regNo}`}>
                {vehicle.model} - {vehicle.regNo}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Mileage
          </label>
          <input
            type="number"
            value={currentMileage || ''}
            onChange={(e) => setCurrentMileage(parseInt(e.target.value) || 0)}
            placeholder="Enter current mileage"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Urgent</p>
                <p className="text-2xl font-bold text-red-700">{urgentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-700">{highCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Total Cost</p>
                <p className="text-2xl font-bold text-green-700">${totalEstimatedCost}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Analyzing service history...</span>
        </div>
      )}

      {!loading && recommendations.length === 0 && selectedVehicle && currentMileage && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No immediate service recommendations for this vehicle.</p>
        </div>
      )}

      {!loading && recommendations.length === 0 && (!selectedVehicle || !currentMileage) && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Started</h3>
          <p className="text-gray-600">Select a vehicle and enter current mileage to see recommendations.</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(rec.priority)}`}>
                      {getPriorityIcon(rec.priority)}
                      <span className="capitalize">{rec.priority}</span>
                    </span>
                    <h4 className="font-semibold text-gray-800">{rec.recommendedService}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{rec.reason}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Due: {rec.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Est. Cost: ${rec.estimatedCost}
                      </span>
                    </div>
                    
                    {rec.lastServiceDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Last: {rec.lastServiceDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRecommendations;