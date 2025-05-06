import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PatientFormData } from '../types';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading: boolean;
}

const PatientForm = ({ onSubmit, isLoading }: PatientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PatientFormData>();
  
  const [activeTab, setActiveTab] = useState<'basic' | 'medical' | 'insurance'>('basic');

  const processSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data);
      reset();
      setActiveTab('basic');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="card animate-fadeIn p-6">
      <form onSubmit={handleSubmit(processSubmit)}>
        {/* Form tabs */}
        <div className="flex mb-6 border-b">
          <button
            type="button"
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === 'basic'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Information
          </button>
          <button
            type="button"
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === 'medical'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('medical')}
          >
            Medical Details
          </button>
          <button
            type="button"
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === 'insurance'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('insurance')}
          >
            Insurance
          </button>
        </div>

        {/* Basic information tab */}
        <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="label">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                className="input"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                className="input"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="label">
                Date of Birth *
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className="input"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
              />
              {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="label">
                Gender *
              </label>
              <select
                id="gender"
                className="input"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                id="email"
                type="email"
                className="input"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <p className="error-text">{errors.phone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="label">
                Address *
              </label>
              <textarea
                id="address"
                rows={3}
                className="input"
                {...register('address', { required: 'Address is required' })}
              ></textarea>
              {errors.address && <p className="error-text">{errors.address.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <div></div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab('medical')}
            >
              Next: Medical Details
            </button>
          </div>
        </div>

        {/* Medical details tab */}
        <div className={activeTab === 'medical' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="medicalHistory" className="label">
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                rows={4}
                className="input"
                placeholder="List any previous medical conditions, surgeries, etc."
                {...register('medicalHistory')}
              ></textarea>
            </div>

            <div>
              <label htmlFor="allergies" className="label">
                Allergies
              </label>
              <textarea
                id="allergies"
                rows={3}
                className="input"
                placeholder="List any allergies to medications, food, etc."
                {...register('allergies')}
              ></textarea>
            </div>

            <div>
              <label htmlFor="emergencyContact" className="label">
                Emergency Contact
              </label>
              <input
                id="emergencyContact"
                type="text"
                className="input"
                placeholder="Name and phone number"
                {...register('emergencyContact')}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setActiveTab('basic')}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab('insurance')}
            >
              Next: Insurance
            </button>
          </div>
        </div>

        {/* Insurance tab */}
        <div className={activeTab === 'insurance' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="insuranceProvider" className="label">
                Insurance Provider
              </label>
              <input
                id="insuranceProvider"
                type="text"
                className="input"
                {...register('insuranceProvider')}
              />
            </div>

            <div>
              <label htmlFor="insuranceNumber" className="label">
                Insurance Policy Number
              </label>
              <input
                id="insuranceNumber"
                type="text"
                className="input"
                {...register('insuranceNumber')}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setActiveTab('medical')}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;