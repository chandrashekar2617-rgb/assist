import React, { useState } from 'react';
import { Plus, Save, FileText } from 'lucide-react';
import { FormData, VehicleServiceRecord } from '../types';

interface ServiceRecordFormProps {
  onSubmit: (data: VehicleServiceRecord) => void;
  initialData?: VehicleServiceRecord;
  isEditing?: boolean;
}

const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    emailAddress: initialData?.emailAddress || '',
    customerName: initialData?.customerName || '',
    customerContactNo: initialData?.customerContactNo || '',
    customerAddress: initialData?.customerAddress || '',
    customerGSTNo: initialData?.customerGSTNo || '',
    registeredAddress: initialData?.registeredAddress || '',
    dealershipGSTIN: initialData?.dealershipGSTIN || '',
    sacCode: initialData?.sacCode || '',
    cinNumber: initialData?.cinNumber || '',
    registrationNo: initialData?.registrationNo || '',
    chassisNo: initialData?.chassisNo || '',
    model: initialData?.model || '',
    variant: initialData?.variant || '',
    fuel: initialData?.fuel || 'Petrol',
    transmission: initialData?.transmission || 'Manual',
    vehicleSaleDate: initialData?.vehicleSaleDate || '',
    workshopName: initialData?.workshopName || '',
    employeeName: initialData?.employeeName || '',
    // Removed employeeNo, employeeMSPIN, employeeDept (not in types)
    assist: initialData?.assist || 'ASSIST 1',
    eligibility: initialData?.eligibility || '',
    vehicleAge: initialData?.vehicleAge || 0,
    amountCollected: initialData?.amountCollected || 0,
    paymentType: initialData?.paymentType || 'Cash',
    paymentProof: initialData?.paymentProof || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amountCollected' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const record: VehicleServiceRecord = {
      id: initialData?.id || crypto.randomUUID(),
      timestamp: initialData?.timestamp || new Date().toISOString(),
      ...formData
    };

    onSubmit(record);
    
    if (!isEditing) {
      // Reset form after successful submission
      setFormData({
        emailAddress: '',
        customerName: '',
        customerContactNo: '',
        customerAddress: '',
        customerGSTNo: '',
        registeredAddress: '',
        dealershipGSTIN: '',
        sacCode: '',
        cinNumber: '',
        registrationNo: '',
        chassisNo: '',
        model: '',
        variant: '',
        fuel: 'Petrol',
        transmission: 'Manual',
        vehicleSaleDate: '',
        workshopName: '',
        employeeName: '',
        assist: 'ASSIST 1',
        eligibility: '',
        vehicleAge: 0,
        amountCollected: 0,
        paymentType: 'Cash',
        paymentProof: '',
      });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Service Record' : 'New Service Record'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Sale Date - First Field */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vehicle Sale Date</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Sale Date *
              </label>
              <input
                type="date"
                name="vehicleSaleDate"
                value={formData.vehicleSaleDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formData.vehicleSaleDate && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Vehicle Age: </span>
                  <span className="font-medium">{formData.vehicleAge} years</span>
                  <span className="ml-4 text-gray-600">Eligibility: </span>
                  <span className={`font-medium ${formData.eligibility === 'Eligible' ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.eligibility}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Sale Date Document
              </label>
              <input
                type="file"
                name="vehicleSaleDateDoc"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="customerContactNo"
                value={formData.customerContactNo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                name="customerGSTNo"
                value={formData.customerGSTNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="border-l-4 border-teal-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chassis Number (Full VIN) *
              </label>
              <input
                type="text"
                name="chassisNo"
                value={formData.chassisNo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant *
              </label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type *
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dealership Details */}
        <div className="border-l-4 border-yellow-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Dealership Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Name *</label>
              <input
                type="text"
                name="workshopName"
                value={formData.workshopName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address *</label>
              <textarea
                name="registeredAddress"
                value={formData.registeredAddress}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealership GSTIN *</label>
              <input
                type="text"
                name="dealershipGSTIN"
                value={formData.dealershipGSTIN}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SAC Code *</label>
              <input
                type="text"
                name="sacCode"
                value={formData.sacCode}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CIN *</label>
              <input
                type="text"
                name="cinNumber"
                value={formData.cinNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SA/Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* ASSIST Information */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">ASSIST Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ASSIST Level *</label>
              <select
                name="assist"
                value={formData.assist}
                onChange={handleInputChange}
                required
                disabled={formData.eligibility === 'Not Eligible'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ASSIST 1">ASSIST 1</option>
                <option value="ASSIST 2">ASSIST 2</option>
                <option value="ASSIST 3">ASSIST 3</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
              {formData.eligibility === 'Not Eligible' && (
                <p className="mt-1 text-sm text-red-600">Vehicle is over 15 years old and not eligible for ASSIST</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Collected *
              </label>
              <input
                type="number"
                name="amountCollected"
                value={formData.amountCollected}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type *
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Proof (Receipt No/UTR No) *
              </label>
              <input
                type="text"
                name="paymentProof"
                value={formData.paymentProof}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Proof Document
              </label>
              <input
                type="file"
                name="paymentProofDoc"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-lg font-semibold"
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isEditing ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRecordForm;