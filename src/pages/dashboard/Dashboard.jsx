import { Card, CardContent } from '../../components/ui/card.jsx';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const Dashboard = () => {
  // ✅ Dummy Data
  const visaStatusData = [
    { name: 'Valid > 3 Months', value: 227, color: '#16a34a' },
    { name: 'Expiring < 3 Months', value: 18, color: '#eab308' },
    { name: 'Expiring / < 14 Days', value: 5, color: '#dc2626' },
  ];

  const departmentData = [
    { name: 'HR', value: 10 },
    { name: 'IT', value: 30 },
    { name: 'Finance', value: 12 },
    { name: 'Marketing', value: 15 },
    { name: 'Operations', value: 20 },
  ];

  const nationalityData = [
    { name: 'Pakistani', value: 45, color: '#2563eb' },
    { name: 'Indian', value: 20, color: '#f97316' },
    { name: 'Filipino', value: 15, color: '#10b981' },
    { name: 'Saudi', value: 10, color: '#9333ea' },
    { name: 'Others', value: 10, color: '#94a3b8' },
  ];

  const expiryTrendData = [
    { month: 'Oct', expiring: 5 },
    { month: 'Nov', expiring: 8 },
    { month: 'Dec', expiring: 12 },
    { month: 'Jan', expiring: 9 },
    { month: 'Feb', expiring: 6 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">
        Employee Profile Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-500 text-white shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-sm">Total Employees</h2>
            <p className="text-3xl font-bold mt-2">250</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500 text-white shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-sm">{'Valid > 3 Months'}</h2>
            <p className="text-3xl font-bold mt-2">227</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500 text-white shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-sm">{'Expiring < 3 Months'}</h2>
            <p className="text-3xl font-bold mt-2">18</p>
          </CardContent>
        </Card>

       <Card className="bg-red-500 text-white shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-sm">{'Expiring < 14 Days'}</h2>
            <p className="text-3xl font-bold mt-2">5</p>
          </CardContent>
        </Card>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Visa Status Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Visa Validity Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={visaStatusData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {visaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Employees */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Department-wise Employees
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Nationality Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Nationality Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={nationalityData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {nationalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                Pakistani
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Residency Expiry Trend */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Residency Expiry Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={expiryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="expiring"
                  stroke="#dc2626"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
