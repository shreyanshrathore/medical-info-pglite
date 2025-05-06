import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { ChevronLeft, User, Mail, Phone, MapPin, AlertTriangle, Heart, Shield, Calendar } from 'lucide-react';
import { Patient } from '../types';

const ViewPatient = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatient } = useDatabase();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!id || isNaN(parseInt(id))) {
          setError('Invalid patient ID');
          return;
        }

        const patientData = await getPatient(parseInt(id));
        if (!patientData) {
          setError('Patient not found');
          return;
        }
        
        setPatient(patientData);
      } catch (err) {
        setError('Failed to fetch patient data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, getPatient]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading patient data...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-red-500 mb-4">
          <AlertTriangle size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">{error || 'Patient not found'}</h3>
        <p className="text-gray-600 mb-6">Unable to display patient information</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors mb-2"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">
          {patient.firstName} {patient.lastName}
        </h1>
        <p className="text-gray-600 mt-1">
          Patient ID: {patient.id} | Added on {formatDate(patient.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <User size={20} className="mr-2 text-teal-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-gray-900">{patient.firstName} {patient.lastName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1 text-gray-900">{patient.dateOfBirth}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="mt-1 text-gray-900 capitalize">{patient.gender.replace('-', ' ')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-900 flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  {patient.email}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-gray-900 flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {patient.phone}
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-gray-900 flex items-start">
                  <MapPin size={16} className="mr-2 text-gray-400 mt-1 flex-shrink-0" />
                  {patient.address}
                </p>
              </div>
            </div>
          </div>
          
          {/* Medical info */}
          <div className="card p-6 mt-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <Heart size={20} className="mr-2 text-teal-600" />
              Medical Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                <p className="mt-1 text-gray-900">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                <p className="mt-1 text-gray-900">
                  {patient.allergies || 'No allergies recorded'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                <p className="mt-1 text-gray-900">
                  {patient.emergencyContact || 'No emergency contact recorded'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Insurance and record info */}
        <div>
          <div className="card p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <Shield size={20} className="mr-2 text-teal-600" />
              Insurance Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Insurance Provider</h3>
                <p className="mt-1 text-gray-900">
                  {patient.insuranceProvider || 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Policy Number</h3>
                <p className="mt-1 text-gray-900">
                  {patient.insuranceNumber || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6 mt-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-teal-600" />
              Record Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Record Created</h3>
                <p className="mt-1 text-gray-900">{formatDate(patient.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-gray-900">{formatDate(patient.updatedAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                <p className="mt-1 text-gray-900">#{patient.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;