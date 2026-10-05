let nextId = 1;

export const database = {
  async insert(table: string, value: Record<string, unknown>) {
    return { id: nextId++, table, ...value };
  },
};
