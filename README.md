# @glorpx/design

A modern, type-safe React component library built with TypeScript and Tailwind CSS. Provides a comprehensive foundation for building consistent, accessible user interfaces at scale.

## Features

- **TypeScript First**: Full type safety with strict mode enabled
- **Dual Output**: ESM and CommonJS formats for maximum compatibility across environments
- **Tailwind CSS**: Utility-first styling with built-in design tokens and theme support
- **Design Tokens**: Pre-built design token system (spacing, colors, typography, etc.) available as both TypeScript and CSS exports
- **Tested**: Comprehensive test suite with Vitest and 80%+ code coverage
- **Accessible**: WCAG AA compliance built into all component designs
- **Tree-shakeable**: Unused components are removed during bundling for minimal bundle size
- **23 Components**: Core, composite, form, and brand components ready to use

## Installation

```bash
npm install @glorpx/design tailwindcss
# or
pnpm add @glorpx/design tailwindcss
# or
yarn add @glorpx/design tailwindcss
```

## Requirements

- Node.js 18+
- React 18+
- React DOM 18+
- Tailwind CSS 3.0+

## Tailwind CSS Setup

After installing `@glorpx/design`, configure Tailwind CSS in your project:

### 1. Install Tailwind CSS (if not already installed)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@glorpx/design/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Import Tailwind CSS in your entry file

```typescript
import "tailwindcss/tailwind.css";
```

## Usage

### Basic Component Import

```typescript
import { Button, Card, Input } from "@glorpx/design";

export function App() {
  return (
    <Card>
      <Card.Header>Welcome</Card.Header>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Common Components

#### Button
```typescript
import { Button } from "@glorpx/design";

<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button disabled>Disabled</Button>
```

#### Form Components
```typescript
import { Input, Select, Checkbox, Radio, Textarea } from "@glorpx/design";

<Input type="text" placeholder="Name" />
<Select options={[{ value: "1", label: "Option 1" }]} />
<Checkbox label="Agree to terms" />
<Radio.Group>
  <Radio label="Option A" value="a" />
  <Radio label="Option B" value="b" />
</Radio.Group>
<Textarea placeholder="Your message" />
```

#### Layout Components
```typescript
import { Card, Divider, Dialog, Tabs } from "@glorpx/design";

<Card>
  <Card.Header>Card Title</Card.Header>
  <p>Card content goes here</p>
</Card>

<Divider />

<Tabs>
  <Tabs.Tab label="Tab 1">Content 1</Tabs.Tab>
  <Tabs.Tab label="Tab 2">Content 2</Tabs.Tab>
</Tabs>

<Dialog open={isOpen}>Dialog content</Dialog>
```

### Design Tokens

The library includes pre-built design tokens for consistent styling. You can access tokens programmatically or as CSS custom properties.

#### TypeScript Tokens
```typescript
import { gxCanvas, gxAccentSolid, gxSpaceUnit } from "@glorpx/design/tokens";

export function Component() {
  return (
    <div style={{ 
      backgroundColor: gxCanvas,
      color: gxAccentSolid,
      padding: gxSpaceUnit 
    }}>
      Styled with design tokens
    </div>
  );
}
```

#### CSS Tokens
```typescript
// Import token definitions
import "@glorpx/design/tokens/index.css";

// Use in CSS
export function Component() {
  return (
    <div style={{ 
      backgroundColor: 'var(--gx-canvas)',
      color: 'var(--gx-accent-solid)',
      padding: 'var(--gx-space-1)' 
    }}>
      Styled with CSS custom properties
    </div>
  );
}
```

#### Available Token Categories

- **Colors**: `--gx-canvas`, `--gx-accent-*`, `--gx-danger`, etc.
- **Spacing**: `--gx-space-0`, `--gx-space-1`, `--gx-space-2`, ... `--gx-space-24`
- **Typography**: `--gx-font-display`, `--gx-font-ui`, `--gx-font-mono`
- **Radius**: `--gx-radius-sm`, `--gx-radius-md`, `--gx-radius-lg`, `--gx-radius-pill`
- **Effects**: `--gx-border-hairline`, `--gx-disabled-opacity`, duration tokens

See the full token list in `node_modules/@glorpx/design/dist/tokens/index.d.ts`.

## TypeScript Support

All components are fully typed. TypeScript will provide autocomplete and type checking out of the box.

```typescript
import type { ButtonProps } from "@glorpx/design";

const props: ButtonProps = {
  variant: "primary",
  size: "md",
  disabled: false,
};
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support
- Sufficient color contrast (AAA where possible)
- Tested with axe-core and manual a11y review

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Set up the development environment

## License

MIT License. See [LICENSE](./LICENSE) file for details.

## Resources

- [GitHub Repository](https://github.com/glorpx/design)
- [Issues & Bug Reports](https://github.com/glorpx/design/issues)
- [Component Storybook](https://design.glorpx.my.id)

---

Built with ❤️ by [Glorpx](https://glorpx.my.id)
