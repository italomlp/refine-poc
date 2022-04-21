import React, { useMemo } from 'react';

import { Category, DynamicFeed } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { Refine } from '@pankod/refine-core';
import routerProvider from '@pankod/refine-react-router-v6';

import { UserRole } from '@/models/roles';
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
  resourceName as categoriesResourceName,
} from '@/pages/categories';
import Layout from '@/pages/layout';
import {
  PostCreate,
  PostEdit,
  PostList,
  PostShow,
  resourceName as postsResourceName,
} from '@/pages/posts';
import { getAccessControlProvider } from '@/providers/access-control';
import { getAuthProvider } from '@/providers/auth';
import { appDataProvider } from '@/providers/data';

export default function App() {
  const [role, setRole] = React.useState<UserRole | null>(null);
  const authProvider = useMemo(
    () =>
      getAuthProvider(user => {
        setRole(user ? user.role : null);
      }),
    []
  );
  const accessControlProvider = useMemo(
    () => getAccessControlProvider(role),
    [role]
  );

  return (
    <>
      <CssBaseline />
      <Refine
        routerProvider={routerProvider}
        dataProvider={appDataProvider}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        resources={[
          {
            name: postsResourceName,
            icon: <DynamicFeed />,
            list: PostList,
            show: PostShow,
            edit: PostEdit,
            create: PostCreate,
            options: {
              label: 'Posts',
            },
          },
          {
            name: categoriesResourceName,
            icon: <Category />,
            list: CategoryList,
            show: CategoryShow,
            edit: CategoryEdit,
            create: CategoryCreate,
            options: {
              label: 'Categories',
            },
          },
        ]}
        Layout={Layout}
      />
    </>
  );
}
