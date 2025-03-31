import axios from "axios";

const clientBaseURL = "http://localhost:5001";
const serverBaseURL = "http://server:5001";

export const clientApi = axios.create({
  baseURL: clientBaseURL,
  withCredentials: true,
});

export const serverApi = axios.create({
  baseURL: serverBaseURL,
  withCredentials: true,
});
