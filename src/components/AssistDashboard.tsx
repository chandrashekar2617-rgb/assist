import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bot, 
  Calculator, 
  Car, 
  TrendingUp,
  Bell,
  CheckCircle,
  X
} from 'lucide-react';
import { VehicleServiceRecord } from '../types';
import ServiceRecommendations from './ServiceRecommendations';
import CostEstimator from './CostEstimator';
import AssistantChat from './AssistantChat';
import { checkUrgentNeeds } from '../utils/assistUtils';

interface AssistDashboardProps {
  records: VehicleServiceRecord[];
  onBackToDashboard?: () => void;
}

const AssistDashboard: React.FC<AssistDashboardProps> = ({ records, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showChat, setShowChat] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [urgentAlerts, setUrgentAlerts] = useState<string[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for urgent maintenance needs
    const alerts = checkUrgentNeeds(records);
    setUrgentAlerts(alerts);
  }, [records]);

  const tabs = [
    {
      id: 'recommendations',
      label: 'Service Recommendations',
      icon: <Car className="w-5 h-5" />,
      component: <ServiceRecommendations records={records} />
    },
    {
      id: 'estimator',
      label: 'Cost Estimator',
      icon: <Calculator className="w-5 h-5" />,
      component: <CostEstimator />
    }
  ];

  const visibleAlerts = urgentAlerts.filter(alert => !dismissedAlerts.has(alert));

  const dismissAlert = (alert: string) => {
    setDismissedAlerts(prev => new Set([...prev, alert]));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ASSIST Dashboard</h1>
                <p className="text-purple-100">Intelligent Vehicle Service Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {visibleAlerts.length > 0 && (
                <div className="flex items-center text-yellow-200">
                  <Bell className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{visibleAlerts.length} Alert{visibleAlerts.length > 1 ? 's' : ''}</span>
                </div>
              )}
              
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 flex items-center border border-white/20"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Main Dashboard
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowChat(true);
                  setChatMinimized(false);
                }}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 flex items-center border border-white/20"
              >
                <Bot className="w-4 h-4 mr-2" />
                Chat Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Urgent Alerts */}
        {visibleAlerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {visibleAlerts.map((alert, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Urgent Maintenance Required</p>
                    <p className="text-red-600">{alert}</p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(records.map(r => `${r.vehicleModel}-${r.registrationNo}`)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Service Records</p>
                <p className="text-2xl font-bold text-gray-800">{records.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Urgent Alerts</p>
                <p className="text-2xl font-bold text-gray-800">{visibleAlerts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Features</p>
                <p className="text-2xl font-bold text-gray-800">{tabs.length + 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">ASSIST Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Smart Recommendations</h4>
              <p className="text-gray-600 text-sm">
                AI-powered service recommendations based on your vehicle's history, mileage, and maintenance intervals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Cost Estimation</h4>
              <p className="text-gray-600 text-sm">
                Get instant, accurate cost estimates for any service based on your vehicle type and local pricing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Virtual Assistant</h4>
              <p className="text-gray-600 text-sm">
                24/7 chat support for vehicle service questions, scheduling help, and maintenance guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Assistant */}
      {showChat && (
        <AssistantChat
          isMinimized={chatMinimized}
          onToggleMinimize={() => setChatMinimized(!chatMinimized)}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default AssistDashboard;