import React, { useCallback, useContext } from 'react';
import { ENV } from '../constants/constants';
import { Firebase, FirebaseContext } from '../firebase';
import { updateUser } from '../store/actions';
import { Context } from '../store/Store';
import axios from './axios.instance';
import { ToastService } from './ToastService';

export const useLogin = () => {
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const baseUrl = window.location.origin;
  const toast = new ToastService();

  const login = useCallback(async () => {
    if (!code || !firebase) return;
    try {
      const res: any = await axios.post(`${ENV.base_url}/login`, {
        code,
        redirectUrl: `${baseUrl}/login`,
      });
      await firebase.signInWithCustomToken(res.data);
      const user: any = await firebase.getCurrentUser();
      const token = await user.user.getIdToken();
      await axios.get(`${ENV.base_url}/session`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } catch (err: any) {
      toast.errorToast('Error loggin in', err.message);
    } finally {
      window.location.replace(baseUrl);
    }
  }, []);

  return login;
};

export const useSignedInUser = () => {
  const [state, dispatch] = useContext(Context);
  const firebase = useContext<Firebase | null>(FirebaseContext);

  const fetchSignedInUser = useCallback(async () => {
    if (!firebase) return;
    try {
      // Get current user
      dispatch(updateUser(await firebase.getCurrentUser()));
    } catch (err: any) {
      // Try to sign in with cookie if no user found
      try {
        const res = await axios.get(`${ENV.base_url}/loginWithCookie`, {
          withCredentials: true,
        });
        await firebase.signInWithCustomToken(res.data);
        dispatch(updateUser(await firebase.getCurrentUser()));
      } catch (err: any) {
        // Dont handle
      }
    }
  }, []);

  return fetchSignedInUser;
};
