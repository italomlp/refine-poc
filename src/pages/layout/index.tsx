import React from 'react';

import { Box, Toolbar } from '@mui/material';
import {
  LayoutProps,
  useGetIdentity,
  useLogout,
  useNavigation,
  useResource,
} from '@pankod/refine-core';

import AppBar from '@/components/molecules/app-bar';
import Drawer from '@/components/molecules/drawer';

const drawerWidth = 240;

export default function Layout({
  children,
}: React.PropsWithChildren<LayoutProps>) {
  const { resources } = useResource();
  const { list, create } = useNavigation();
  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);

  const handleMobileDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        handleMobileDrawerToggle={handleMobileDrawerToggle}
        handleDesktopDrawerToggle={handleDesktopDrawerToggle}
        desktopOpen={desktopOpen}
        title="Refine POC"
        username={identity?.username}
        onLogout={logout}
      />
      <Drawer
        desktopDrawerOpen={desktopOpen}
        setDesktopDrawerOpen={setDesktopOpen}
        mobileDrawerOpen={mobileOpen}
        setMobileDrawerOpen={setMobileOpen}
        drawerWidth={drawerWidth}
        menuOptions={resources.map(({ name, icon, canCreate, options }) => ({
          name,
          text: options?.label || name,
          icon,
          onClick: () => list(name),
          onClickAdd: canCreate ? () => create(name) : undefined,
        }))}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            pb: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
