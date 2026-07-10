/**
 * Client-side CSV export. Accepts rows and a column spec, escapes values,
 * and triggers a download. No dependencies.
 */
const escapeCell = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/**
 * @param {Array<object>} rows
 * @param {Array<{ key: string, header: string, accessor?: (row)=>any }>} columns
 * @param {string} filename
 */
export const exportToCsv = (rows, columns, filename = 'export.csv') => {
  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => escapeCell(c.accessor ? c.accessor(row) : row[c.key]))
        .join(',')
    )
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportToCsv;
