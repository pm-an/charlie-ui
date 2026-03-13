# AvatarGroup

Displays a horizontal stack of overlapping avatars with an optional overflow indicator when the group exceeds a maximum count.

## Import

```tsx
import { AvatarGroup, Avatar } from "@piotr/charlie-ui";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | **(required)** | `Avatar` components to display in the group. |
| `max` | `number` | -- | Maximum number of avatars to show. Excess avatars are replaced with a `+N` overflow badge. |
| `className` | `string` | -- | Additional CSS classes. |

## Usage

### Basic Group

```tsx
<AvatarGroup>
  <Avatar src="/avatars/alice.jpg" alt="Alice" size="sm" />
  <Avatar src="/avatars/bob.jpg" alt="Bob" size="sm" />
  <Avatar src="/avatars/charlie.jpg" alt="Charlie" size="sm" />
</AvatarGroup>
```

### With Max Limit

When there are more avatars than `max`, the extra ones are hidden and a `+N` badge appears:

```tsx
<AvatarGroup max={3}>
  <Avatar src="/avatars/1.jpg" alt="User 1" size="sm" />
  <Avatar src="/avatars/2.jpg" alt="User 2" size="sm" />
  <Avatar src="/avatars/3.jpg" alt="User 3" size="sm" />
  <Avatar src="/avatars/4.jpg" alt="User 4" size="sm" />
  <Avatar src="/avatars/5.jpg" alt="User 5" size="sm" />
</AvatarGroup>
```

This renders 3 avatars and a `+2` indicator.

## Notes

- Each avatar is wrapped in a ring (`ring-2 ring-bg`) to create visual separation between overlapping avatars.
- The avatars overlap via `-space-x-2` on the container.
- The overflow badge is a 32x32 circle with `bg-white/10` and `text-white/60`.
