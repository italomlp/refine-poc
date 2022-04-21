import React, { useCallback } from 'react';

import {
  Box,
  Divider,
  Drawer as MUIDrawer,
  List,
  Toolbar,
} from '@mui/material';

import DrawerRow, { DrawerRowOption } from '@/components/atoms/drawer-row';

type Props = {
  menuOptions: DrawerRowOption[];
  drawerWidth?: number;
  desktopDrawerOpen: boolean;
  mobileDrawerOpen: boolean;
  setDesktopDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Drawer({
  menuOptions,
  desktopDrawerOpen,
  mobileDrawerOpen,
  drawerWidth,
  setMobileDrawerOpen,
  setDesktopDrawerOpen,
}: Props) {
  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuOptions.map(option => (
          <DrawerRow {...option} key={option.name} />
        ))}
      </List>
    </div>
  );

  const handleMobileDrawerToggle = useCallback(() => {
    setMobileDrawerOpen(prev => !prev);
  }, [setMobileDrawerOpen]);

  const handleDesktopDrawerToggle = useCallback(() => {
    setDesktopDrawerOpen(prev => !prev);
  }, [setDesktopDrawerOpen]);

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: desktopDrawerOpen ? drawerWidth : 0 },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      <MUIDrawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </MUIDrawer>
      <MUIDrawer
        variant="persistent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open={desktopDrawerOpen}
        onClose={handleDesktopDrawerToggle}
      >
        {drawerContent}
      </MUIDrawer>
    </Box>
  );
}
