import { useNavigate } from "react-router-dom";
import { useDatabase } from "../context/DatabaseContext";
import PatientForm from "../components/PatientForm";
import { PatientFormData } from "../types";
import { Check } from "lucide-react";
import { useState } from "react";

const RegisterPatient = () => {
  const { registerPatient, loading } = useDatabase();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: PatientFormData) => {
    try {
      const newPatient = await registerPatient(data);
      setIsSuccess(true);

      // Redirect to patient details after a short delay
      setTimeout(() => {
        navigate(`/patients/${newPatient.id}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to register patient:", error);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Register New Patient
        </h1>
        <p className="text-gray-600 mt-1">
          Enter patient information to create a new record
        </p>
      </div>

      {isSuccess ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Patient Registered Successfully
          </h2>
          <p className="text-gray-600">
            The patient has been added to your records.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Redirecting to patient details...
          </p>
        </div>
      ) : (
        <PatientForm onSubmit={handleSubmit} isLoading={loading} />
      )}
    </div>
  );
};

export default RegisterPatient;
