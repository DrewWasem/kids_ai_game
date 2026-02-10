# MyApp Frontend

A modern React/TypeScript SaaS frontend template with authentication, dark mode, and full CRUD operations.

## Features

- React 18 with TypeScript
- TanStack Query for data fetching
- React Router for navigation
- TailwindCSS for styling
- Dark mode support
- JWT authentication
- Toast notifications
- Modal components
- File upload with drag-and-drop
- Sortable data tables
- Pagination
- Vitest for testing
- Error boundaries

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

### Test

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── DataTable.tsx
│   ├── ErrorBoundary.tsx
│   ├── FileUploader.tsx
│   ├── Layout.tsx
│   ├── Modal.tsx
│   ├── Pagination.tsx
│   └── Toast.tsx
├── config/          # Configuration
│   └── api.ts       # API client with auth
├── contexts/        # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── hooks/           # Custom hooks
│   └── useAuth.ts
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── Items.tsx
│   ├── Login.tsx
│   └── Settings.tsx
├── services/        # API service layer
│   ├── authApi.ts
│   └── itemsApi.ts
├── test/            # Test utilities
│   ├── mocks/
│   ├── setup.ts
│   └── test-utils.tsx
├── types/           # TypeScript types
│   ├── auth.ts
│   ├── index.ts
│   └── items.ts
├── App.tsx          # Root component
├── index.css        # Global styles
└── main.tsx         # Entry point
```

## API Integration

The frontend proxies API requests to `http://localhost:8001` via Vite's dev server.

All API calls use the `/api/v1` prefix and include JWT authentication headers.

### API Configuration

Edit `vite.config.ts` to change the backend URL:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  },
}
```

## Styling

This template uses TailwindCSS with custom utility classes:

### Button Styles
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Destructive action button

### Cards
- `.card` - Standard card with padding
- `.glass-card` - Glassmorphism card with backdrop blur

### Badges
- `.badge-green` - Success/active status
- `.badge-yellow` - Warning status
- `.badge-red` - Error/inactive status
- `.badge-blue` - Info status
- `.badge-gray` - Neutral status

### Dark Mode

Toggle dark mode with the button in the sidebar. Preference is saved to localStorage.

## Authentication

The app uses JWT tokens stored in localStorage.

### Demo Login

```
Email: demo@example.com
Password: demo123
```

## Testing

Tests use Vitest with React Testing Library.

### Example Test

```typescript
import { render, screen } from '../test/test-utils';
import Dashboard from './Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

## Component Patterns

### API Calls with Error Handling

```typescript
import { useToast } from '../contexts/ToastContext';
import { handleApiError } from '../config/api';

const { addToast } = useToast();

try {
  await someApiCall();
  addToast('Success!', 'success');
} catch (err) {
  addToast(handleApiError(err), 'error');
}
```

### Protected Routes

```typescript
<Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
</Route>
```

### Modal Usage

```typescript
import Modal, { ConfirmDialog } from '../components/Modal';

<Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">
  <p>Content here</p>
</Modal>

<ConfirmDialog
  isOpen={confirmOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure?"
  variant="danger"
/>
```

## Accessibility

All interactive components support:
- Keyboard navigation
- Focus management
- Screen reader labels
- ARIA attributes
- Color contrast (WCAG AA)

## Performance

- TanStack Query handles caching and background refetching
- Error boundaries prevent full-page crashes
- Loading states for async operations
- Optimistic UI updates where appropriate

## License

MIT
