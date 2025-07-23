import axios from 'axios';


const BACK_URL = import.meta.env.VITE_URL_API;

export const backApi = axios.create({
    baseURL: BACK_URL,
    headers: {
      "Content-Type": "application/json",
       'x-api-key': 'reqres-free-v1'
    },
  });