import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from './badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-variant', 'default');
  });

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');
    expect(badge).toHaveAttribute('data-variant', 'secondary');
  });

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText('Destructive');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
  });

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).toHaveAttribute('data-variant', 'outline');
  });

  it('renders with ghost variant', () => {
    render(<Badge variant="ghost">Ghost</Badge>);
    const badge = screen.getByText('Ghost');
    expect(badge).toHaveAttribute('data-variant', 'ghost');
  });

  it('renders with link variant', () => {
    render(<Badge variant="link">Link</Badge>);
    const badge = screen.getByText('Link');
    expect(badge).toHaveAttribute('data-variant', 'link');
  });

  it('renders with custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders as child component with asChild', () => {
    render(
      <Badge asChild>
        <a href="#">Link Badge</a>
      </Badge>
    );
    const link = screen.getByRole('link', { name: 'Link Badge' });
    expect(link).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Badge>Slot Badge</Badge>);
    const badge = screen.getByText('Slot Badge');
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });
});

describe('badgeVariants', () => {
  it('returns default variant classes', () => {
    const classes = badgeVariants({ variant: 'default' });
    expect(classes).toContain('bg-primary');
  });

  it('returns secondary variant classes', () => {
    const classes = badgeVariants({ variant: 'secondary' });
    expect(classes).toContain('bg-secondary');
  });
});
