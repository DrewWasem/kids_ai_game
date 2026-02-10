# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

Access the app at: http://localhost:5173

## 3. Backend Configuration

By default, the frontend proxies API calls to `http://localhost:8001`.

To change the backend URL, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:port',
      changeOrigin: true,
    },
  },
}
```

## 4. Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 5. Available Routes

- `/` - Dashboard (protected)
- `/items` - Items management (protected)
- `/settings` - User settings (protected)
- `/login` - Login page (public)

## 6. Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint
```

## 7. Project Customization

### Change App Name

1. Update `index.html` - `<title>` tag
2. Update `src/components/Layout.tsx` - header text
3. Update `package.json` - `name` field

### Change Primary Color

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#your-color-50',
    // ... other shades
  },
}
```

### Add New Routes

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`:

```typescript
<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in `src/components/Layout.tsx`:

```typescript
{ path: '/new-page', label: 'New Page', icon: '⭐' }
```

### Add API Endpoints

1. Create types in `src/types/`
2. Create API functions in `src/services/`
3. Use in components with error handling:

```typescript
import { useToast } from '../contexts/ToastContext';
import { handleApiError } from '../config/api';
import { yourApiFunction } from '../services/yourApi';

const { addToast } = useToast();

try {
  const result = await yourApiFunction();
  addToast('Success!', 'success');
} catch (err) {
  addToast(handleApiError(err), 'error');
}
```

## 8. Testing

### Run All Tests

```bash
npm test
```

### Write a Test

```typescript
import { render, screen } from '../test/test-utils';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 9. Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 10. Troubleshooting

### Port Already in Use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3000, // Change this
}
```

### API Calls Failing

1. Check backend is running
2. Verify proxy configuration in `vite.config.ts`
3. Check browser console for CORS errors
4. Ensure JWT token is valid (check localStorage)

### Dark Mode Not Working

Check that `dark` class is being toggled on `<html>` element in browser DevTools.

### Tests Failing

1. Ensure all dependencies are installed: `npm install`
2. Check test setup file: `src/test/setup.ts`
3. Run with verbose output: `npm test -- --reporter=verbose`
