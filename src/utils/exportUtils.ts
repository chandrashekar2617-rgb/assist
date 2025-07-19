import * as XLSX from 'xlsx';
import { VehicleServiceRecord } from '../types';
import { format } from 'date-fns';

export const exportToExcel = (records: VehicleServiceRecord[], filename?: string) => {
  // Prepare data with only required columns
  const exportData = records.map(record => ({
    'Timestamp': format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    'Email Address': record.emailAddress,
    'Customer Name': record.customerName,
    'Customer Contact No': record.customerContactNo,
    'Customer Address': record.customerAddress,
    'Customer GST No': record.customerGSTNo || '',
    'Registration No': record.registrationNo,
    'Chassis No (Full VIN)': record.chassisNo,
    'Model': record.model,
    'Variant': record.variant,
    'Fuel': record.fuel,
    'Transmission': record.transmission,
    'Vehicle Sale Date': format(new Date(record.vehicleSaleDate), 'yyyy-MM-dd'),
    'Workshop Name': record.workshopName,
    'SA/Employee Name': record.employeeName,
    'ASSIST Level': record.assist,
    'Eligibility': record.eligibility,
    'Vehicle Age (Years)': record.vehicleAge,
    'Amount Collected': record.amountCollected,
    'Payment Type': record.paymentType,
    'Payment Proof': record.paymentProof
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Timestamp
    { wch: 25 }, // Email Address
    { wch: 20 }, // Customer Name
    { wch: 15 }, // Contact No
    { wch: 30 }, // Address
    { wch: 15 }, // GST No
    { wch: 30 }, // Registered Address
    { wch: 15 }, // Dealership GSTIN
    { wch: 12 }, // SAC Code
    { wch: 15 }, // CIN Number
    { wch: 15 }, // Registration No
    { wch: 20 }, // Chassis No
    { wch: 15 }, // Model
    { wch: 15 }, // Variant
    { wch: 10 }, // Fuel
    { wch: 12 }, // Transmission
    { wch: 15 }, // Sale Date
    { wch: 20 }, // Workshop Name
    { wch: 20 }, // Employee Name
    { wch: 12 }, // ASSIST Level
    { wch: 12 }, // Eligibility
    { wch: 12 }, // Vehicle Age
    { wch: 15 }, // Amount
    { wch: 15 }, // Payment Type
    { wch: 20 }  // Payment Proof
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'ASSIST Records');

  // Generate filename
  const defaultFilename = `ASSIST_Records_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  
  // Save file
  XLSX.writeFile(wb, filename || defaultFilename);
};

export const exportToCSV = (records: VehicleServiceRecord[], filename?: string) => {
  // Prepare data with only required columns
  const exportData = records.map(record => ({
    'Timestamp': format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    'Email Address': record.emailAddress,
    'Customer Name': record.customerName,
    'Customer Contact No': record.customerContactNo,
    'Customer Address': record.customerAddress,
    'Customer GST No': record.customerGSTNo || '',
    'Registration No': record.registrationNo,
    'Chassis No (Full VIN)': record.chassisNo,
    'Model': record.model,
    'Variant': record.variant,
    'Fuel': record.fuel,
    'Transmission': record.transmission,
    'Vehicle Sale Date': format(new Date(record.vehicleSaleDate), 'yyyy-MM-dd'),
    'Workshop Name': record.workshopName,
    'SA/Employee Name': record.employeeName,
    'ASSIST Level': record.assist,
    'Eligibility': record.eligibility,
    'Vehicle Age (Years)': record.vehicleAge,
    'Amount Collected': record.amountCollected,
    'Payment Type': record.paymentType,
    'Payment Proof': record.paymentProof
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'ASSIST Records');

  // Generate filename
  const defaultFilename = `ASSIST_Records_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  
  // Save as CSV
  XLSX.writeFile(wb, filename || defaultFilename, { bookType: 'csv' });
};