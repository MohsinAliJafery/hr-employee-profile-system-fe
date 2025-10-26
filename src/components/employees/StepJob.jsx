import { useEffect, useMemo, useState } from 'react';

const StepJob = ({ data, setData, prev, submit }) => {
  const [jobTitles, setJobTitles] = useState([]);

  const departments = useMemo(
    () => ({
      IT: [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Engineer',
        'DevOps Engineer',
      ],
      HR: ['HR Manager', 'Recruiter', 'Training Officer'],
      Finance: ['Accountant', 'Finance Manager', 'Payroll Officer'],
      Marketing: [
        'Marketing Executive',
        'SEO Specialist',
        'Social Media Manager',
      ],
      Operations: ['Operations Manager', 'Coordinator', 'Supervisor'],
    }),
    []
  );

  // 🧠 Update job titles when department changes
  useEffect(() => {
    if (data.department) {
      setJobTitles(departments[data.department]);
    } else {
      setJobTitles([]);
    }
  }, [data.department, departments]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">💼 Job Information</h2>

      {/* 🏢 Department Dropdown */}
      <select
        name="department"
        value={data.department}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="">Select Department</option>
        {Object.keys(departments).map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* 👔 Job Title Dropdown (dynamic) */}
      <select
        name="title"
        value={data.title}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={!data.department}
      >
        <option value="">Select Job Title</option>
        {jobTitles.map((job) => (
          <option key={job} value={job}>
            {job}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-sm">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={data.startDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm">Salary</label>
          <input
            type="number"
            name="salary"
            value={data.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={prev}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ← Back
        </button>
        <button
          onClick={submit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Submit
        </button>
      </div>
    </div>
  );
};

export default StepJob;
