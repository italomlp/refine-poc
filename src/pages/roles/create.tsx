import React from 'react';

import FormBasicPage, {
  InputTypes,
} from '@/components/templates/form-basic-page';

export default function RolesCreate() {
  return (
    <FormBasicPage
      inputs={[
        [
          {
            label: 'Role Name',
            name: 'role.name',
            type: InputTypes.TEXT,
          },
          // {
          //   label: 'Role Description',
          //   name: 'role.description',
          //   type: InputTypes.TEXT,
          // },
        ],
        // [
        //   {
        //     label: 'Role ID',
        //     name: 'role.id',
        //     type: InputTypes.SELECT,
        //     defaultValue: '',
        //     options: [
        //       {
        //         key: 'empty',
        //         label: 'Please select',
        //         value: '',
        //       },
        //       {
        //         key: 'admin',
        //         label: 'Admin',
        //         value: UserRole.ADMIN,
        //       },
        //       {
        //         key: 'editor',
        //         label: 'Editor',
        //         value: UserRole.EDITOR,
        //       },
        //     ],
        //   },
        // ],
      ]}
    />
  );
}
