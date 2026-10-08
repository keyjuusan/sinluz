import axios from "axios";

export const miApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,

})
