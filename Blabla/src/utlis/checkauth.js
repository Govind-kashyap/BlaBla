import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Login
export const loginUser = async (data) => {
  try {
    const res = await API.post("/api/user/login", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false };
  }
};

// Register
export const registerUser = async (data) => {
  try {
    const res = await API.post("/api/user/register", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false };
  }
};

// Check auth (session alive or not)
export const checkAuth = async () => {
  try {
    const res = await API.get("/api/user/check-auth");
    return res.status === 200;
  } catch {
    return false;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await API.post("/api/user/logout");
    return true;
  } catch {
    return false;
  }
};
