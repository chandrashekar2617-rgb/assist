import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Download,
  Search,
  SortAsc,
  SortDesc,
  Award,
} from 'lucide-react';
import { VehicleServiceRecord } from '../types';
import { format } from 'date-fns';

interface ServiceRecordTableProps {
  records: VehicleServiceRecord[];
  onEdit: (record: VehicleServiceRecord) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (record: VehicleServiceRecord) => void;
  onGeneratePolicyPDF: (record: VehicleServiceRecord) => void;
}

const ServiceRecordTable: React.FC<ServiceRecordTableProps> = ({
  records,
  onEdit,
  onDelete,
  onGeneratePDF,
  onGeneratePolicyPDF,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] =
    useState<keyof VehicleServiceRecord>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredRecords = records.filter((record) =>
    `${record.customerName} ${record.registrationNo} ${record.workshopName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aValue = a[sortField] ?? '';
    const bValue = b[sortField] ?? '';

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof VehicleServiceRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof VehicleServiceRecord }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">
          No ASSIST records found. Add your first record above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ASSIST Records</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, registration, or workshop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 bg-white/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                ['timestamp', 'Date'],
                ['customerName', 'Customer'],
                ['registrationNo', 'Registration'],
                ['model', 'Vehicle'],
                ['workshopName', 'Workshop'],
                ['amountCollected', 'Amount'],
              ].map(([field, label]) => (
                <th
                  key={field}
                  onClick={() =>
                    handleSort(field as keyof VehicleServiceRecord)
                  }
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    {label}
                    <SortIcon field={field as keyof VehicleServiceRecord} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(record.vehicleSaleDate), 'MMM dd, yyyy')}
                  <div className="text-xs text-gray-500">
                    {record.vehicleAge} years old
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.customerContactNo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.registrationNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.model}
                  </div>
                  <div className="text-sm text-gray-500">{record.variant}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div
                    className={`text-sm font-medium px-2 py-1 rounded-full text-center ${
                      record.assist === 'ASSIST 1'
                        ? 'bg-green-100 text-green-800'
                        : record.assist === 'ASSIST 2'
                        ? 'bg-yellow-100 text-yellow-800'
                        : record.assist === 'ASSIST 3'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.assist}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₹{record.amountCollected.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.paymentType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.eligibility === 'Eligible'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.eligibility}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onGeneratePDF(record)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Generate PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onGeneratePolicyPDF(record)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                      title="Generate Policy PDF"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRecordTable;
