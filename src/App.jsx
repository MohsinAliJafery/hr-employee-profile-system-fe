import { Routes, Route, Navigate } from 'react-router-dom';
import DepartmentList from './pages/department/Departments.jsx';
import DocumentsList from './pages/documents/Documents.jsx';
import VisaTypeList from './pages/visa-types/VisaTypes.jsx';
import CountryList from './pages/countries/Countries.jsx';
import CityList from './pages/cities/Cities.jsx';
import DesignationList from './pages/designation/DesginationList.jsx';
import TitlesList from './pages/titles/Titles.jsx';
import ResidencyStatus from './pages/residency-status/ResidencyStatus.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Layout from './components/layout/Layout.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import Settings from './pages/settings/Settings.jsx';
import NationalityList from './pages/nationalities/NationalityList.jsx';
import EmployeeList from './pages/employee/Employees.jsx';
import EmployeeStatus from './pages/employeeStatus/employeeStatus.jsx';
import QualificationList from './pages/qualifications/QualificationsList.jsx';

const App = () => {

  return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Dashboard & nested routes - no protection */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employee/residencystatus" element={<ResidencyStatus />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="documents" element={<DocumentsList />} />
            <Route path="visatypes" element={<VisaTypeList />} />
            <Route path="countries" element={<CountryList />} />
            <Route path="cities" element={<CityList />} />
            <Route path="desginations" element={<DesignationList />} />
            <Route path="titles" element={<TitlesList />} />
            <Route path="nationalities" element={<NationalityList />} />
            <Route path="qualifications" element={<QualificationList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="status" element={<EmployeeStatus />} />
          </Route>
    
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
  );
};

export default App;
