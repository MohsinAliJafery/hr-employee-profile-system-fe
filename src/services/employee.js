import api from './api';

export const employeeAPI = {
  // Get all employees
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  // Get single employee
  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee with file upload
  createEmployee: async (formData) => {
    const response = await api.post('/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update employee with file upload
  updateEmployee: async (id, formData) => {
    const response = await api.patch(`/employees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export default employeeAPI;