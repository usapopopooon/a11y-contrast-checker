import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders with children', () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Label>Slot Label</Label>);
    const label = screen.getByText('Slot Label');
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>);
    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-class');
  });

  it('renders with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">For Input</Label>);
    const label = screen.getByText('For Input');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('associates with input element', () => {
    render(
      <div>
        <Label htmlFor="my-input">My Label</Label>
        <input id="my-input" type="text" />
      </div>
    );
    const input = screen.getByLabelText('My Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'my-input');
  });
});
