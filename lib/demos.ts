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
        slug: 'user',
        description: 'Create UI that is shared across routes',
      },
      {
        name: 'Role',
        slug: 'role',
        description: 'Organize routes without affecting URL paths',
      },
    ],
  },
  {
    name: 'Global Configration',
    items: [
      {
        name: 'Microservice',
        slug: 'microservice',
        description:
          'Create meaningful Loading UI for specific parts of an app',
      },
      {
        name: 'Permissions',
        slug: 'permissions',
        description: 'Create Error UI for specific parts of an app',
      },
    ],
  },
];