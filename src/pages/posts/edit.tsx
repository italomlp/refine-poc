import { useEffect } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from '@mui/material';
import { useSelect } from '@pankod/refine-core';
import { useForm } from '@pankod/refine-react-hook-form';

import { resourceName as categoriesResourceName } from '@/pages/categories';

export default function PostEdit() {
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const { options } = useSelect({
    resource: categoriesResourceName,
    defaultValue: queryResult?.data?.data.category.id,
  });

  useEffect(() => {
    resetField('category.id');
  }, [options]);

  if (queryResult?.isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(onFinish)}
      sx={{ minWidth: 275 }}
    >
      <CardContent>
        <Grid container flexDirection="column" spacing={3}>
          <Grid item>
            <TextField
              {...register('title', { required: true })}
              fullWidth
              variant="standard"
              type="text"
              label="Title"
              id="title"
              error={!!errors.title}
              helperText={errors.title && 'This field is required'}
            />
          </Grid>
          <Grid
            item
            container
            spacing={2}
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="status-select" shrink>
                  Status
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    ...register('status'),
                    id: 'status-select',
                  }}
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="rejected">rejected</option>
                </NativeSelect>
              </FormControl>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  <span className="font-medium">Oops!</span> This field is
                  required
                </p>
              )}
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="category-select" shrink>
                  Category
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    ...register('category.id'),
                    id: 'category-select',
                  }}
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
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  <span className="font-medium">Oops!</span> This field is
                  required
                </p>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              {...register('content', { required: true })}
              fullWidth
              variant="standard"
              multiline
              rows={4}
              label="Content"
              id="content"
              error={!!errors.content}
              helperText={errors.content && 'This field is required'}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button type="submit">
          {formLoading ? <CircularProgress /> : 'Save'}
        </Button>
      </CardActions>
    </Card>
  );
}
