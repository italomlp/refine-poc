import ListBasicPage from '@/components/templates/list-basic-page';
import { resourceName, title } from '@/pages/roles/constants';

export default function RolesList() {
  return (
    <ListBasicPage
      title={title}
      resourceName={resourceName}
      createEnabled
      attributes={[
        {
          title: 'ID',
          accessor: 'id',
          description: 'The unique identifier for the role',
        },
        {
          title: 'Name',
          accessor: 'name',
          description: 'The name of the role',
        },
      ]}
    />
  );
}
