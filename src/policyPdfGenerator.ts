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
  const certificateNumber = `ASSIST-${fyYear},${String(invoiceCounter).padStart(5, '0')}`;
  
  // Calculate GST breakdown (18% total = 9% CGST + 9% SGST)
  const totalAmount = record.amountCollected;
  const basicPrice = totalAmount / 1.18; // Remove GST to get basic price
  const cgst = basicPrice * 0.09;
  const sgst = basicPrice * 0.09;
  
  // Calculate membership dates
  const startDate = new Date(record.timestamp);
  const expiryDate = addYears(startDate, 1);
  
  let yPos = 20;
  
  // Header - Welcome to B-ASSIST Program
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
    doc.text('Welcome to ASSIST Program', 105, yPos, { align: 'center' });
  yPos += 15;
  
  // Dear Customer greeting
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Dear ${record.customerName},`, 20, yPos);
  yPos += 10;
  
  // Thank you message
  const thankYouText = 'We thank you for being enrolled for 24x7 ASSIST Road Side Assistance (RSA) Program. Please find the RSA service features below. We request you to kindly keep this document with your owner\'s manual.';
  const thankYouLines = doc.splitTextToSize(thankYouText, 170);
  thankYouLines.forEach((line: string) => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  // CERTIFICATE-CUM-TAX INVOICE heading
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('CERTIFICATE-CUM-TAX INVOICE', 20, yPos);
  yPos += 15;
  
  // Invoice details table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Create table for invoice details
  const invoiceDetails = [
    ['Invoice Number:', invoiceNumber],
    ['Certificate Number:', certificateNumber],
    ['Certificate Print Date:', format(new Date(), 'dd MMM yyyy')],
  ];
  
  invoiceDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Original Invoice / Customer Copy
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Original Invoice / Customer Copy', 10, yPos); // x = 10 for left alignment
  yPos += 15;
  
  // Sold by / Dealership details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Sold by / Dealership Details', 20, yPos);
  yPos += 10;
  
  // Dealership details table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const dealershipDetails = [
    ['Name:', record.workshopName],
    ['Registered Address:', record.registeredAddress],
    ['GSTIN:', record.dealershipGSTIN],
    ['SAC Code:', record.sacCode],
    ['CIN:', record.cinNumber],
  ];
  
  dealershipDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, 120);
    lines.forEach((line: string, index: number) => {
      doc.text(line, 80, yPos + (index * 5));
    });
    yPos += Math.max(7, lines.length * 5);
  });
  
  yPos += 10;
  
  // Customer Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Customer Details', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const customerDetails = [
    ['Customer Name:', record.customerName],
    ['Registration Address:', record.customerAddress],
    ['Contact Number:', record.customerContactNo],
    ['GSTIN:', record.customerGSTNo || 'N/A'],
    ['Email ID:', record.emailAddress],
  ];
  
  customerDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, 120);
    lines.forEach((line: string, index: number) => {
      doc.text(line, 80, yPos + (index * 5));
    });
    yPos += Math.max(7, lines.length * 5);
  });
  
  yPos += 10;
  
  // Vehicle Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Vehicle Details', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const vehicleDetails = [
    ['Make:', 'MARUTI SUZUKI'],
    ['Model:', record.model],
    ['Chassis Number (Full VIN):', record.chassisNo],
    ['Registration Number:', record.registrationNo],
    ['Sale Date:', record.vehicleSaleDate],
    ['Membership Policy Start Date:', format(startDate, 'dd MMM yyyy')],
    ['Membership Policy Expiry Date:', format(expiryDate, 'dd MMM yyyy')],
  ];
  
  vehicleDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Product Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Product Details', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const productDetails = [
    ['Product Name:', record.assist],
    ['Basic Price:', `₹${basicPrice.toFixed(2)}`],
    ['CGST (9%):', `₹${cgst.toFixed(2)}`],
    ['SGST (9%):', `₹${sgst.toFixed(2)}`],
    ['MRP (Total):', `₹${totalAmount.toFixed(2)}`],
  ];
  
  productDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  // Add new page for coverage and terms
  doc.addPage();
  yPos = 30;
  
  // Coverage heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('COVERAGE UNDER THE 24X7 BREAKDOWN SUPPORT', 20, yPos);
  yPos += 15;
  
  // Terms and Conditions heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Terms and Conditions', 20, yPos);
  yPos += 10;
  
  // Terms content
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const termsContent = [
    'Breakdown Support Over Phone',
    'In the event of any minor issues of vehicle which can be resolved on phone, same shall be done by our team. Such issues include inability to operate few features in the vehicle or understanding meaning of warning lamps etc.',
    '',
    'Breakdown Support in case of minor mechanical / electrical issues',
    'Rundown of Battery– In such scenario our technician shall reach the breakdown spot and shall provide jumpstart to make the vehicle on road. In case the battery is completely drained, and battery jumpstart is not making the vehicle start, the vehicle shall be towed to the nearest Bimal Auto Agency. If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS (Maruti Authorized Service).',
    '',
    'Vehicle Tyre Puncture – In such scenario, our technician shall reach the breakdown spot and replace in punctured tyre with the Spare Tyre (If spare tyre is available) or shall take the punctured tyre to the nearest tyre puncture shop and fix the same. In case there are no tyre puncture shop available near the breakdown location, the vehicle shall be towed to the nearest Bimal Auto Agency . If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS',
    '',
    'Minor mechanical / electrical issues – In such scenario our technician shall reach the breakdown spot and will try his best to identify the root cause to fix it. In case the issue is not resolvable on the spot the vehicle shall be towed to the nearest Bimal Auto Agency . If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS',
    '',
    'Vehicle running out of fuel – If the vehicle becomes immobile due to empty fuel tank, Technician shall support the customer by arranging up to 5 Liters of Fuel. The charges for the fuel shall be borne by the customer. In case loose fuel is not available in a particular city (i.e petrol pumps denying supply of loose fuel due to government prohibition), Vehicle will be towed to the nearest fuel pump. This service will be provided only if vehicle is on road. During incorrect fuel filled, vehicle will be towed to the nearest Bimal Auto Agency . If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS',
    '',
    'Lost key assistance/ Key Locked - Delivery of Spare Key is available if breakdown location is within Home City. Towing will be available for key lost cases where repair cannot be done on the spot the vehicle shall be towed to the nearest Bimal Auto Agency . If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS',
    '',
    'Breakdown support in case of major mechanical/ electrical / accident issues',
    'In such scenario the towing services shall be arranged, and the vehicle shall be towed from the breakdown spot to the nearest Bimal Auto – Maruti Dealer for further repairs. To avoid any misuse this service has been limited to 3 times in a year and upto 50 Kms (breakdown location to nearest Bimal Auto). In case towing is required beyond 50 kms or towing is required for the 4th time in a year, same shall be provided on chargeable basis. For accident cases towing will be activated on the completion of police formalities, if any. If Breakdown out of Bangalore or Kozhikode vehicle will drop at nearest MAS',
    '',
    'The charges to avail the service on paid basis shall be informed to customer during the call as it depends on the location of breakdown and distance of towing required.',
    '',
    'Services - Total 4 Services, Either towing maximum 3 times and 1 ROS or 4 times ROS in a year.',
    'Mode of Towing- Towing will be on best possible mode depending upon type of vehicle and road conditions.',
    'Coordination in Extraction or Removal: - In the event of vehicle being stuck in ditch, pit or valley, coordination will be done with external agencies where ever possible. Cost to be borne by the vehicle owner. Any consequential damage during the process will be borne by the vehicle owner.',
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
  
  // Add new page for exclusions
  doc.addPage();
  yPos = 20;
  
  // Exclusions heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('EXCLUSIONS', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const exclusions = [
    '1. Cost of any parts to replaced, consumables and labor for such repairs are not covered under this program and are chargeable to the customer',
    '2. Toll charges above 50km and Border charges (if any) required for our team to be paid in reaching to the breakdown site are not included in the program and same to be settled by customer at actuals',
    '3. Breakdowns involving accidents resulting from the illegitimate removal of the Covered Vehicle, fire theft, vandalism, riots, lightening, earthquake, windstorm, hail, tsunami, unusual weather conditions, other acts of God, flood etc. are not covered under this program',
    '4. Those accidents or breakdowns that are produced when the Customer or the authorized driver have infringed upon the regulatory ordinances as far as the requisites and number of persons transported, weight and means of things and animals that can be transported or the form of handling them if the infraction has been the determining cause of the accident or the causal event of the incident.',
    '5. Events caused by fuels, mineral essences, and other inflammable, explosive or toxic materials transported in the Covered Vehicle.',
    '6. Any event when the driver of the vehicle is found to be in any of the situations that are indicated below',
    'a. The state of intoxication or under the influence of alcohol, drugs, toxins, or narcotics not medically prescribed.',
    'b. Lack of permission or corresponding license for the category of the Covered Vehicle or violation of the sanction of cancellation or withdrawal of them',
    'c. Vehicles that are unattended, un-registered, impounded and abandoned.',
    'd. Any public vehicle like ambulances, taxis, police vehicles and/or fire brigade vehicles and any other vehicle not used for private use are excluded of all the services coverage under these general conditions.',
    'e. Luggage that is not sufficiently wrapped or identified, fragile luggage or perishable products, and any commercial goods carried in the Covered Vehicle',
    'f. Breakdown/defect caused by misuse, abuse, negligence, alteration, or modifications made to the vehicle.',
    'g. Any animals carried in the Covered Vehicle.',
    'h. Cases involving racing, rallies, vehicle testing or practice for such events…',
    '7. The following vehicles shall not be covered:',
    'a. Those used for hire or reward, except if expressly included above.',
    'b. Those used for the transportation of goods.',
    'c. Those with an authorized maximum weight exceeding 3,500 Kg.',
    '8. Events not covered under the program (Few of these may be applicable for only Cars while others may be applicable for both Cars and two Wheelers)',
    'a. Boot cannot be opened',
    'b. Non-functional horn. If the horn is activated incessantly, the Services shall be provided.',
    'c. Faulty fuel gauge',
    'd. Non-functional Speedometer',
    'e. Non-functional sunroof operation',
    'f. Non-functional Air-conditioning',
    'g. Non-functional demisters',
    'h. Vehicle headlights not functional during daytime.',
    'i. Non-functional Seat adjustor but the vehicle can be driven safely.',
    'j. Illumination warning lamp of ABS, airbag warning or traction control or any such non-safety related lights/service warnings lights which do not render the vehicle immobilized.',
    'k. In the event of passenger doors not opening or seatbelts not functioning and there are no passengers except the driver',
    'l. Damaged door glasses or non-functional windows when there are no securities or weather risks. Broken rear-view mirror not obstructing driver\'s view.',
    'm. Damaged or faulty fuel cap but vehicle has sufficient fuel to reach the nearest authorized dealer.',
    'n. Windscreen wipers turning faulty in fair weather or vehicle running out of windscreen wiper fluid.',
    'o. Electronic Vehicle security system are faulty but do not render it immobilized and the alarm is not hooting continuously.',
    '9. Waiting charges, if towing vehicle needs to wait at breakdown location for more than 2 hours till Customer completes required formalities, additional charges will be paid to towing ASP directly by customer. Such charges are capped to INR 100/-.',
    '10. Waiting charges because of dealership not allowing ASP to unload vehicle (specifically at night time) will be borne by the Customer if ASP misses to coordinate with the nearest Client dealership before picking the vehicle.',
  ];
  
  exclusions.forEach(text => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
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
    yPos += 3;
  });
  
  // Add new page for disclaimer and contact info
  doc.addPage();
  yPos = 20;
  
  // Disclaimer heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Disclaimer', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const disclaimers = [
    'I. The service is not available in some part of J&K, Northeast States and union territories of Andaman and Nicobar Islands and Lakshadweep.',
    'II. The actual reach time will be conveyed by call centre at the time of breakdown call.',
    'III. The reach time may vary depending on the traffic density & time of the day.',
    'IV. The reach time indicated does not account for delays due to acts of God, laws, rules & regulations for time being in force, orders of statutory or Govt. authorities, industrial disputes, inclement weather, heavy down pour, floods, storms, natural calamities, roadblocks due to accidents, general strife, law & order conditions viz. Fire, arson, riots, strikes, terrorist attacks, war etc.',
    'V. On spot repairs at breakdown site shall depend on nature of complaints & will be as per the discretion of the ASP.',
    'VI. The decision of free of charge repairs will be as per the policy & procedures of KI Mobility Solution Private Limited and as per interpretation of the same by ASP. You will be duly informed by the ASP & call centre for the charge applicable if any.',
    'VII. All the charges wherever applicable need to be settled by the customers',
  ];
  
  disclaimers.forEach(text => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
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
    yPos += 3;
  });
  
  yPos += 10;
  
  // Exclusion of Liabilities
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('EXCLUSION OF LIABILITIES', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const liabilities = [
    'A. It is understood that Bimal Auto shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of any delay in or non-delivery of defect/deficiency in service/parts provided by technician / Towing driver.',
    'B. In case vehicle cannot be repaired on site, towing facility will be provided for taking their vehicle to the nearest Bimal Auto workshop only. In no condition will the vehicle to be towed to any other workshop.',
    'C. Customers are advised to take acknowledgement from the technician / towing driver for the list of accessories/extra fittings and other belongings in the vehicle as well as the current condition related to dents/scratches breakages of parts/fitments of the vehicle at the time technician / towing driver taking possession of the vehicle to verify these items when the delivery is taken by them. Bimal Auto shall not be responsible for any such claims damages/loss or any deficiency of service of the technician / Towing Driver.',
    'D. Services entitled to customers can be refused or cancelled on account of abusive behaviour, fraudulent representation, malicious intent, refusal to pay charges for any charges related services and spare parts during service or on previous occasion on part of the customer.',
    'E. On site repairs are temporary in nature. The completion of repairs does not certify the road worthiness of the vehicle. The customer is advised to ensure temporary repairs carried out on site is followed by permanent repairs at Bimal Auto workshop at the earliest.',
    'F. Terms & conditions and service coverage exclusion etc. are subject to change without notice.',
  ];
  
  liabilities.forEach(text => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
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
    yPos += 5;
  });
  
  yPos += 10;
  
  // What to do in case of breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('What to do in case of your vehicle getting breakdown?', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const breakdownInfo = [
    'As your vehicle is covered under the breakdown assistance RSA covered program, in case of your vehicle getting breakdown, you can dial the Hotline number 084306 93069/ 044 – 61726397 and share the following details on the call',
    'a) Registration number of the Vehicle',
    'b) Location along with Landmark of the breakdown',
    'c) Reason for breakdown',
    '',
    'Please ensure to Park your vehicle on the edge of the road and put on hazard warning signal.',
    'Place the advance warning triangle supplied with vehicle approximately 3 m from the vehicle in direction of incoming traffic',
  ];
  
  breakdownInfo.forEach(text => {
    if (text === '') {
      yPos += 4;
      return;
    }
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
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
    yPos += 3;
  });
  
  // Save the PDF
  const fileName = `ASSIST_Policy_${record.registrationNo}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};