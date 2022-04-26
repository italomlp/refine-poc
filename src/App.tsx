import React, { useMemo } from 'react';

import { SupervisedUserCircle } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { Refine } from '@pankod/refine-core';
import routerProvider from '@pankod/refine-react-router-v6';

import { UserRole } from '@/models/roles';
import Layout from '@/pages/layout';
import {
  resourceName as rolesResourceName,
  RolesCreate,
  RolesList,
  title as rolesTitle,
} from '@/pages/roles';
import { getAccessControlProvider } from '@/providers/access-control';
import { getAuthProvider } from '@/providers/auth';
import { appDataProvider } from '@/providers/data';

export default function App() {
  const [role, setRole] = React.useState<UserRole | null>(null);
  const authProvider = useMemo(
    () =>
      getAuthProvider(user => {
        setRole(user ? UserRole.ADMIN : null);
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
            name: rolesResourceName,
            icon: <SupervisedUserCircle />,
            list: RolesList,
            create: RolesCreate,
            options: {
              label: rolesTitle,
            },
          },
        ]}
        // resources={[
        //   {
        //     name: postsResourceName,
        //     icon: <DynamicFeed />,
        //     list: PostList,
        //     show: PostShow,
        //     edit: PostEdit,
        //     create: PostCreate,
        //     options: {
        //       label: 'Posts',
        //     },
        //   },
        //   {
        //     name: categoriesResourceName,
        //     icon: <Category />,
        //     list: CategoryList,
        //     show: CategoryShow,
        //     edit: CategoryEdit,
        //     create: CategoryCreate,
        //     options: {
        //       label: 'Categories',
        //     },
        //   },
        // ]}
        Layout={Layout}
      />
    </>
  );
}
