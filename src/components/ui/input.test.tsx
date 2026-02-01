import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  it('renders with default type', () => {
    render(<Input aria-label="Test input" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toBeInTheDocument();
  });

  it('renders with text type', () => {
    render(<Input type="text" aria-label="Text input" />);
    const input = screen.getByLabelText('Text input');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with password type', () => {
    render(<Input type="password" aria-label="Password input" />);
    const input = screen.getByLabelText('Password input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with email type', () => {
    render(<Input type="email" aria-label="Email input" />);
    const input = screen.getByLabelText('Email input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with number type', () => {
    render(<Input type="number" aria-label="Number input" />);
    const input = screen.getByLabelText('Number input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input aria-label="Test input" onChange={handleChange} />);
    const input = screen.getByLabelText('Test input');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays placeholder text', () => {
    render(<Input placeholder="Enter text" aria-label="Test input" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Input disabled aria-label="Disabled input" />);
    const input = screen.getByLabelText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('renders with custom className', () => {
    render(<Input className="custom-class" aria-label="Custom input" />);
    const input = screen.getByLabelText('Custom input');
    expect(input).toHaveClass('custom-class');
  });

  it('has data-slot attribute', () => {
    render(<Input aria-label="Slot input" />);
    const input = screen.getByLabelText('Slot input');
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('supports controlled value', () => {
    render(<Input value="controlled" readOnly aria-label="Controlled input" />);
    const input = screen.getByLabelText('Controlled input');
    expect(input).toHaveValue('controlled');
  });
});
