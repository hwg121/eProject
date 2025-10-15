# ContentIcons Components 🎨

Reusable icon components for displaying content statistics and actions across the admin dashboard.

## 📦 Components

### Chip Components (Statistics)

#### `<ViewsChip />`
Displays view count with eye icon.

```tsx
import { ViewsChip } from '../UI/ContentIcons';

<ViewsChip value={1234} isDarkMode={isDarkMode} />
```

**Props:**
- `value: number | string` - View count
- `isDarkMode?: boolean` - Dark mode support
- ...other `ChipProps`

---

#### `<LikesChip />`
Displays like count with heart icon.

```tsx
import { LikesChip } from '../UI/ContentIcons';

<LikesChip value={567} isDarkMode={isDarkMode} />
```

**Props:**
- `value: number | string` - Like count
- `isDarkMode?: boolean` - Dark mode support
- ...other `ChipProps`

---

#### `<RatingChip />`
Displays rating with star icon (auto-formats to 1 decimal).

```tsx
import { RatingChip } from '../UI/ContentIcons';

<RatingChip value={4.5} isDarkMode={isDarkMode} />
```

**Props:**
- `value: number | string` - Rating value
- `isDarkMode?: boolean` - Dark mode support
- ...other `ChipProps`

---

### Button Components (Actions)

#### `<EditButton />`
Edit action button with tooltip.

```tsx
import { EditButton } from '../UI/ContentIcons';

<EditButton 
  tooltip="Edit content" 
  onClick={() => handleEdit(item)} 
/>
```

**Props:**
- `tooltip: string` - Tooltip text
- `onClick?: () => void` - Click handler
- ...other `IconButtonProps`

---

#### `<DeleteButton />`
Delete action button with tooltip.

```tsx
import { DeleteButton } from '../UI/ContentIcons';

<DeleteButton 
  tooltip="Delete content" 
  onClick={() => handleDelete(item)} 
/>
```

**Props:**
- `tooltip: string` - Tooltip text
- `onClick?: () => void` - Click handler
- ...other `IconButtonProps`

---

#### `<ViewButton />`
View action button with tooltip.

```tsx
import { ViewButton } from '../UI/ContentIcons';

<ViewButton 
  tooltip="View details" 
  onClick={() => handleView(item)} 
/>
```

**Props:**
- `tooltip: string` - Tooltip text
- `onClick?: () => void` - Click handler
- ...other `IconButtonProps`

---

### Compound Components

#### `<ActionButtonsGroup />`
Displays multiple action buttons together.

```tsx
import { ActionButtonsGroup } from '../UI/ContentIcons';

<ActionButtonsGroup
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
  onView={() => handleView(item)}
  showView={true}
  showEdit={true}
  showDelete={true}
/>
```

**Props:**
- `onView?: () => void` - View handler
- `onEdit?: () => void` - Edit handler
- `onDelete?: () => void` - Delete handler
- `showView?: boolean` - Show view button (default: false)
- `showEdit?: boolean` - Show edit button (default: true)
- `showDelete?: boolean` - Show delete button (default: true)

---

#### `<ContentStatsGroup />`
Displays all statistics (views, likes, rating) together.

```tsx
import { ContentStatsGroup } from '../UI/ContentIcons';

<ContentStatsGroup
  views={1234}
  likes={567}
  rating={4.5}
  isDarkMode={isDarkMode}
  layout="horizontal"
/>
```

**Props:**
- `views: number` - View count
- `likes: number` - Like count
- `rating: number` - Rating value
- `isDarkMode?: boolean` - Dark mode support
- `layout?: 'horizontal' | 'vertical'` - Layout direction (default: 'horizontal')

---

## 🎨 Design Tokens

### Colors

**Light Mode:**
- Views: `#e5e7eb` background, `#6b7280` text, `#3b82f6` icon
- Likes: `#e2e8f0` background, `#475569` text, `#ec4899` icon
- Rating: `#fef3c7` background, `#92400e` text, `#fbbf24` icon

**Dark Mode:**
- All chips: `#374151` background, `#d1d5db` text
- Icons maintain their accent colors

**Action Buttons:**
- Edit: `#3b82f6` (Blue)
- Delete: `#ef4444` (Red)
- View: `#6b7280` (Gray)

### Typography
- Font Size: `0.75rem` (12px)
- Font Weight: `600` (Semibold)

### Spacing
- Icon Size: 14px-18px
- Chip Size: `small`
- Button Gap: `8px`

---

## 📋 Usage Examples

### Simple Table Row
```tsx
<TableRow>
  <TableCell>
    <ViewsChip value={item.views} isDarkMode={isDarkMode} />
  </TableCell>
  <TableCell>
    <LikesChip value={item.likes} isDarkMode={isDarkMode} />
  </TableCell>
  <TableCell>
    <RatingChip value={item.rating} isDarkMode={isDarkMode} />
  </TableCell>
  <TableCell>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <EditButton tooltip="Edit" onClick={() => handleEdit(item)} />
      <DeleteButton tooltip="Delete" onClick={() => handleDelete(item)} />
    </Box>
  </TableCell>
</TableRow>
```

### Using Compound Components
```tsx
<TableRow>
  <TableCell>
    <ContentStatsGroup
      views={item.views}
      likes={item.likes}
      rating={item.rating}
      isDarkMode={isDarkMode}
    />
  </TableCell>
  <TableCell>
    <ActionButtonsGroup
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
    />
  </TableCell>
</TableRow>
```

### Card Layout
```tsx
<Card>
  <CardContent>
    <Typography variant="h6">{item.title}</Typography>
    
    <ContentStatsGroup
      views={item.views}
      likes={item.likes}
      rating={item.rating}
      isDarkMode={isDarkMode}
      layout="vertical"
    />
    
    <Box sx={{ mt: 2 }}>
      <ActionButtonsGroup
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
        onView={() => handleView(item)}
        showView={true}
      />
    </Box>
  </CardContent>
</Card>
```

---

## ✨ Benefits

### **Consistency**
- ✅ Same styling across all pages
- ✅ Unified color scheme
- ✅ Consistent icon usage

### **Maintainability**
- ✅ Single source of truth
- ✅ Easy to update globally
- ✅ Reduced code duplication

### **Developer Experience**
- ✅ Simple API
- ✅ TypeScript support
- ✅ Compound components for common patterns

### **Performance**
- ✅ Memoization friendly
- ✅ Small bundle size
- ✅ Efficient re-renders

---

## 🔄 Migration Guide

### Before (Manual Implementation)
```tsx
<Chip
  icon={<VisibilityIcon sx={{ fontSize: 14, color: '#3b82f6 !important' }} />}
  label={Number(item.views).toLocaleString()}
  size="small"
  sx={{
    bgcolor: isDarkMode ? '#374151' : '#e5e7eb',
    color: isDarkMode ? '#d1d5db' : '#6b7280',
    fontWeight: 600,
    fontSize: '0.75rem'
  }}
/>
```

### After (Component)
```tsx
<ViewsChip value={item.views} isDarkMode={isDarkMode} />
```

**Lines of code: 13 → 1** 📉

---

## 🚀 Future Enhancements

Potential additions:
- `<CommentsChip />` - Comment count
- `<SharesChip />` - Share count
- `<DownloadsChip />` - Download count
- `<DuplicateButton />` - Duplicate action
- `<ArchiveButton />` - Archive action

---

## 📝 Notes

- All components support dark mode via `isDarkMode` prop
- Icons from MUI Icons and Lucide React
- Consistent with ContentList and ViewAllContent styling
- Hover effects and transitions included
- Tooltips on all action buttons

