import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getInsights = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/insights`, { params });
    return response.data;
  } catch (error) {
    console.error("Backend insights fetch error:", error.message);
    throw error;
  }
};

export const getInsightById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/insights/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch insight ${id}:`, error);
    throw error;
  }
};

export const createInsight = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/insights`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to create insight:", error);
    throw error;
  }
};

export const updateInsight = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/insights/${id}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to update insight ${id}:`, error);
    throw error;
  }
};

export const deleteInsight = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/insights/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to delete insight ${id}:`, error);
    throw error;
  }
};