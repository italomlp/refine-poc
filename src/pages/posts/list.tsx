import React, { useCallback, useMemo, useState } from 'react';

import { Add, Delete, Edit, Send } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  NativeSelect,
  NativeSelectProps,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  getGridNumericOperators,
  getGridStringOperators,
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridLinkOperator,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { GridFilterInputValueProps } from '@mui/x-data-grid/components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterOperator } from '@mui/x-data-grid/models/gridFilterOperator';
import {
  CrudFilter,
  CrudOperators,
  CrudSorting,
  LogicalFilter,
  useDelete,
  useDeleteMany,
  useNavigation,
  useOne,
  useSelect,
  useTable,
} from '@pankod/refine-core';

import { ICategory } from '@/models/category';
import { IPost } from '@/models/post';
import { resourceName as categoriesResourceName } from '@/pages/categories';
import { resourceName } from '@/pages/posts/constants';

const STRING_FILTER_MAP = {
  eq: 'equals',
  contains: 'contains',
};

const STRING_FILTER_MAP_INVERSE = {
  equals: 'eq',
  is: 'eq',
  contains: 'contains',
};

const stringFilters = getGridStringOperators().filter(
  operator =>
    !!STRING_FILTER_MAP_INVERSE[
      operator?.value as keyof typeof STRING_FILTER_MAP_INVERSE
    ]
);

const NUMBER_FILTER_MAP = {
  eq: '=',
  ne: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
};

const NUMBER_FILTER_MAP_INVERSE = {
  '=': 'eq',
  '!=': 'ne',
  '>': 'gt',
  '<': 'lt',
  '>=': 'gte',
  '<=': 'lte',
};

const numericFilters = getGridNumericOperators().filter(
  operator =>
    !!NUMBER_FILTER_MAP_INVERSE[
      operator?.value as keyof typeof NUMBER_FILTER_MAP_INVERSE
    ]
);

const CATEGORY_FILTER_MAP = {
  eq: 'equivalent',
};

const CATEGORY_FILTER_MAP_INVERSE = {
  equivalent: 'eq',
};

const FILTERS_MAP = {
  id: NUMBER_FILTER_MAP,
  'category.id': CATEGORY_FILTER_MAP,
  title: STRING_FILTER_MAP,
  status: STRING_FILTER_MAP,
};

const FILTERS_MAP_INVERSE = {
  id: NUMBER_FILTER_MAP_INVERSE,
  category: CATEGORY_FILTER_MAP_INVERSE,
  title: STRING_FILTER_MAP_INVERSE,
  status: STRING_FILTER_MAP_INVERSE,
};

function CategoryValue({
  options,
  ...props
}: { options: any[] } & GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;

  const ratingRef: React.Ref<any> = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current?.querySelector(`input#category-select`)?.focus();
    },
  }));

  const handleFilterChange: NativeSelectProps['onChange'] = event => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="category-select" shrink>
        Category
      </InputLabel>
      <NativeSelect
        // defaultValue={30}
        inputRef={ratingRef}
        inputProps={{
          id: 'category-select',
        }}
        value={item.value}
        onChange={handleFilterChange}
      >
        <option value="" disabled>
          Please select
        </option>
        {options?.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}

function CategoryTitle({ categoryId }: { categoryId: string }) {
  const { data, isLoading } = useOne<ICategory>({
    resource: categoriesResourceName,
    id: categoryId,
  });

  if (isLoading) {
    return <p>loading..</p>;
  }

  return <span>{data?.data.title ?? 'no category'}</span>;
}

