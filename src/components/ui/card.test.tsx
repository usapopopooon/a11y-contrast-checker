import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card';

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Card>Content</Card>);
    const card = screen.getByText('Content');
    expect(card).toHaveAttribute('data-slot', 'card');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText('Content');
    expect(card).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders with children', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardHeader>Header</CardHeader>);
    const header = screen.getByText('Header');
    expect(header).toHaveAttribute('data-slot', 'card-header');
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-class">Header</CardHeader>);
    const header = screen.getByText('Header');
    expect(header).toHaveClass('custom-class');
  });
});

describe('CardTitle', () => {
  it('renders with children', () => {
    render(<CardTitle>Title Content</CardTitle>);
    expect(screen.getByText('Title Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveAttribute('data-slot', 'card-title');
  });
});

describe('CardDescription', () => {
  it('renders with children', () => {
    render(<CardDescription>Description Content</CardDescription>);
    expect(screen.getByText('Description Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardDescription>Description</CardDescription>);
    const desc = screen.getByText('Description');
    expect(desc).toHaveAttribute('data-slot', 'card-description');
  });
});

describe('CardAction', () => {
  it('renders with children', () => {
    render(<CardAction>Action Content</CardAction>);
    expect(screen.getByText('Action Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardAction>Action</CardAction>);
    const action = screen.getByText('Action');
    expect(action).toHaveAttribute('data-slot', 'card-action');
  });
});

describe('CardContent', () => {
  it('renders with children', () => {
    render(<CardContent>Main Content</CardContent>);
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveAttribute('data-slot', 'card-content');
  });
});

describe('CardFooter', () => {
  it('renders with children', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText('Footer');
    expect(footer).toHaveAttribute('data-slot', 'card-footer');
  });
});

describe('Card composition', () => {
  it('renders full card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
