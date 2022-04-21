import { AuthProvider } from '@pankod/refine-core';

import { http } from '@/interfaces/http';
import { UserRole } from '@/models/roles';

const mockUsers = [
  {
    username: 'admin',
    password: 'admin',
    token: '123',
    role: UserRole.ADMIN,
  },
  {
    username: 'editor',
    password: 'editor',
    token: '321',
    role: UserRole.EDITOR,
  },
];

export const getAuthProvider = (
  onChangeLoggedUser: (user: typeof mockUsers[0] | null) => void
): AuthProvider => ({
  login: ({ username, password }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find(item => item.username === username);

    if (!user) {
      return Promise.reject();
    }

    if (user.password !== password) {
      return Promise.reject('Invalid username or password');
    }

    localStorage.setItem('auth', JSON.stringify(user));
    onChangeLoggedUser(user);

    http.defaults.headers.common = {
      Authorization: `Bearer ${user.token}`,
    };

    return Promise.resolve();
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
      onChangeLoggedUser(parsedUser);
      return Promise.resolve();
    }
    onChangeLoggedUser(null);
    return Promise.reject();
  },
  getPermissions: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return Promise.resolve(parsedUser.role);
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