export default function PostList() {
  const { show, create, edit, clone } = useNavigation();
  const { mutate } = useDelete();
  const { mutate: deleteMany } = useDeleteMany();
  const { options } = useSelect({
    resource: categoriesResourceName,
  });

  const renderCategoryInputComponent = useCallback(
    (props: GridFilterInputValueProps) => (
      <CategoryValue options={options} {...props} />
    ),
    [options]
  );

  const categoryFilter = useMemo<GridFilterOperator[]>(
    () => [
      {
        value: 'equivalent',
        label: 'equivalent',
        getApplyFilterFn: (filterItem: GridFilterItem) => {
          if (
            !filterItem.columnField ||
            !filterItem.value ||
            !filterItem.operatorValue
          ) {
            return null;
          }

          return (params: GridCellParams): boolean =>
            params.value.id === filterItem.value;
        },
        InputComponentProps: {
          inputProps: {
            placeholder: 'Select category',
          },
        },
        InputComponent: renderCategoryInputComponent,
      },
    ],
    [renderCategoryInputComponent]
  );

  const columns: Array<GridColDef> = useMemo(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        flex: 0.5,
        description: 'Post ID',
        filterOperators: numericFilters,
      },
      {
        headerName: 'Title',
        field: 'title',
        flex: 3,
        filterOperators: stringFilters,
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
        headerName: 'Status',
        field: 'status',
        flex: 1,
        filterOperators: stringFilters,
      },
      {
        headerName: 'CreatedAt',
        field: 'createdAt',
        flex: 1,
        type: 'date',
        filterable: false,
        valueGetter: ({ value }) => value && new Date(value),
      },
      {
        headerName: 'Category',
        field: 'category',
        flex: 2,
        filterOperators: categoryFilter,
        renderCell: ({ value }) => <CategoryTitle categoryId={value.id} />,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        flex: 0.8,
        type: 'actions',
        renderCell: ({ row }) => (
          <Box>
            <Grid container flexDirection="row">
              <Grid item xs={6}>
                <IconButton onClick={() => edit(resourceName, row.id)}>
                  <Edit />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                <IconButton
                  onClick={() => mutate({ id: row.id, resource: resourceName })}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ),
      },
    ],
    [edit, mutate, show, categoryFilter]
  );
  const [tableAction, setTableAction] = useState('');
  const [selectedRowsIds, setSelectedRowsIds] = useState<(string | number)[]>(
    []
  );

  const {
    pageSize,
    setPageSize,
    current,
    setCurrent,
    tableQueryResult,
    sorter,
    setSorter,
    filters,
    setFilters,
  } = useTable<IPost>({
    resource: resourceName,
    initialCurrent: 1,
    initialPageSize: 20,
    initialSorter: [
      {
        field: 'id',
        order: 'asc',
      },
    ],
    syncWithLocation: true,
  });

  const sortModel = useMemo(
    () => sorter.map(({ field, order }) => ({ field, sort: order })),
    [sorter]
  );

  const doAction = useCallback(() => {
    const actions = {
      deleteRows: () => {
        deleteMany({
          resource: resourceName,
          ids: selectedRowsIds,
        });
      },
    };
    const action = actions[tableAction as keyof typeof actions];

    if (!action) {
      return;
    }

    action();
  }, [clone, deleteMany, selectedRowsIds, tableAction]);

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
            <Typography variant="h4">Posts</Typography>
          </Grid>
          <Grid item>
            <GridToolbarContainer>
              <Button startIcon={<Add />} onClick={() => create(resourceName)}>
                Create
              </Button>
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>
          </Grid>
        </Grid>
        {selectedRowsIds.length > 1 && (
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
                    <option value="deleteRows">Delete rows</option>
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
    [create, doAction, selectedRowsIds.length, tableAction]
  );

  const filterModel = useMemo<GridFilterModel>(() => {
    const firstFilter = filters[0] as LogicalFilter;
    const filterMap =
      FILTERS_MAP[firstFilter?.field as keyof typeof FILTERS_MAP] ||
      STRING_FILTER_MAP;

    return {
      items: firstFilter
        ? [
            {
              value: firstFilter?.value,
              operatorValue:
                filterMap[firstFilter?.operator as keyof typeof filterMap],
              columnField:
                firstFilter?.field === 'category.id'
                  ? 'category'
                  : firstFilter?.field,
            },
          ]
        : [],
      linkOperator: GridLinkOperator.And,
    };
  }, [filters]);

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
        pageSize={pageSize}
        page={current - 1}
        onPageChange={page => setCurrent(page + 1)}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
        sortingMode="server"
        sortModel={sortModel}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={model => {
          const filter = model.items[0];
          const filterMap =
            FILTERS_MAP_INVERSE[
              filter?.columnField as keyof typeof FILTERS_MAP_INVERSE
            ] || STRING_FILTER_MAP_INVERSE;
          const fieldName =
            filter?.columnField === 'category'
              ? 'category.id'
              : filter.columnField;
          const newFilter: CrudFilter = {
            value: filter.value || '',
            field: fieldName,
            operator: filterMap[
              filter.operatorValue as keyof typeof filterMap
            ] as Exclude<CrudOperators, 'or'>,
          };
          setFilters([newFilter]);
        }}
        onSortModelChange={newSortModel =>
          setSorter(
            newSortModel.map(({ field, sort }) => ({
              field,
              order: sort,
            })) as CrudSorting
          )
        }
        components={{
          Toolbar: renderToolbarComponent,
        }}
      />
    </Paper>
  );
}
