import { AuthProvider } from '@pankod/refine-core';
import { AxiosError } from 'axios';

import { http } from '@/interfaces/http';
import { appDataProvider } from '@/providers/data';

type IAuthUser = {
  username: string;
  password: string;
};

type IUser = {
  email: string;
  token: string;
};

const setAuthTokenHeader = (token: string) => {
  http.defaults.headers.common = {
    authentication: token,
  };
};

export const getAuthProvider = (
  onChangeLoggedUser: (user: IUser | null) => void
): AuthProvider => ({
  login: async ({ username, password }: IAuthUser) => {
    try {
      const response = await appDataProvider.custom!({
        url: 'signin/',
        method: 'post',
        payload: {
          user: {
            email: username,
            password,
          },
        },
      });

      const user = {
        email: username,
        token: response.data.access_token,
      };

      localStorage.setItem('auth', JSON.stringify(user));
      onChangeLoggedUser(user);

      setAuthTokenHeader(user.token);
    } catch (error) {
      throw new Error((error as AxiosError)?.response?.data?.message);
    }
  },
  logout: () => {
    localStorage.removeItem('auth');
    onChangeLoggedUser(null);
    return Promise.resolve();
  },
  checkError: error => {
    if (error.status === 401) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const parsedUser = JSON.parse(auth);
      setAuthTokenHeader(parsedUser.token);
      onChangeLoggedUser(parsedUser);
      return Promise.resolve();
    }
    onChangeLoggedUser(null);
    return Promise.reject();
  },
  getPermissions: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      return Promise.resolve('admin');
    }
    return Promise.reject();
  },
  getUserIdentity: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return Promise.resolve(parsedUser);
    }
    return Promise.reject();
  },
});
