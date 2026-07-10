import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge.jsx';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge variant="success">Approved</Badge>);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('applies the variant classes', () => {
    render(<Badge variant="danger">Rejected</Badge>);
    expect(screen.getByText('Rejected').className).toMatch(/text-red-300/);
  });
});
