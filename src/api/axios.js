import axios from "axios";

export default axios.create({
    baseURL: 'https://pettycash-manager1995.onrender.com',
})

export const axiosPrivate = axios.create({
  baseURL: 'https://pettycash-manager1995.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

