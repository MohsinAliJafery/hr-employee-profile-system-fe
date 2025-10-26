import { useState, useEffect, useMemo } from 'react';

const StepPersonal = ({ data, setData, next }) => {
  const [cities, setCities] = useState([]);

  const countries = useMemo(() => {
    return [
      { name: 'Pakistan', cities: ['Lahore', 'Karachi', 'Islamabad'] },
      {
        name: 'United Kingdom',
        cities: ['London', 'Manchester', 'Birmingham'],
      },
      { name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Dammam'] },
      {
        name: 'United Arab Emirates',
        cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
      },
    ];
  }, []);

  const nationalities = [
    'Pakistani',
    'British',
    'Indian',
    'Saudi',
    'Emirati',
    'Bangladeshi',
    'Other',
  ];

  const visaTypes = [
    'Work Visa',
    'Residence Permit',
    'Employment Visa',
    'Student Visa',
    'Visit Visa',
    'Dependent Visa',
  ];

  // 🧩 Handle input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🌍 Update cities when country changes
  useEffect(() => {
    const selectedCountry = countries.find((c) => c.name === data.country);
    setCities(selectedCountry ? selectedCountry.cities : []);
  }, [data.country, countries]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">👤 Personal Information</h2>

      <input
        name="firstName"
        value={data.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="border p-2 w-full rounded"
      />
      <input
        name="middleName"
        value={data.middleName}
        onChange={handleChange}
        placeholder="Middle Name"
        className="border p-2 w-full rounded"
      />

      <input
        name="lastName"
        value={data.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="border p-2 w-full rounded"
      />

      <input
        name="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />

      <input
        name="phone"
        value={data.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border p-2 w-full rounded"
      />

      {/* 🌍 Country Dropdown */}
      <select
        name="country"
        value={data.country}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      {/* 🏙 City Dropdown */}
      <select
        name="city"
        value={data.city}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={!data.country}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* 🏠 Address Input */}
      <input
        name="address"
        value={data.address}
        onChange={handleChange}
        placeholder="Street Address / Area"
        className="border p-2 w-full rounded"
      />

      <h3 className="text-lg font-semibold mt-4">🛂 Residency Info</h3>

      {/* 🌐 Nationality Dropdown */}
      <select
        name="nationality"
        value={data.nationality}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="">Select Nationality</option>
        {nationalities.map((nation) => (
          <option key={nation} value={nation}>
            {nation}
          </option>
        ))}
      </select>

      {/* 🪪 Visa Type Dropdown */}
      <select
        name="visaType"
        value={data.visaType}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="">Select Visa Type</option>
        {visaTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label className="block text-gray-600 text-sm">Visa Valid Until</label>
      <input
        type="date"
        name="validUntil"
        value={data.validUntil}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <label className="block text-gray-600 text-sm">
        Visa Status Document
      </label>
      <input
        type="file"
        name="documents"
        value={data.document}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <div className="flex justify-end">
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

export default StepPersonal;
