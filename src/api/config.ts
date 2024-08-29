import axios from 'axios';

const API_URL = 'https://appsvc-eastus-api-dev-fzepdseua9bjhkdv.eastus-01.azurewebsites.net';
const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : API_URL,
  withCredentials: true,
});

export default axiosInstance;

export const appleSignInRedirectURI = import.meta.env.DEV
  ? 'https://dinosaur-good-terrapin.ngrok-free.app/signin'
  : 'https://appsvc-eaus-api-dev.azurewebsites.net/signin';
