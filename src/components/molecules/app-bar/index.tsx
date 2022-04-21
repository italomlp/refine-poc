import React, { useMemo, useState } from 'react';

import {
  AccountCircle,
  Logout,
  Menu as MenuIcon,
  MenuOpen,
} from '@mui/icons-material';
import {
  AppBar as MUIAppBar,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

type Props = {
  handleMobileDrawerToggle: () => void;
  handleDesktopDrawerToggle: () => void;
  desktopOpen: boolean;
  title: string;
  username?: string;
  onLogout: () => void;
};

export default function AppBar({
  handleMobileDrawerToggle,
  handleDesktopDrawerToggle,
  desktopOpen,
  title,
  username,
  onLogout,
}: Props) {
  const appBarStyles = useMemo<SxProps<Theme>>(
    () => ({
      zIndex: theme => theme.zIndex.drawer + 1,
    }),
    []
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <MUIAppBar position="fixed" sx={appBarStyles}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMobileDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="toggle desktop drawer"
          edge="start"
          onClick={handleDesktopDrawerToggle}
          sx={theme => ({
            mr: 2,
            [theme.breakpoints.down('sm')]: { display: 'none' },
          })}
        >
          {desktopOpen ? <MenuOpen /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap component="div">
          {title}
        </Typography>
        <div>
          <Button
            onClick={handleMenu}
            color="inherit"
            startIcon={<AccountCircle />}
          >
            {username}
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MUIAppBar>
  );
}
