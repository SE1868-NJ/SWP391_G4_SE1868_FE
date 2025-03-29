import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const setupAxiosInterceptors = (navigate, setIsLoginPopupOpen) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('shipperId');
            localStorage.removeItem('shipperName');
            
            navigate('/');
            setIsLoginPopupOpen(true);
            
            throw new Error('Token expired');
          }
        } catch (error) {
          console.error('Token validation error:', error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('shipperId');
        localStorage.removeItem('shipperName');
        
        navigate('/');
        setIsLoginPopupOpen(true);
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;