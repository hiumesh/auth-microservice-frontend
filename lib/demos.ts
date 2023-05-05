export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: 'User Configration',
    items: [
      {
        name: 'User',
        slug: 'dashboard/user-configration/user',
        description: 'Create UI that is shared across routes',
      },
      {
        name: 'Role',
        slug: 'dashboard/user-configration/role',
        description: 'Organize routes without affecting URL paths',
      },
    ],
  },
  {
    name: 'Global Configration',
    items: [
      {
        name: 'Microservice',
        slug: 'dashboard/global-configration/microservice',
        description:
          'Create meaningful Loading UI for specific parts of an app',
      },
      {
        name: 'Permissions',
        slug: 'dashboard/global-configration/permissions',
        description: 'Create Error UI for specific parts of an app',
      },
    ],
  },
];