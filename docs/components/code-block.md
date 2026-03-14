# CodeBlock

A styled `<pre>` block for displaying code snippets. Includes an optional language label and a copy-to-clipboard button that appears on hover.

## Import

```tsx
import { CodeBlock } from "@charlietogolden/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | -- | The code string to display. Also used as the clipboard content. |
| `language` | `string` | -- | Language label displayed in the top-right corner (e.g. `"tsx"`, `"bash"`). |
| `showCopy` | `boolean` | `true` | Whether to show the copy-to-clipboard button on hover. |
| `className` | `string` | -- | Additional CSS classes applied to the `<pre>` element. |
| `children` | `ReactNode` | -- | Alternative to `code` prop. When both are provided, `children` is displayed and `code` is used for copying. |

## Usage

### Basic Code Block

```tsx
<CodeBlock code={`const greeting = "Hello, world!";`} language="ts" />
```

### Multi-line Code

```tsx
<CodeBlock language="tsx" code={`import { Button } from "@charlietogolden/charlie-ui";

function App() {
  return <Button variant="primary">Click me</Button>;
}`} />
```

### Using Children

You can pass code as children instead of the `code` prop:

```tsx
<CodeBlock language="bash">
  npm install @charlietogolden/charlie-ui
</CodeBlock>
```

### Without Copy Button

```tsx
<CodeBlock code="console.log('no copy');" language="js" showCopy={false} />
```

### Without Language Label

```tsx
<CodeBlock code="plain text content" />
```

## Notes

- The copy button uses the Clipboard API (`navigator.clipboard.writeText`).
- After copying, a green checkmark icon appears for 2 seconds before reverting to the copy icon.
- The copy button is invisible by default and fades in on hover (`opacity-0 group-hover:opacity-100`).
- The code block uses `whitespace-pre-wrap` so long lines wrap rather than causing horizontal scroll.
- Icons are from Lucide React (`Copy` and `Check`).
