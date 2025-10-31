// services/employee.js
import api from './api';

export const employeeAPI = {
  // Create new employee with file upload
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get employee by ID
  getEmployeeById: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update employee with file upload
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/employees/${employeeId}`, employeeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all employees
  getAllEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default employeeAPI;