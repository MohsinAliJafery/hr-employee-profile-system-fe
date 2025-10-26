import { useState } from 'react';

const StepEducation = ({ data, setData, next, prev }) => {
  const [entries, setEntries] = useState(data || []);

  const addEducation = () =>
    setEntries([
      ...entries,
      { degree: '', institute: '', year: '', file: null },
    ]);

  const handleChange = (index, e) => {
    const updated = [...entries];
    if (e.target.name === 'file') {
      updated[index][e.target.name] = e.target.files[0];
    } else {
      updated[index][e.target.name] = e.target.value;
    }
    setEntries(updated);
    setData(updated);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">🎓 Education Details</h2>

      {entries.map((edu, i) => (
        <div key={i} className="border p-3 rounded space-y-2">
          <input
            name="degree"
            value={edu.degree}
            onChange={(e) => handleChange(i, e)}
            placeholder="Degree"
            className="border p-2 w-full rounded"
          />
          <input
            name="institute"
            value={edu.institute}
            onChange={(e) => handleChange(i, e)}
            placeholder="Institute"
            className="border p-2 w-full rounded"
          />
          <input
            name="year"
            value={edu.year}
            onChange={(e) => handleChange(i, e)}
            placeholder="Passing Year"
            className="border p-2 w-full rounded"
          />
          <input
            type="file"
            name="file"
            onChange={(e) => handleChange(i, e)}
            className="w-full"
          />
        </div>
      ))}

      <button
        onClick={addEducation}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        + Add Another
      </button>

      <div className="flex justify-between">
        <button
          onClick={prev}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepEducation;
