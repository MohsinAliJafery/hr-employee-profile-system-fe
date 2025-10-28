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
  Legend,
} from 'recharts';
import { Users, Shield, Clock, AlertTriangle, TrendingUp, Building, Globe, Calendar } from 'lucide-react';

const Dashboard = () => {
  // ✅ Dummy Data
  const visaStatusData = [
    { name: 'Valid > 3 Months', value: 227, color: '#10b981' },
    { name: 'Expiring < 3 Months', value: 18, color: '#f59e0b' },
    { name: 'Expiring < 14 Days', value: 5, color: '#ef4444' },
  ];

  const departmentData = [
    { name: 'HR', employees: 10, fill: '#3b82f6' },
    { name: 'IT', employees: 30, fill: '#8b5cf6' },
    { name: 'Finance', employees: 12, fill: '#06b6d4' },
    { name: 'Marketing', employees: 15, fill: '#f97316' },
    { name: 'Operations', employees: 20, fill: '#84cc16' },
  ];

  const nationalityData = [
    { name: 'Pakistani', value: 45, color: '#2563eb' },
    { name: 'Indian', value: 20, color: '#f97316' },
    { name: 'Filipino', value: 15, color: '#10b981' },
    { name: 'Saudi', value: 10, color: '#8b5cf6' },
    { name: 'Others', value: 10, color: '#64748b' },
  ];

  const expiryTrendData = [
    { month: 'Oct', expiring: 5, target: 3 },
    { month: 'Nov', expiring: 8, target: 5 },
    { month: 'Dec', expiring: 12, target: 8 },
    { month: 'Jan', expiring: 9, target: 6 },
    { month: 'Feb', expiring: 6, target: 4 },
  ];

  // Custom label for pie charts
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive overview of employee profiles and visa status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold mt-2">250</p>
                <p className="text-blue-100 text-xs mt-1">Active workforce</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Valid Visas</p>
                <p className="text-3xl font-bold mt-2">227</p>
                <p className="text-green-100 text-xs mt-1">&gt; 3 months remaining</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Expiring Soon</p>
                <p className="text-3xl font-bold mt-2">18</p>
                <p className="text-amber-100 text-xs mt-1">&lt; 3 months remaining</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Urgent Renewals</p>
                <p className="text-3xl font-bold mt-2">5</p>
                <p className="text-red-100 text-xs mt-1">&lt; 14 days remaining</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Visa Status Chart */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Visa Validity Status</h2>
                <p className="text-gray-600 text-sm">Distribution of employee visa status</p>
              </div>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visaStatusData}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {visaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Employees */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Department Distribution</h2>
                <p className="text-gray-600 text-sm">Employee count by department</p>
              </div>
              <Building className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                />
                <Bar 
                  dataKey="employees" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Nationality Breakdown */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Nationality Breakdown</h2>
                <p className="text-gray-600 text-sm">Employee distribution by nationality</p>
              </div>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nationalityData}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {nationalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Residency Expiry Trend */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Visa Expiry Trend</h2>
                <p className="text-gray-600 text-sm">Monthly visa expiry forecast</p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expiryTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                />
                <Line 
                  type="monotone" 
                  dataKey="expiring" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                  name="Expiring Visas"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: 3 }}
                  name="Target"
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Visa Duration</p>
                <p className="font-semibold text-gray-900">18 Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Renewals This Month</p>
                <p className="font-semibold text-gray-900">24 Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="font-semibold text-gray-900">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;