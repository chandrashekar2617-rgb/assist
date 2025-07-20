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

  // Calculate vehicle age and eligibility when sale date changes
  React.useEffect(() => {
    if (formData.vehicleSaleDate) {
      const saleDate = new Date(formData.vehicleSaleDate);
      const currentDate = new Date();
      const ageInYears = Math.floor((currentDate.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      
      setFormData(prev => ({
        ...prev,
        vehicleAge: ageInYears,
        eligibility: ageInYears <= 15 ? 'Eligible' : 'Not Eligible',
        assist: ageInYears > 15 ? 'Not Eligible' : prev.assist
      }));
    }
  }, [formData.vehicleSaleDate]);

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
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-white/95">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Service Record' : 'New Service Record'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vehicle Sale Date - First Field */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            Vehicle Sale Date
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Vehicle Sale Date *
              </label>
              <input
                type="date"
                name="vehicleSaleDate"
                value={formData.vehicleSaleDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              {formData.vehicleSaleDate && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm">Vehicle Age:</span>
                      <span className="font-bold text-gray-800 ml-2">{formData.vehicleAge} years</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm">Eligibility:</span>
                      <span className={`font-bold ml-2 px-3 py-1 rounded-full text-sm ${formData.eligibility === 'Eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {formData.eligibility}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Vehicle Sale Date Document
              </label>
              <input
                type="file"
                name="vehicleSaleDateDoc"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Customer Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter customer's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Email Address *
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Contact Number *
              </label>
              <input
                type="tel"
                name="customerContactNo"
                value={formData.customerContactNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                GST Number
              </label>
              <input
                type="text"
                name="customerGSTNo"
                value={formData.customerGSTNo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="22AAAAA0000A1Z5 (Optional)"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Address *
              </label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
                placeholder="Enter complete address with city, state, and pincode"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-6 border-l-4 border-teal-500">
          <h3 className="text-xl font-bold text-teal-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm uppercase"
                placeholder="KA01AB1234"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Chassis Number (Full VIN) *
              </label>
              <input
                type="text"
                name="chassisNo"
                value={formData.chassisNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm uppercase"
                placeholder="MA3ERLF1S00000000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Swift, Baleno, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Variant *
              </label>
              <input
                type="text"
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="VXI, ZXI, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Fuel Type *
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dealership Details */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold text-yellow-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            Dealership Details
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Workshop Name *</label>
              <input
                type="text"
                name="workshopName"
                value={formData.workshopName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter workshop name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">SA/Employee Name *</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Service advisor name"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Registered Address *</label>
              <textarea
                name="registeredAddress"
                value={formData.registeredAddress}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
                placeholder="Complete registered address of dealership"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Dealership GSTIN *</label>
              <input
                type="text"
                name="dealershipGSTIN"
                value={formData.dealershipGSTIN}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm uppercase"
                placeholder="29AAAAA0000A1Z5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">SAC Code *</label>
              <input
                type="text"
                name="sacCode"
                value={formData.sacCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Service Accounting Code"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3">CIN *</label>
              <input
                type="text"
                name="cinNumber"
                value={formData.cinNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm uppercase"
                placeholder="Corporate Identification Number"
              />
            </div>
          </div>
        </div>

        {/* ASSIST Information */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-l-4 border-orange-500">
          <h3 className="text-xl font-bold text-orange-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            ASSIST Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">ASSIST Level *</label>
              <select
                name="assist"
                value={formData.assist}
                onChange={handleInputChange}
                required
                disabled={formData.eligibility === 'Not Eligible'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="ASSIST 1">ASSIST 1</option>
                <option value="ASSIST 2">ASSIST 2</option>
                <option value="ASSIST 3">ASSIST 3</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
              {formData.eligibility === 'Not Eligible' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">⚠️ Vehicle is over 15 years old and not eligible for ASSIST</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Payment Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Amount Collected *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  name="amountCollected"
                  value={formData.amountCollected}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Payment Type *
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Payment Proof (Receipt No/UTR No) *
              </label>
              <input
                type="text"
                name="paymentProof"
                value={formData.paymentProof}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Receipt number or transaction ID"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Payment Proof Document
              </label>
              <input
                type="file"
                name="paymentProofDoc"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg font-semibold text-lg transform hover:scale-105"
          >
            {isEditing ? <Save className="w-5 h-5 mr-3" /> : <Plus className="w-5 h-5 mr-3" />}
            {isEditing ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRecordForm;