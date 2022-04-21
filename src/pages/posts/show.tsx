import { Delete, Edit } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { useDelete, useNavigation, useOne, useShow } from '@pankod/refine-core';

import { ICategory } from '@/models/category';
import { IPost } from '@/models/post';
import { resourceName as categoriesResourceName } from '@/pages/categories';
import { resourceName } from '@/pages/posts/constants';

export default function PostShow() {
  const { queryResult } = useShow<IPost>();
  const { data } = queryResult;
  const record = data?.data;
  const { edit, list } = useNavigation();
  const { mutateAsync } = useDelete();
  const { show } = useNavigation();

  const { data: categoryData } = useOne<ICategory>({
    resource: categoriesResourceName,
    id: record?.category.id || '',
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container flexDirection="row">
          <Grid item xs={10}>
            <Typography variant="h5" component="div">
              {record?.title}
            </Typography>
            <Typography sx={{}} color="text.secondary">
              Status: {record?.status}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" gutterBottom>
              Category:{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() =>
                  show(categoriesResourceName, categoryData!.data!.id)
                }
              >
                {categoryData?.data?.title}
              </Link>
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
                      list(resourceName);
                    }
                  );
                }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Typography variant="body2">{record?.content}</Typography>
      </CardContent>
    </Card>
  );
}
