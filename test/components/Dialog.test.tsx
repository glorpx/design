import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Dialog } from '../../src/components/composite/Dialog';

describe('Dialog', () => {
  it('renders content when open is true', () => {
    render(
      <Dialog
        open={true}
        title="Delete Item"
        description="Are you sure you want to delete this?"
        footer={<button>Confirm</button>}
      >
        <div>Item Details</div>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument();
    expect(screen.getByText('Item Details')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('renders nothing when open is false', () => {
    render(
      <Dialog
        open={false}
        title="Title"
      >
        <div>Content</div>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<Dialog open={true} title="Title" onClose={handleClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open={true} title="Title" onClose={handleClose} />
    );

    // Backdrop is the outermost div
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.mouseDown(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when dialog card is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Dialog open={true} title="Title" onClose={handleClose}>
        <button>Content Button</button>
      </Dialog>
    );

    const dialogCard = screen.getByRole('dialog');
    fireEvent.mouseDown(dialogCard);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('restores focus to previous active element on close', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { rerender } = render(
      <Dialog open={true} title="Title">
        <button>Focusable inside Dialog</button>
      </Dialog>
    );
    // When open, focus moves inside dialog
    expect(document.activeElement).not.toBe(trigger);

    rerender(
      <Dialog open={false} title="Title">
        <button>Focusable inside Dialog</button>
      </Dialog>
    );
    // When closed, focus is restored back to trigger
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });

  it('traps focus correctly using Tab and Shift+Tab key inputs', () => {
    const handleClose = vi.fn();
    render(
      <Dialog open={true} title="Title" onClose={handleClose}>
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Dialog>
    );

    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');

    // First element should receive focus initially
    expect(document.activeElement).toBe(first);

    // Tab on last element wraps around to first
    second.focus();
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // Shift+Tab on first element wraps around to last
    first.focus();
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(second);
  });
});
