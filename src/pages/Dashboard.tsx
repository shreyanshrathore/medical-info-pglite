import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDatabase } from "../context/DatabaseContext";
import PatientCard from "../components/PatientCard";
import { UserPlus, Search, Database } from "lucide-react";

const Dashboard = () => {
  const { patients, loading, refreshPatients } = useDatabase();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshPatients();
  }, [refreshPatients]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Patient Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your patient records</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="btn btn-primary flex items-center justify-center"
          >
            <UserPlus size={18} className="mr-2" />
            New Patient
          </Link>
          <Link
            to="/query"
            className="btn btn-outline flex items-center justify-center"
          >
            <Database size={18} className="mr-2" />
            Query Data
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-teal-500">
          <h3 className="text-gray-500 font-medium text-sm">Total Patients</h3>
          <p className="text-2xl font-semibold mt-1">{patients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 font-medium text-sm">Recent Patients</h3>
          <p className="text-2xl font-semibold mt-1">
            {
              patients.filter(
                (p) =>
                  new Date(p.createdAt) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length
            }
          </p>
        </div>
      </div>

      {/* Patient list */}
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Patient Records
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading patients...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-teal-600 mb-4">
            <UserPlus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No patients yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by registering your first patient
          </p>
          <Link to="/register" className="btn btn-primary">
            Register Patient
          </Link>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No patients match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
