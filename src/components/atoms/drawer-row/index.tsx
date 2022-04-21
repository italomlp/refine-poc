import React, { useMemo } from 'react';

import { Add } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useCan } from '@pankod/refine-core';

export type DrawerRowOption = {
  name: string;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  onClickAdd?: () => void;
};

type Props = DrawerRowOption;

export default function DrawerRow({
  name,
  text,
  icon,
  onClick,
  onClickAdd,
}: Props) {
  const { data: permissionData } = useCan({
    resource: name,
    action: 'create',
  });

  const renderCreateButton = useMemo(() => {
    if (!onClickAdd) {
      return null;
    }

    if (!permissionData || !permissionData.can) {
      return (
        <IconButton disabled edge="end" onClick={onClickAdd} aria-label="add">
          <Add />
        </IconButton>
      );
    }

    return (
      <IconButton edge="end" onClick={onClickAdd} aria-label="add">
        <Add />
      </IconButton>
    );
  }, [permissionData, onClickAdd]);

  return (
    <ListItem secondaryAction={renderCreateButton}>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
