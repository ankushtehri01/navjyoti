import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToCsv } from './csv.js';

describe('exportToCsv', () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('builds a CSV blob and triggers a download', () => {
    const clickSpy = vi.fn();
    const anchor = { click: clickSpy, href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    const rows = [{ name: 'Asha, Rao', amount: 500000 }];
    exportToCsv(rows, [{ header: 'Name', key: 'name' }, { header: 'Amount', key: 'amount' }], 'out.csv');

    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    expect(anchor.download).toBe('out.csv');
    expect(clickSpy).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
