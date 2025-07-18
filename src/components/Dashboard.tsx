import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Enquiry } from '../types';
import { Car, Clock, CheckCircle, XCircle, Edit, Trash2, Plus, LogOut } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let q;
    if (user.role === 'admin') {
      q = query(collection(db, 'ASSIST'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'ASSIST'), where('createdBy', '==', user.id));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const enquiriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Enquiry[];

      // Sort client-side for non-admin users to avoid composite index requirement
      const sortedEnquiries = user.role === 'admin' 
        ? enquiriesData 
        : enquiriesData.sort((a, b) => {
            const dateA = a.createdAt?.getTime() || 0;
            const dateB = b.createdAt?.getTime() || 0;
            return dateB - dateA;
          });
      
      setEnquiries(sortedEnquiries);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const updateStatus = async (enquiryId: string, newStatus: Enquiry['status']) => {
    try {
      await updateDoc(doc(db, 'ASSIST', enquiryId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEnquiry = async (enquiryId: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await deleteDoc(doc(db, 'ASSIST', enquiryId));
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Edit className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowForm(false)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
          <EnquiryForm onSuccess={() => setShowForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ASSIST Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Enquiry
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No enquiries yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first service enquiry</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Enquiry
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{enquiry.customerName}</h3>
                    <p className="text-gray-600">{enquiry.vehicleModel} - {enquiry.registrationNo}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(enquiry.status)}`}>
                      {getStatusIcon(enquiry.status)}
                      <span className="ml-1 capitalize">{enquiry.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{enquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{enquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-medium">{enquiry.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Workshop</p>
                    <p className="font-medium">{enquiry.workshopName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{enquiry.createdAt?.toLocaleDateString()}</p>
                  </div>
                </div>

                {enquiry.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">{enquiry.description}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {enquiry.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => updateStatus(enquiry.id, 'in-progress')}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateStatus(enquiry.id, 'completed')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {enquiry.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(enquiry.id, 'cancelled')}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteEnquiry(enquiry.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};