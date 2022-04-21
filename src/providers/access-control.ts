import { AccessControlProvider } from '@pankod/refine-core';

import { UserRole } from '@/models/roles';

export const getAccessControlProvider = (
  role: UserRole | null
): AccessControlProvider => ({
  can: async ({ resource, action }) => {
    if (
      resource === 'categories' &&
      ['edit', 'create', 'delete'].includes(action) &&
      role !== UserRole.ADMIN
    ) {
      return Promise.resolve({
        can: false,
        reason: 'Unauthorized',
      });
    }

    return Promise.resolve({ can: true });
  },
});
