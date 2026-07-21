export type Transaction = { insert(table: string, value: unknown): Promise<void> };

export const database = {
  async transaction<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
    return work({ insert: async () => undefined });
  },
};
