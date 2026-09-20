export function normalizePage(
  page: number,
  rowsPerPage: number,
  totalRows: number,
): number {
  if (rowsPerPage <= 0 || totalRows <= 0) return 0;

  const lastPage = Math.max(0, Math.ceil(totalRows / rowsPerPage) - 1);
  return Math.min(Math.max(0, page), lastPage);
}
