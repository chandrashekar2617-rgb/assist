import jsPDF from 'jspdf';
import { VehicleServiceRecord } from '../types';
import { format, addYears } from 'date-fns';

// Global counter for invoice numbers (in a real app, this would be stored in a database)
let invoiceCounter = 1;

export const generatePolicyPDF = (record: VehicleServiceRecord): void => {
  const doc = new jsPDF();
  
  // Generate invoice number and certificate number
  const invoiceNumber = String(invoiceCounter++).padStart(7, '0');
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const fyYear = `${String(currentYear).slice(-2)}-${String(nextYear).slice(-2)}`;
  const certificateNumber = `ASSIST-${fyYear}-${String(invoiceCounter).padStart(5, '0')}`;
  
  // Calculate GST breakdown (18% total = 9% CGST + 9% SGST)
  const totalAmount = record.amountCollected;
  const basicPrice = totalAmount / 1.18; // Remove GST to get basic price
  const cgst = basicPrice * 0.09;
  const sgst = basicPrice * 0.09;
  
  // Calculate membership dates
  const startDate = new Date(record.timestamp);
  const expiryDate = addYears(startDate, 1);
  
  let yPos = 20;
  
  // Page 1 - Policy Certificate
  
  // Header with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, 30);
  
  // Company Logo Area
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('MARUTI SUZUKI', 105, 28, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('24x7 ROADSIDE ASSISTANCE PROGRAM', 105, 35, { align: 'center' });
  doc.text('ASSIST - Age-based Service Support & Eligibility Tracking', 105, 40, { align: 'center' });
  
  yPos = 55;
  
  // Policy Certificate Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('POLICY CERTIFICATE', 105, yPos, { align: 'center' });
  yPos += 15;
  
  // Certificate Number Box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos - 5, 180, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate Number:', 20, yPos + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(certificateNumber, 75, yPos + 2);
  doc.setFont('helvetica', 'bold');
  doc.text('Issue Date:', 130, yPos + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), 'dd/MM/yyyy'), 160, yPos + 2);
  yPos += 20;
  
  // Policy Holder Details Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('POLICY HOLDER DETAILS', 20, yPos);
  yPos += 8;
  
  // Policy holder details table
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.setFontSize(9);
  
  const policyHolderData = [
    ['Name:', record.customerName],
    ['Address:', record.customerAddress],
    ['Contact Number:', record.customerContactNo],
    ['Email ID:', record.emailAddress],
    ['GST Number:', record.customerGSTNo || 'Not Applicable'],
  ];
  
  policyHolderData.forEach(([label, value], index) => {
    const rowY = yPos + (index * 7);
    doc.rect(20, rowY - 2, 160, 7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, 25, rowY + 2);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, 100);
    doc.text(lines[0], 70, rowY + 2);
  });
  yPos += (policyHolderData.length * 7) + 15;
  
  // Vehicle Details Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('VEHICLE DETAILS', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  const vehicleData = [
    ['Make & Model:', `MARUTI SUZUKI ${record.model}`],
    ['Variant:', record.variant],
    ['Registration Number:', record.registrationNo],
    ['Chassis Number:', record.chassisNo],
    ['Fuel Type:', record.fuel],
    ['Transmission:', record.transmission],
    ['Vehicle Sale Date:', format(new Date(record.vehicleSaleDate), 'dd/MM/yyyy')],
    ['Vehicle Age:', `${record.vehicleAge} years`],
  ];
  
  vehicleData.forEach(([label, value], index) => {
    const rowY = yPos + (index * 7);
    doc.rect(20, rowY - 2, 160, 7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, 25, rowY + 2);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, rowY + 2);
  });
  yPos += (vehicleData.length * 7) + 15;
  
  // Coverage Details Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('COVERAGE DETAILS', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  const coverageData = [
    ['Plan Type:', record.assist],
    ['Eligibility Status:', record.eligibility],
    ['Coverage Period:', '12 Months'],
    ['Policy Start Date:', format(startDate, 'dd/MM/yyyy')],
    ['Policy Expiry Date:', format(expiryDate, 'dd/MM/yyyy')],
    ['Service Limit:', '4 Services per year'],
    ['Towing Limit:', 'Up to 50 KM (3 times per year)'],
  ];
  
  coverageData.forEach(([label, value], index) => {
    const rowY = yPos + (index * 7);
    doc.rect(20, rowY - 2, 160, 7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, 25, rowY + 2);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, rowY + 2);
  });
  
  // Add new page for invoice details
  doc.addPage();
  yPos = 30;
  
  // Invoice Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('TAX INVOICE', 105, yPos, { align: 'center' });
  yPos += 20;
  
  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const invoiceDetails = [
    ['Invoice Number:', invoiceNumber],
    ['Invoice Date:', format(new Date(), 'dd/MM/yyyy')],
    ['Due Date:', format(new Date(), 'dd/MM/yyyy')],
  ];
  
  invoiceDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  yPos += 10;
  
  // Billing Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('BILLING DETAILS', 20, yPos);
  yPos += 12;
  
  // Service provider details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Service Provider:', 20, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(record.workshopName, 20, yPos);
  yPos += 5;
  const addressLines = doc.splitTextToSize(record.registeredAddress, 170);
  addressLines.forEach((line: string) => {
    doc.text(line, 20, yPos);
    yPos += 5;
  });
  doc.text(`GSTIN: ${record.dealershipGSTIN}`, 20, yPos);
  yPos += 5;
  doc.text(`SAC Code: ${record.sacCode}`, 20, yPos);
  yPos += 5;
  doc.text(`CIN: ${record.cinNumber}`, 20, yPos);
  yPos += 12;
  
  // Bill to details
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(record.customerName, 20, yPos);
  yPos += 5;
  const customerAddressLines = doc.splitTextToSize(record.customerAddress, 170);
  customerAddressLines.forEach((line: string) => {
    doc.text(line, 20, yPos);
    yPos += 5;
  });
  if (record.customerGSTNo) {
    doc.text(`GSTIN: ${record.customerGSTNo}`, 20, yPos);
    yPos += 5;
  }
  yPos += 12;
  
  // Invoice table
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Table header
  doc.rect(20, yPos, 160, 10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, yPos + 6);
  doc.text('HSN/SAC', 100, yPos + 6);
  doc.text('Amount', 150, yPos + 6);
  yPos += 10;
  
  // Table rows
  const invoiceRows = [
    ['24x7 Roadside Assistance - ' + record.assist, record.sacCode, `₹${basicPrice.toFixed(2)}`],
    ['CGST (9%)', '', `₹${cgst.toFixed(2)}`],
    ['SGST (9%)', '', `₹${sgst.toFixed(2)}`],
  ];
  
  invoiceRows.forEach(([desc, hsn, amount]) => {
    doc.rect(20, yPos, 160, 8);
    doc.setFont('helvetica', 'normal');
    doc.text(desc, 25, yPos + 5);
    doc.text(hsn, 100, yPos + 5);
    doc.text(amount, 150, yPos + 5);
    yPos += 8;
  });
  
  // Total row
  doc.rect(20, yPos, 160, 10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', 25, yPos + 6);
  doc.text(`₹${totalAmount.toFixed(2)}`, 150, yPos + 6);
  yPos += 20;
  
  // Payment details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details:', 20, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Mode: ${record.paymentType}`, 20, yPos);
  yPos += 5;
  doc.text(`Transaction Reference: ${record.paymentProof}`, 20, yPos);
  yPos += 5;
  doc.text(`Payment Date: ${format(new Date(record.timestamp), 'dd/MM/yyyy')}`, 20, yPos);
  yPos += 5;
  doc.text(`Service Advisor: ${record.employeeName}`, 20, yPos);
  
  // Add new page for terms and conditions
  doc.addPage();
  yPos = 30;
  
  // Terms and Conditions
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('TERMS AND CONDITIONS', 105, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const termsContent = [
    '1. COVERAGE SCOPE',
    'This policy provides 24x7 roadside assistance for mechanical and electrical breakdowns, battery jumpstart, tyre puncture assistance, fuel delivery (up to 5 liters), key assistance, and towing services.',
    '',
    '2. SERVICE LIMITATIONS',
    '• Maximum 4 services per policy year',
    '• Towing limited to 50 KM distance (maximum 3 times per year)',
    '• Services available within India (excluding certain remote areas)',
    '• Response time varies based on location and traffic conditions',
    '',
    '3. EXCLUSIONS',
    '• Accidents, theft, vandalism, or acts of God',
    '• Damage due to negligence or misuse',
    '• Racing, rallying, or commercial use',
    '• Vehicles over 15 years old (from date of first registration)',
    '• Cost of spare parts and consumables',
    '',
    '4. CLAIM PROCEDURE',
    'To avail services, call the helpline number: 084306 93069 / 044-61726397',
    'Provide vehicle registration number, location, and nature of breakdown.',
    '',
    '5. VALIDITY',
    'This policy is valid for 12 months from the start date mentioned above.',
    'Services can be availed only during the validity period.',
    '',
    '6. CONTACT INFORMATION',
    'For assistance: 084306 93069 / 044-61726397',
    'Email: support@marutisuzuki.com',
    '',
    '7. IMPORTANT NOTES',
    '• Keep this certificate in your vehicle at all times',
    '• Present this certificate when availing services',
    '• Policy is non-transferable and non-refundable',
    '• Terms and conditions are subject to change without prior notice',
    '',
    '8. EMERGENCY CONTACT',
    'In case of breakdown, call: 084306 93069',
    'Available 24x7 across India',
    'Keep your policy certificate and vehicle registration ready',
  ];
  
  termsContent.forEach(text => {
    if (text === '') {
      yPos += 4;
      return;
    }
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    if (text.match(/^\d+\./)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
    } else if (text.startsWith('•')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }
    
    const lines = doc.splitTextToSize(text, 170);
    lines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 4;
    });
    yPos += 2;
  });
  
  // Footer on last page
  yPos += 10;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('This is a computer-generated document and does not require a signature.', 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text('For queries, contact your service provider or call our helpline.', 105, yPos, { align: 'center' });
  
  // Save the PDF
  const fileName = `ASSIST_Policy_${record.registrationNo}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};