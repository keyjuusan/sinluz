import axios from "axios";

export const miApi = axios.create({
  baseURL: import.meta.env.BASE_URL_API,

})
