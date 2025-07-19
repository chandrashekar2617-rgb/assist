import jsPDF from 'jspdf';
import { VehicleServiceRecord } from '../types';
import { format } from 'date-fns';

export const generateServiceRecordPDF = (record: VehicleServiceRecord): void => {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Blue color
  doc.text('VEHICLE SERVICE RECORD', 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 20, 30);
  doc.text(`Record ID: ${record.id}`, 20, 37);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  let yPos = 55;
  
  // Customer Information Section
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('CUSTOMER INFORMATION', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const customerInfo = [
    ['Customer Name:', record.customerName],
    ['Email Address:', record.emailAddress],
    ['Contact Number:', record.customerContactNo],
    ['Address:', record.customerAddress],
    ['GST Number:', record.customerGSTNo || 'N/A'],
  ];
  
  customerInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Vehicle Information Section
  doc.setFontSize(14);
  doc.setTextColor(13, 148, 136); // Teal color
  doc.text('VEHICLE INFORMATION', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const vehicleInfo = [
    ['Registration Number:', record.registrationNo],
    ['Chassis Number:', record.chassisNo],
    ['Model:', record.model],
    ['Variant:', record.variant],
    ['Fuel Type:', record.fuel],
    ['Transmission:', record.transmission],
    ['Vehicle Sale Date:', format(new Date(record.vehicleSaleDate), 'MMM dd, yyyy')],
  ];
  
  vehicleInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Vehicle Age and Eligibility Section
  doc.setFontSize(14);
  doc.setTextColor(139, 69, 19); // Brown color
  doc.text('ELIGIBILITY INFORMATION', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const eligibilityInfo = [
    ['Vehicle Age:', `${record.vehicleAge} years`],
    ['Eligibility Status:', record.eligibility],
    ['ASSIST Level:', record.assist],
  ];
  
  eligibilityInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // ASSIST Information Section
  doc.setFontSize(14);
  doc.setTextColor(234, 88, 12); // Orange color
  doc.text('ASSIST INFORMATION', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const assistInfo = [
    ['Workshop Name:', record.workshopName],
    ['SA/Employee Name:', record.employeeName],
    ['ASSIST Level:', record.assist],
    ['Record Date:', format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')],
  ];
  
  assistInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Payment Information Section
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('PAYMENT INFORMATION', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const paymentInfo = [
    ['Amount Collected:', `₹${record.amountCollected.toFixed(2)}`],
    ['Payment Type:', record.paymentType],
    ['Payment Proof:', record.paymentProof],
  ];
  
  paymentInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  // Footer
  yPos += 20;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a computer-generated document. No signature required.', 20, yPos);
  doc.text('For any queries, please contact the workshop directly.', 20, yPos + 7);
  
  // Save the PDF
  const fileName = `ASSIST_Record_${record.registrationNo}_${format(new Date(record.timestamp), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

export const generateBulkPDF = (records: VehicleServiceRecord[]): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('BULK ASSIST RECORDS REPORT', 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 20, 30);
  doc.text(`Total Records: ${records.length}`, 20, 37);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  let yPos = 55;
  
  records.forEach((record, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(`Record #${index + 1}`, 20, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const summary = [
      `Customer: ${record.customerName} | Contact: ${record.customerContactNo}`,
      `Vehicle: ${record.model} ${record.variant} | Reg: ${record.registrationNo}`,
      `ASSIST: ${record.assist} | Age: ${record.vehicleAge} years | Status: ${record.eligibility}`,
      `Amount: ₹${record.amountCollected.toFixed(2)} | Payment: ${record.paymentType}`,
    ];
    
    summary.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });
    
    yPos += 10;
  });
  
  // Save the PDF
  const fileName = `Bulk_ASSIST_Records_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};