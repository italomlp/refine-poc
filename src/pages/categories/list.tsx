import { useCallback, useMemo } from 'react';

import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Link,
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
import {
  CanAccess,
  CrudSorting,
  useDelete,
  useNavigation,
  useTable,
} from '@pankod/refine-core';

import { ICategory } from '@/models/category';
import { resourceName } from '@/pages/categories/constants';

export default function CategoryList() {
  const { show, create, edit } = useNavigation();
  const { mutate } = useDelete();

  const columns: Array<GridColDef> = useMemo(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        flex: 0.5,
        description: 'Category ID',
      },
      {
        headerName: 'Title',
        field: 'title',
        flex: 3,
        renderCell: ({ value, row }) => (
          <Link
            component="button"
            variant="body2"
            onClick={() => show(resourceName, row.id)}
          >
            {value}
          </Link>
        ),
      },
      {
        headerName: 'Actions',
        field: 'actions',
        flex: 0.8,
        type: 'actions',
        renderCell: ({ row }) => (
          <Box>
            <Stack flexDirection="row">
              <CanAccess
                resource={resourceName}
                action="edit"
                fallback={
                  <IconButton
                    disabled
                    onClick={() => edit(resourceName, row.id)}
                  >
                    <Edit />
                  </IconButton>
                }
              >
                <IconButton onClick={() => edit(resourceName, row.id)}>
                  <Edit />
                </IconButton>
              </CanAccess>
              <CanAccess
                resource={resourceName}
                action="delete"
                fallback={
                  <IconButton
                    disabled
                    onClick={() =>
                      mutate({ id: row.id, resource: resourceName })
                    }
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <IconButton
                  onClick={() => mutate({ id: row.id, resource: resourceName })}
                >
                  <Delete />
                </IconButton>
              </CanAccess>
            </Stack>
          </Box>
        ),
      },
    ],
    [edit, mutate, show]
  );

  const {
    pageSize,
    setPageSize,
    current,
    setCurrent,
    tableQueryResult,
    sorter,
    setSorter,
  } = useTable<ICategory>({
    resource: resourceName,
    initialCurrent: 1,
    initialPageSize: 20,
    initialSorter: [
      {
        field: 'id',
        order: 'asc',
      },
    ],
  });

  const sortModel = useMemo(
    () => sorter.map(({ field, order }) => ({ field, sort: order })),
    [sorter]
  );

  const renderToolbar = useCallback(
    () => (
      <Box>
        <Stack p={2} flexDirection="row" justifyContent="space-between">
          <Typography variant="h4">Categories</Typography>
          <GridToolbarContainer>
            <CanAccess
              resource={resourceName}
              action="create"
              fallback={
                <Button
                  startIcon={<Add />}
                  disabled
                  onClick={() => create(resourceName)}
                >
                  Create
                </Button>
              }
            >
              <Button startIcon={<Add />} onClick={() => create(resourceName)}>
                Create
              </Button>
            </CanAccess>
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </GridToolbarContainer>
        </Stack>
      </Box>
    ),
    [create, resourceName]
  );

  return (
    <Paper sx={{ height: '100%' }}>
      <DataGrid
        rows={tableQueryResult.data?.data ?? []}
        columns={columns}
        rowCount={tableQueryResult.data?.total ?? 0}
        loading={tableQueryResult.isLoading}
        paginationMode="server"
        autoHeight
        pageSize={pageSize}
        page={current - 1}
        onPageChange={page => setCurrent(page + 1)}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={newSortModel =>
          setSorter(
            newSortModel.map(({ field, sort }) => ({
              field,
              order: sort,
            })) as CrudSorting
          )
        }
        components={{
          Toolbar: renderToolbar,
        }}
      />
    </Paper>
  );
}
