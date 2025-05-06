import { useNavigate } from 'react-router-dom';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div 
      className="card hover:scale-[1.01] cursor-pointer p-4"
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">
          {patient.firstName} {patient.lastName}
        </h3>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>Added: {formatDate(patient.createdAt)}</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <User size={16} className="mr-2 text-teal-600" />
          <span>{patient.gender}, DOB: {patient.dateOfBirth}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Mail size={16} className="mr-2 text-teal-600" />
          <span>{patient.email}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Phone size={16} className="mr-2 text-teal-600" />
          <span>{patient.phone}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
        <button 
          className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/patients/${patient.id}`);
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default PatientCard;