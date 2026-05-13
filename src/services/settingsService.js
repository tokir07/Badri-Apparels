import api from './axios';

export const settingsService = {
  getAllSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch settings' };
    }
  },

  getSettingsByGroup: async (groupName) => {
    try {
      const response = await api.get(`/admin/settings/group/${groupName}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || `Failed to fetch ${groupName} settings` };
    }
  },

  updateSettingsBulk: async (settings) => {
    try {
      const response = await api.post('/admin/settings/bulk', settings);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update settings' };
    }
  },

  updateSetting: async (key, value) => {
    try {
      const response = await api.post(`/admin/settings?key=${key}&value=${value}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update setting' };
    }
  }
};
