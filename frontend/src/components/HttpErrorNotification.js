import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from 'store/notificationsSlice';

function HttpErrorNotification() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.interceptors.response.use(
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
  }, [dispatch]);
}

export default HttpErrorNotification;
