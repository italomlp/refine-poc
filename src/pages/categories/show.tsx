import { Delete, Edit } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useDelete, useNavigation, useShow } from '@pankod/refine-core';

import { ICategory } from '@/models/category';
import { resourceName } from '@/pages/categories/constants';

export default function CategoryShow() {
  const { queryResult } = useShow<ICategory>();
  const { data } = queryResult;
  const record = data?.data;
  const { edit, list } = useNavigation();
  const { mutateAsync } = useDelete();

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container flexDirection="row">
          <Grid item xs={10}>
            <Typography variant="h5" component="div">
              #{record?.id} - {record?.title}
            </Typography>
          </Grid>
          <Grid item xs={2} container justifyContent="flex-end">
            <Grid item>
              <Button
                startIcon={<Edit />}
                onClick={() => edit(resourceName, record!.id)}
              >
                Edit
              </Button>
              <Button
                startIcon={<Delete />}
                onClick={() => {
                  mutateAsync({ id: record!.id, resource: resourceName }).then(
                    () => {
                      list('posts');
                    }
                  );
                }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
