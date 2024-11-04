export const Category = {
  General: 'General',
  Entertainment: 'Entertainment',
  Bills: 'Bills',
  Groceries: 'Groceries',
  DiningOut: 'Dining Out',
  Transportation: 'Transportation',
  PersonalCare: 'Personal Care',
  Education: 'Education',
  Lifestyle: 'Lifestyle',
  Shopping: 'Shopping',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export function isCategory(value: unknown): value is Category {
  return Object.values(Category).includes(value as Category);
}
