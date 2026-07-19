import axios from "axios";

const coreApi = axios.create({
  baseURL:
    import.meta.env.VITE_CORE_API_URL ||
    "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default coreApi;