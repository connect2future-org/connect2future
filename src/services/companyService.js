import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

export const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error.message);
    throw error;
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch company ${id}:`, error);
    throw error;
  }
};