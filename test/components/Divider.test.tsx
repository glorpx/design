import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from '../../src/components/core/Divider';

describe('Divider', () => {
  describe('without label (hr mode)', () => {
    it('renders hr element with horizontal orientation by default', () => {
      render(<Divider />);
      const hr = screen.getByRole('separator');
      expect(hr).toBeInTheDocument();
      expect(hr).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders hr element with vertical orientation', () => {
      render(<Divider orientation="vertical" />);
      const hr = screen.getByRole('separator');
      expect(hr).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('applies correct styles for horizontal orientation', () => {
      render(<Divider orientation="horizontal" />);
      const hr = screen.getByRole('separator');
      expect(hr).toHaveStyle({
        border: '0',
        margin: '0',
        alignSelf: 'stretch',
        blockSize: '1px',
        background: 'var(--gx-hairline)',
      });
    });

    it('applies correct styles for vertical orientation', () => {
      render(<Divider orientation="vertical" />);
      const hr = screen.getByRole('separator');
      expect(hr).toHaveStyle({
        border: '0',
        margin: '0',
        alignSelf: 'stretch',
        inlineSize: '1px',
        blockSize: 'auto',
        background: 'var(--gx-hairline)',
      });
    });

    it('supports custom styles override', () => {
      render(<Divider style={{ background: 'red', margin: '10px' }} />);
      const hr = screen.getByRole('separator');
      expect(hr).toHaveStyle({
        background: 'red',
        margin: '10px',
      });
    });

    it('forwards HTML attributes to hr element', () => {
      render(<Divider className="custom-class" data-testid="custom-divider" />);
      const hr = screen.getByTestId('custom-divider');
      expect(hr).toHaveClass('custom-class');
    });
  });

  describe('with label (section marker mode)', () => {
    it('renders section divider with label text', () => {
      render(<Divider label="Section Title" />);
      const label = screen.getByText('Section Title');
      expect(label).toBeInTheDocument();
    });

    it('renders flex container with label', () => {
      render(<Divider label="Components" />);
      const container = screen.getByText('Components').parentElement;
      expect(container).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--gx-space-3)',
      });
    });

    it('renders left and right hairline spans around label', () => {
      const { container } = render(<Divider label="Divider Label" />);
      const spans = container.querySelectorAll('span');
      // Should have 3 spans: left rule, label text, right rule
      expect(spans).toHaveLength(3);

      // Check left and right rule spans have consistent styling
      const leftRule = spans[0];
      const rightRule = spans[2];

      expect(leftRule).toHaveStyle({
        flex: '1',
        blockSize: '1px',
        background: 'var(--gx-hairline)',
      });

      expect(rightRule).toHaveStyle({
        flex: '1',
        blockSize: '1px',
        background: 'var(--gx-hairline)',
      });
    });

    it('renders label span with typography styles', () => {
      const { container } = render(<Divider label="Typography Test" />);
      const labelSpan = screen.getByText('Typography Test');

      expect(labelSpan).toHaveStyle({
        font: 'var(--gx-weight-medium) 12px/1.3 var(--gx-font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--gx-text-secondary)',
      });
    });

    it('applies custom styles to labeled divider container', () => {
      render(<Divider label="Styled" style={{ gap: '20px', margin: '10px' }} />);
      const container = screen.getByText('Styled').parentElement;
      expect(container).toHaveStyle({
        gap: '20px',
        margin: '10px',
      });
    });

    it('forwards HTML attributes to labeled divider container', () => {
      render(
        <Divider
          label="Labeled"
          className="custom-divider-class"
          data-testid="custom-labeled"
        />
      );
      const container = screen.getByTestId('custom-labeled');
      expect(container).toHaveClass('custom-divider-class');
    });

    it('preserves label text case in rendering (only uppercase in CSS)', () => {
      render(<Divider label="MixedCase" />);
      const label = screen.getByText('MixedCase');
      expect(label).toHaveTextContent('MixedCase');
    });
  });

  describe('orientation prop behavior', () => {
    it('ignores orientation prop when label is provided', () => {
      render(<Divider label="Test" orientation="vertical" />);
      // Should render as flex container, not as hr
      const hr = screen.queryByRole('separator');
      expect(hr).not.toBeInTheDocument();
    });
  });
});
