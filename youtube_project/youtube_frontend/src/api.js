import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
export { BASE_URL };
