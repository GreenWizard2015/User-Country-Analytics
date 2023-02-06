import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from 'store/notificationsSlice';

function HttpErrorNotification() {
  const dispatch = useDispatch();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        dispatch(addNotification({
          title: error.config.url,
          message: error.message,
          type: 'error',
        }));

        return Promise.reject(error);
      }
    );

    // Remove the interceptor when the component unmounts
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
}

export default HttpErrorNotification;
