import React, { useCallback, useMemo, useState } from 'react';

import { Add, Delete, Details, Edit, Send } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  NativeSelect,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useDelete, useNavigation, useTable } from '@pankod/refine-core';

import { IPost } from '@/models/post';

type Props = {
  title: string;
  resourceName: string;
  attributes: {
    title: string;
    accessor: string;
    size?: number;
    description?: string;
    customRender?: (cellValue: any, rowValue: any) => React.ReactNode;
    valueGetter?: (cellValue: any, rowValue: any) => string;
  }[];
  viewEnabled?: boolean;
  deleteEnabled?: boolean;
  editEnabled?: boolean;
  createEnabled?: boolean;
  customRowActions?: {
    icon: React.ReactNode;
    onClick: (rowValue: any) => void;
  }[];
  tableActions?: {
    label: string;
    key: string;
    onClick: (selectedRowsIds: (string | number)[]) => void;
  }[];
};

export default function ListBasicPage({
  title,
  resourceName,
  attributes,
  viewEnabled,
  deleteEnabled,
  editEnabled,
  customRowActions,
  tableActions,
  createEnabled,
}: Props) {
  const { show, create, edit } = useNavigation();
  const { mutate } = useDelete();

  const columns: Array<GridColDef> = useMemo(() => {
    const attributeColumns = attributes.map<GridColDef>(attribute => ({
      headerName: attribute.title,
      field: attribute.accessor,
      flex: attribute.size ?? 1,
      description: attribute.description,
      renderCell: attribute.customRender
        ? ({ value, row }) => attribute.customRender!(value, row)
        : undefined,
      valueGetter: attribute.valueGetter
        ? ({ value, row }) => attribute.valueGetter!(value, row)
        : undefined,
    }));

    if (
      viewEnabled ||
      deleteEnabled ||
      editEnabled ||
      customRowActions?.length
    ) {
      attributeColumns.push({
        headerName: 'Actions',
        field: 'actions',
        flex: 0.8,
        type: 'actions',
        renderCell: ({ row }) => (
          <Box>
            <Grid container flexDirection="row">
              {viewEnabled && (
                <Grid item xs={4}>
                  <IconButton onClick={() => show(resourceName, row.id)}>
                    <Details />
                  </IconButton>
                </Grid>
              )}
              {editEnabled && (
                <Grid item xs={4}>
                  <IconButton onClick={() => edit(resourceName, row.id)}>
                    <Edit />
                  </IconButton>
                </Grid>
              )}
              {deleteEnabled && (
                <Grid item xs={4}>
                  <IconButton
                    onClick={() =>
                      mutate({ id: row.id, resource: resourceName })
                    }
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              )}
              {!!customRowActions?.length &&
                customRowActions.map(action => (
                  <Grid item xs={4}>
                    <IconButton onClick={() => action.onClick(row)}>
                      {action.icon}
                    </IconButton>
                  </Grid>
                ))}
            </Grid>
          </Box>
        ),
      });
    }

    return attributeColumns;
  }, [
    attributes,
    deleteEnabled,
    edit,
    editEnabled,
    mutate,
    resourceName,
    show,
    viewEnabled,
  ]);
  const [tableAction, setTableAction] = useState('');
  const [selectedRowsIds, setSelectedRowsIds] = useState<(string | number)[]>(
    []
  );

  const { tableQueryResult } = useTable<IPost>({
    resource: resourceName,
  });

  const doAction = useCallback(() => {
    const selectedAction = tableActions?.find(
      action => action.key === tableAction
    );

    if (!selectedAction) {
      return;
    }

    selectedAction.onClick(selectedRowsIds);
  }, [selectedRowsIds, tableAction, tableActions]);

  const renderToolbarComponent = useCallback(
    () => (
      <Box>
        <Grid
          container
          p={2}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
          <Grid item>
            <GridToolbarContainer>
              {createEnabled && (
                <Button
                  startIcon={<Add />}
                  onClick={() => create(resourceName)}
                >
                  Create
                </Button>
              )}
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>
          </Grid>
        </Grid>
        {selectedRowsIds.length > 1 && !!tableActions?.length && (
          <Grid container p={2}>
            <Grid item xs={12} md={6}>
              <Stack flexDirection="row" alignItems="flex-end">
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="action-select" shrink>
                    Action
                  </InputLabel>
                  <NativeSelect
                    inputProps={{
                      id: 'action-select',
                    }}
                    value={tableAction}
                    onChange={e => setTableAction(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an action
                    </option>
                    {tableActions.map(action => (
                      <option key={action.key} value={action.key}>
                        {action.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <Button
                  disabled={!tableAction}
                  variant="contained"
                  endIcon={<Send />}
                  onClick={doAction}
                >
                  Go
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    ),
    [
      create,
      createEnabled,
      doAction,
      resourceName,
      selectedRowsIds,
      tableAction,
      tableActions,
      title,
    ]
  );

  return (
    <Paper sx={{ height: '100%' }}>
      <DataGrid
        rows={tableQueryResult.data?.data ?? []}
        columns={columns}
        rowCount={tableQueryResult.data?.total ?? 0}
        loading={tableQueryResult.isLoading}
        paginationMode="server"
        onSelectionModelChange={model => {
          setSelectedRowsIds(model);
        }}
        autoHeight
        // pageSize={pageSize}
        // page={current - 1}
        // onPageChange={page => setCurrent(page + 1)}
        // onPageSizeChange={setPageSize}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
        components={{
          Toolbar: renderToolbarComponent,
        }}
      />
    </Paper>
  );
}
