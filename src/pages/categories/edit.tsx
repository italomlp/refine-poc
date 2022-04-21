import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from '@mui/material';
import { useForm } from '@pankod/refine-react-hook-form';

export default function CategoryEdit() {
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
