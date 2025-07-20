import React, { useState } from 'react';
import { Car, FileText, Database, Download, LogOut, User } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import ServiceRecordForm from './components/ServiceRecordForm';
import ServiceRecordTable from './components/ServiceRecordTable';
import { VehicleServiceRecord } from './types';
import { generateServiceRecordPDF, generateBulkPDF } from './utils/pdfGenerator';
import { generatePolicyPDF } from './utils/policyPdfGenerator';
import { exportToExcel, exportToCSV } from './utils/exportUtils';
import { useAuth } from './hooks/useAuthUser';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase/config';

function App() {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [records, setRecords] = useState<VehicleServiceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<VehicleServiceRecord | null>(null);

  React.useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'serviceRecords'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as VehicleServiceRecord));
      setRecords(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddRecord = async (newRecord: VehicleServiceRecord) => {
    try {
      const recordWithUser = { ...newRecord, userId: user?.id };

      if (editingRecord) {
        const docRef = doc(db, 'serviceRecords', editingRecord.id);
        await updateDoc(docRef, recordWithUser);
        setEditingRecord(null);
      } else {
        await addDoc(collection(db, 'serviceRecords'), recordWithUser);
      }
    } catch (err) {
      console.error('Error saving record:', err);
    }
  };

  const handleEditRecord = (record: VehicleServiceRecord) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteDoc(doc(db, 'serviceRecords', id));
    }
  };

  const cancelEdit = () => setEditingRecord(null);

  const handleGeneratePDF = (record: VehicleServiceRecord) => generateServiceRecordPDF(record);
  const handleGeneratePolicyPDF = (record: VehicleServiceRecord) => generatePolicyPDF(record);
  const handleGenerateBulkPDF = () => {
    if (records.length === 0) return alert('No records available to generate PDF');
    generateBulkPDF(records);
  };

  const handleExportExcel = () => records.length > 0 ? exportToExcel(records) : alert('No records to export');
  const handleExportCSV = () => records.length > 0 ? exportToCSV(records) : alert('No records to export');

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `service_records_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (Array.isArray(imported)) {
          for (const rec of imported) {
            await addDoc(collection(db, 'serviceRecords'), { ...rec, userId: user?.id });
          }
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch {
        alert('Error importing data');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-xl mr-3">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">ASSIST Management System</h1>
                  <p className="text-blue-100">Age-based Service Support & Eligibility Tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-blue-100">
                  <Database className="w-4 h-4 mr-1 text-white" />
                  {records.length} Records
                </div>
                <div className="flex items-center text-sm text-blue-100">
                  <User className="w-4 h-4 mr-1 text-white" />
                  Workshop Admin
                </div>
                {records.length > 0 && (
                  <button
                    onClick={handleGenerateBulkPDF}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 flex items-center border border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Bulk PDF
                  </button>
                )}
                <button
                  onClick={logout}
                  className="bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-500/30 flex items-center border border-red-300/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg">Export Excel</button>
              <button onClick={handleExportCSV} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Export CSV</button>
              <button onClick={handleExportData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Export Data</button>
              <label className="bg-teal-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                Import Data
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              {editingRecord && (
                <button onClick={cancelEdit} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Cancel Edit</button>
              )}
            </div>
          </div>

          <ServiceRecordForm onSubmit={handleAddRecord} initialData={editingRecord || undefined} isEditing={!!editingRecord} />
          <ServiceRecordTable
            records={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onGeneratePDF={handleGeneratePDF}
            onGeneratePolicyPDF={handleGeneratePolicyPDF}
          />
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page or auth form
  if (showAuth) {
    return (
      <AuthForm 
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default App;
