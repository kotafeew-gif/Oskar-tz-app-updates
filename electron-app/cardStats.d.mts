export type CardStatRow = [string, string, string];

export function normalizeSheetCell(value: unknown): string;
export function getRowCell(row: unknown, index: number): string;
export function buildCardStatRow(input: {
  managerName: string;
  imageName: string;
  date?: string;
}): CardStatRow;
export function aggregateCardStats(rows: unknown[]): {
  byImage: Record<string, number>;
  byManager: Record<string, Record<string, number>>;
};
