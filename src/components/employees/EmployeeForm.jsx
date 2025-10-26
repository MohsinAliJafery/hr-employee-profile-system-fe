import { useState } from 'react';
import StepPersonal from './StepPersonal';
import StepEducation from './StepEducation';
import StepJob from './StepJob';

const EmployeeForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      nationality: '',
      visaType: '',
      validUntil: '',
      document: '',
    },
    education: [], // multiple entries
    job: {
      department: '',
      title: '',
      startDate: '',
      salary: '',
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const form = new FormData();

    // append personal
    Object.entries(formData.personal).forEach(([key, value]) => {
      form.append(`personal[${key}]`, value);
    });

    // append education
    formData.education.forEach((edu, index) => {
      Object.entries(edu).forEach(([key, value]) => {
        form.append(`education[${index}][${key}]`, value);
      });
    });

    // append job
    Object.entries(formData.job).forEach(([key, value]) => {
      form.append(`job[${key}]`, value);
    });

    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        body: form,
      });
      if (res.ok) {
        alert('Employee record created successfully!');
      } else {
        alert('Failed to save employee record');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Employee Registration
      </h1>

      {step === 1 && (
        <StepPersonal
          data={formData.personal}
          setData={(d) =>
            setFormData((prev) => ({ ...prev, personal: { ...d } }))
          }
          next={nextStep}
        />
      )}
      {step === 2 && (
        <StepEducation
          data={formData.education}
          setData={(d) => setFormData((prev) => ({ ...prev, education: d }))}
          next={nextStep}
          prev={prevStep}
        />
      )}
      {step === 3 && (
        <StepJob
          data={formData.job}
          setData={(d) => setFormData((prev) => ({ ...prev, job: d }))}
          prev={prevStep}
          submit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeForm;
